export { AiDirectiveSystem }

import { System }               from "../system.js";
import { Atts }                 from "../atts.js";

class AiDirectiveSystem extends System {
    // STATIC VARIABLES ----------------------------------------------------
    static dfltIterateTTL = 1000;

    // CONSTRUCTOR ---------------------------------------------------------
    cpre(spec) {
        super.cpre(spec);
        spec.iterateTTL = spec.iterateTTL || AiDirectiveSystem.dfltIterateTTL;
    }
    cpost(spec) {
        super.cpost(spec);
        this.getenv = spec.getenv || (() => Atts);
    }

    // PROPERTIES ----------------------------------------------------------
    get env() {
        return this.getenv();
    }

    // METHODS -------------------------------------------------------------
    iterate(ctx, e) {
        // skip non entities w/out AI state
        if (!e.ai) return;
        // iterate through AI directives, find directive w/ best score
        let bestScore = 0;
        let bestDirective = undefined;
        for (const directive of e.ai.directives) {
            // compute score
            let score = directive.influence.score(this.env, e);
            //console.log("influence: " + directive.influence);
            //console.log("score: " + score);
            // check against best
            if (score > bestScore) {
                bestScore = score;
                bestDirective = directive;
            }
        }
        // has directive changed?
        if (bestDirective && bestDirective !== e.ai.currentDirective) {
            if (this.dbg) console.log(`AI: ${e} changing directive from ${e.ai.currentDirective} to ${bestDirective}`);
            e.ai.currentDirective = bestDirective;
            e.ai.goals = Array.from(bestDirective.goals);
            console.log("e.ai.goals: " + e.ai.goals);
            e.ai.currentGoal = undefined;
            e.ai.failedGoals = [];
        }
    }

}