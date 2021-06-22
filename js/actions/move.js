export { MoveScheme, MovePlan };

import { AiScheme }         from "../base/ai/aiScheme.js";
import { AiPlan }           from "../base/ai/aiPlan.js";
import { AiProcess }        from "../base/ai/aiProcess.js";
import { LevelNode }        from "../lvlGraph.js";
import { Fmt } from "../base/fmt.js";

class MoveScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = (goal) => true;
        this.preconditions.push((state) => state.v_targetTag !== undefined);
        this.preconditions.push((state) => state.v_locationTag !== state.v_targetTag);
    }

    deriveState(env, actor, state) {
        if (!state.hasOwnProperty("pos")) state.a_pos = new LevelNode(actor.x, actor.y, actor.layer);
    }

    check(actor, state) {
        this.effects.v_locationTag = state.v_targetTag;
        this.effects.v_targetTag = undefined;
        return super.check(actor, state);
    }

    generatePlan(spec={}) {
        return new MovePlan(spec);
    }
}

class MovePlan extends AiPlan {
    prepare(actor, state) {
        super.prepare(actor, state);
        if (!this.state.v_target) {
            console.log("MovePlan: state missing entity target");
            return false;
        }
        if (!this.state.a_pos) {
            console.log("MovePlan: state missing entity pos");
            return false;
        }
        return true;
    }

    update(ctx) {
        // find path to target ...
        // -- does target have a port list?
        let targets;
        if (Object.getPrototypeOf(this.state.v_target).hasOwnProperty("approaches")) {
            //console.log("=== has ports property");
            targets = this.state.v_target.approaches;
            //console.log("ports: " + Fmt.ofmt(targets));
        } else {
            //console.log("=== does not have ports property");
            targets = [ new LevelNode(this.state.v_target.x, this.state.v_target.y, this.state.v_target.layer) ];
        }
        // iterate through possible targets, find best path
        let best;
        let bestPath;
        for (const target of targets) {
            let pathinfo = this.getPathfinder().find(this.state.a_pos, target);
            //console.log(`pathfinder from ${this.state.a_pos} to ${target} gives: ${Fmt.ofmt(pathinfo)}`);
            if (!pathinfo) continue;
            if (!best || pathinfo.cost < bestPath.cost) {
                best = target;
                bestPath = pathinfo;
            }
        }
        this.target = best;
        this.pathinfo = bestPath;
        return true;
    }

    finalize() {
        // handle failure
        if (!this.pathinfo) {
            if (this.dbg) console.log("MovePlan failed: no path to target: " + this.target);
            return false;
        }
        //console.log("move pathinfo: " + Fmt.ofmt(this.pathinfo));
        // handle success
        this.state.v_target = undefined;
        this.state.a_pos = this.target;
        return {
            effects: this.state,
            utility: 1,
            cost: this.pathinfo.cost,
            processes: [
                new MoveProcess({actions: this.pathinfo.actions}),
            ]
        }
    }

}

class MoveProcess extends AiProcess {
    constructor(spec={}) {
        super(spec);
        this.actions = spec.actions || [];
    }

    prepare(actor) {
        // set actor's action queue to be the individual actions from movement process...
        actor.actions = this.actions.slice(0);
        console.log("move actor actions: " + actor.actions);
        return true;
    }

    update(ctx) {
        if (this.actions.length === 0) return true;
        // wait for actions to be completed
        let lastAction = this.actions[this.actions.length-1];
        return lastAction.done;
    }

    finalize() {
        // FIXME: in here is where we would put logic to handle movement failures... 
        // -- e.g.: if the actor gets stuck somewhere, we should be able to detect it... 
        // -- detection would be done in process.  could use a timer for each step.  if not completed in time, assume that the actor is stuck and fail the overall AI action...
        return true;
    }
}