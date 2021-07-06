export { AiGoalSystem }

import { AiGoal }               from "./aiGoal.js";
import { System }               from "../system.js";
import { Atts }                 from "../atts.js";

// =========================================================================
class AiGoalSystem extends System {
    // STATIC VARIABLES ----------------------------------------------------
    static dfltIterateTTL = 1000;
    //static dfltFailTTL = 30000;
    static dfltFailTTL = 5000;

    // CONSTRUCTOR ---------------------------------------------------------
    cpre(spec) {
        super.cpre(spec);
        spec.iterateTTL = spec.iterateTTL || AiGoalSystem.dfltIterateTTL;
        spec.fixedPredicate = spec.fixedPredicate || ((e) => e.cat === "Model" && e.ai);
    }
    cpost(spec) {
        super.cpost(spec);
        this.getenv = spec.getenv || (() => Atts);
        this.failTTL = spec.failTTL || AiGoalSystem.dfltFailTTL;
    }

    // METHODS -------------------------------------------------------------
    iterate(ctx, e) {
        // skip entities w/ no AI or no goals set
        if (!e.ai || !e.ai.goals) return;

        // update failed goal penalty box
        for (const goal of Object.keys(e.ai.failedGoals)) {
            let ttl = e.ai.failedGoals[goal];
            ttl -= this.deltaTime;
            e.ai.failedGoals[goal] = ttl;
            if (ttl <= 0) {
                if (this.dbg) console.log(`goal ${AiGoal.toString(goal)} removed from penalty box`);
                delete e.ai.failedGoals[goal];
            }
        }

        // skip entity if current goal is set and state is pending...
        if (e.ai.currentGoal && (e.ai.goalState === AiGoal.gpending || e.ai.goalState === AiGoal.gprocess)) return;

        // handle failed goal ...
        if (e.ai.currentGoal && e.ai.goalState === AiGoal.gfail) {
            // add goal to penalty box...
            e.ai.failedGoals[e.ai.currentGoal.goal] = this.failTTL;
            //.push({ ttl: this.failTTL, goal: e.ai.currentGoal });
            if (this.dbg) console.log(`goal ${e.ai.currentGoal} failed, added to penalty box`);
        }

        // reset current goal state
        e.ai.currentGoal = undefined;
        e.ai.goalState = AiGoal.gpending;
        e.ai.solutions = undefined;
        e.ai.currentSolution = undefined;

        // iterate through current goals, find goal w/ best score
        let bestScore = 0;
        let best = undefined;
        for (const goal of e.ai.goals) {
            // check against penalty box...
            if (goal.goal in e.ai.failedGoals) {
                //console.log(`skipping goal: ${goal} in penalty box`);
                continue;
            }
            // compute score
            let score = goal.influence.score(this.getenv(), e);
            //console.log("goal: " + goal + " score: " + score);
            // check against best
            if (score > bestScore) {
                bestScore = score;
                best = goal;
            }
        }
        // has goal changed?
        if (best && best !== e.ai.currentGoal) {
            if (this.dbg) console.log(`AI: ${e} changing goal from ${e.ai.currentGoal} to ${best}`);
            e.ai.currentGoal = best;
            e.ai.goalState = AiGoal.gpending;
        }
    }

}