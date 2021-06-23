export { FindWorkstationScheme };

import { AiGoal }           from "../base/ai/aiGoal.js";
import { AiPlan }           from "../base/ai/aiPlan.js";
import { AiScheme }         from "../base/ai/aiScheme.js";
import { EQuery }           from "../base/eQuery.js";
import { Fmt }              from "../base/fmt.js";
import { Mathf }            from "../base/math.js";
import { Util } from "../base/util.js";
import { Workstation }      from "../workstation.js";


class FindWorkstationScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = (goal) => goal === AiGoal.manage;
        this.preconditions.push((state) => state.a_workstationTag !== undefined);
        this.preconditions.push((state) => state.v_targetTag === undefined);
        this.preconditions.push((state) => state.v_locationTag !== "workstation");
        this.effects.v_targetTag = "workstation";
    }

    deriveState(env, actor, state) {
        if (!state.hasOwnProperty("workstationTag")) state.a_workstationTag = actor.workstationTag;
    }

    generatePlan(spec={}) {
        return new FindWorkstationPlan(spec);
    }

}

class FindWorkstationPlan extends AiPlan {
    prepare(actor, state) {
        super.prepare(actor, state);
        // prepare query to find workstation w/ matching tag
        this.query = new EQuery((e) => (e instanceof(Workstation) && e.reserveTag === state.a_workstationTag && !e.conditions.has(e.occupiedCondition)));
        // submit query to queue...
        this.getQueryQ().push(this.query);
        this.target;
        return true;
    }

    update(ctx) {
        //console.log("update query: " + Fmt.ofmt(this.query));
        if (!this.query.done) return false;
        // find best match...
        let bestDist;
        let best;
        for (const target of this.query.matches) {
            let dist = Mathf.distance(this.actor.x, this.actor.y, target.x, target.y);
            if (bestDist === undefined || dist<bestDist) {
                bestDist = dist;
                best = target;
            }
        }
        // find best approach to target
        let bestApproach = best;
        let bestApproachDist;
        if (best.approaches) {
            for (const approach of best.approaches) {
                // is approach occupied?
                if (!Util.empty(this.findOverlaps(approach, (v !== this.actor && v.collider && (v.collider.blocking & this.actor.collider.blocking))))) continue;
                let dist = Mathf.distance(this.actor.x, this.actor.y, approach.x, approach.y);
                if (bestApproachDist === undefined || dist<bestApproachDist) {
                    bestApproachDist = dist;
                    bestDist = dist;
                    bestApproach = approach;
                }
            }
        }
        this.target = best;
        this.approach = bestApproach;
        this.cost = bestDist;
        return true;
    }

    finalize() {
        // handle failure
        if (!this.target) {
            if (this.dbg) console.log(`FindWorkstationPlan: can't find workstation for tag: ${this.actor.workstationTag}`);
            return undefined;
        }
        // handle success
        this.state.v_target = this.approach;
        this.state.v_workstation = this.target;
        return {
            effects: this.state,
            utility: 1,
            cost: this.cost,
        }
    }
}