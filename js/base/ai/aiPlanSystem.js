export { AiPlanSystem }

import { Fmt }                  from "../fmt.js";
import { Mathf }                from "../math.js";
import { System }               from "../system.js";
import { Atts }                 from "../atts.js";
import { AiGoal }               from "./aiGoal.js";
import { AiSolution }           from "./aiSolution.js";

class AiPlanNode {
    constructor(parent, depth, state, effects, plan) {
        this.parent = parent;
        this.depth = depth;
        this.state = state;
        this.effects = effects;
        this.plan = plan;
    }
}

class AiPlanSystem extends System {
    // STATIC VARIABLES ----------------------------------------------------
    static dfltIterateTTL = 100;
    static maxSchemeDepth = 10;

    // CONSTRUCTOR ---------------------------------------------------------
    cpre(spec) {
        super.cpre(spec);
        spec.iterateTTL = spec.iterateTTL || AiPlanSystem.dfltIterateTTL;
        spec.fixedPredicate = spec.fixedPredicate || ((e) => e.cat === "Model" && e.ai);
    }
    cpost(spec) {
        super.cpost(spec);
        this.getenv = spec.getenv || (() => Atts);
    }

    // STATIC METHODS ------------------------------------------------------
    static _build(env, actor, schemes, goal, parent, leaves) {
        let foundOne = false;
        // go through each action available at this node and see if we can use it here
        for (const scheme of schemes) {
            // check scheme for viability...
            let sinfo = scheme.check(actor, parent.state);
            // if not viable skip...
            if (!sinfo) {
                //console.log(`scheme: ${scheme} not viable for state: ${Fmt.ofmt(parent.state)}`);
                continue;
            }
            //console.log(`scheme: ${scheme} gives: ${Fmt.ofmt(sinfo)}`);
            // apply effects
            let state = Object.assign({}, parent.state);
            if (state.hasOwnProperty("a_conditions")) state.a_conditions = new Set(state.a_conditions);
            if (sinfo.effects) sinfo.effects.forEach((effect) => effect(state));
            // create plan associated w/ scheme
            // FIXME: pass thru dbg
            let plan = scheme.generatePlan({dbg: true});
            // create node for plan associated with scheme
            let node = new AiPlanNode(parent, parent.depth+1, state, sinfo.effects, plan);
            // check for goal state
            let goalTag = AiGoal.toString(goal);
            if (state[goalTag] === true) {
                // found solution to goal
                leaves.push(node);
                foundOne = true;
            } else {
                // failsafe against looping schemes...
                if (node.depth > AiPlanSystem.maxSchemeDepth) continue;
                // not at solution, evaluate again with updated state
                foundOne |= AiPlanSystem._build(env, actor, schemes, goal, node, leaves);
            }
        }
        return foundOne;
    }

    static buildPlans(env, actor, schemes, goal) {
        // filter schemes based on goal
        let viableSchemes = schemes.filter((scheme) => scheme.match(goal));
        //console.log(`schemes: ${schemes} viableSchemes: ${viableSchemes}`);
        if (!viableSchemes || viableSchemes.length === 0) return [];
        // build initial state based on schemes
        let state = {};
        for (const scheme of schemes) {
            scheme.deriveState(env, actor, state);
        }
        //console.log("initial state: " + Fmt.ofmt(state));
        // determine AI plan solution based on goal and viable schemes...
        let snodes = [];  // solution nodes
        let parent = new AiPlanNode(undefined, 0, state, undefined, undefined);
        let found = AiPlanSystem._build(env, actor, viableSchemes, goal, parent, snodes);
        if (!found) return [];
        // each solution is translated into a list of AiPlans
        let solutions = [];
        for (const snode of snodes) {
            let solution = new AiSolution(state);
            // walk plan node from solution node back to root
            for (let node=snode; node.parent; node=node.parent) {
                solution.plans.unshift(node.plan);
                solution.planEffects.unshift(node.effects);
            }
            //console.log(`=====> pushing solution ${solution}`);
            solutions.push(solution);
        }
        return solutions;
    }


    // METHODS -------------------------------------------------------------

    prepareSolution(ctx, e, solution) {

        //console.log(`prepare solution: ${solution} w/ state: ${Fmt.ofmt(solution.state)}`);

        while (solution.currentIndex < solution.plans.length) {
            let plan = solution.plans[solution.currentIndex];
            // prepare plan state
            //console.log(`======== plan system state before: ${Fmt.ofmt(solution.state)}`);
            // prepare
            if (!plan.prepared && !plan.prepare(e, solution.state)) {
                // handle prep failure
                if (this.dbg) console.log(`solution: ${solution} failed during plan preparation for: ${plan}`);
                solution.status = AiSolution.failed;
                return;
            }
            plan.prepared = true;
            // update
            if (!plan.update(ctx)) {
                // update return false if plan is still needing work
                break;
            }
            // finalize
            let planInfo = plan.finalize();
            if (!planInfo) {
                // handle plan failure
                if (this.dbg) console.log(`solution: ${solution} failed during plan finalization for: ${plan}`);
                solution.status = AiSolution.failed;
                return;
            }
            //console.log(`==> prepare solution ready to finalize: ${solution} w/ state: ${Fmt.ofmt(solution.state)}`);
            // update solution state
            // -- apply state effects from planning
            let planEffects = solution.planEffects[solution.currentIndex];
            if (planEffects) {
                planEffects.forEach((effect) => effect(solution.state));
            }
            // -- apply state effects from preparation
            if (planInfo.effects) planInfo.effects.forEach((effect) => effect(solution.state));
            /*
            let state = Object.assign({}, solution.state, planInfo.effects);
            for (const effect of planInfo.effects) {
                effect(state);
            }
            solution.state = state;
            */
            // cost is summed
            solution.cost += planInfo.cost;
            // utility is averaged
            solution.utility = Mathf.addAvgTerm(solution.terms, solution.utility, planInfo.utility);
            solution.terms++;
            // handle any generated processes associated w/ plan
            if (planInfo.processes) {
                solution.processes = solution.processes.concat(planInfo.processes);
            }
            // advance plan index
            solution.currentIndex++;
        }

        // determine if solution is ready
        // -- have all plans been prepared
        if (solution.currentIndex >= solution.plans.length) {
            solution.status = AiSolution.ready;
        }

    }

    iterate(ctx, e) {
        //if (e.ai) console.log("plan system ai state: " + Fmt.ofmt(e.ai));
        // skip entities w/out a current goal
        if (!e.ai || !e.ai.currentGoal || e.ai.goalState !== AiGoal.gpending) return;
        // do we need to build potential solutions for current goal
        if (!e.ai.solutions) {
            e.ai.solutions = AiPlanSystem.buildPlans(this.getenv(), e, e.ai.schemes, e.ai.currentGoal.goal);
            // if no solution... fail goal
            if (!e.ai.solutions) {
                if (this.dbg) console.log("no solution for goal: " + e.ai.currentGoal);
                e.ai.goalState = AiGoal.gfail;
            }
            if (this.dbg) {
                for (const solution of e.ai.solutions) {
                    console.log("solution: " + solution.plans.map((plan) => plan.constructor.name));
                }
            }
        }

        // prepare solutions
        // -- iterate on each solution
        // -- iterate on solution preparation until all plans have been prepared or have failed
        let pending = 0;
        for (const solution of e.ai.solutions) {
            // if solution is pending... prepare
            if (solution.status === AiSolution.pending) {
                this.prepareSolution(ctx, e, solution);
                // check if solution is still pending... 
                if (solution.status === AiSolution.pending) pending++;
            }
        }

        // are any solutions still pending?
        // -- if so, nothing else to do this iteration
        if (pending) {
            return;
        }

        // all solutions have been prepared... pick best solution
        let best;
        for (const solution of e.ai.solutions) {
            if (solution.status === AiSolution.ready) {
                if (!best || (solution.utility > best.utility) || (solution.utility === best.utility && solution.cost < best.cost)) {
                    best = solution;
                }
            }
        }

        // advance best solution
        if (best) {
            e.ai.goalState = AiGoal.gprocess;
            e.ai.currentSolution = best;
            e.ai.currentSolution.currentIndex = 0;
            if (this.dbg) console.log("AiPlaySystem: goalState=>process solution: " + e.ai.currentSolution);

        // or handle no solution...
        } else {
            if (this.dbg) console.log("no ready solution for goal: " + e.ai.currentGoal);
            e.ai.goalState = AiGoal.gfail;
        }

    }
}
