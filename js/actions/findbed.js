export { FindBedScheme };

import { AiGoal }           from "../base/ai/aiGoal.js";
import { AiPlan }           from "../base/ai/aiPlan.js";
import { AiScheme }         from "../base/ai/aiScheme.js";
import { EQuery }           from "../base/eQuery.js";
import { Fmt }              from "../base/fmt.js";
import { Mathf }            from "../base/math.js";
import { ModelState }       from "../base/modelState.js";
import { Bed }              from "../bed.js";


class FindBedScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = (goal) => goal === AiGoal.sleep;
        this.preconditions.push((state) => state.a_bedTag !== undefined);
        this.preconditions.push((state) => state.v_targetTag === undefined);
        this.preconditions.push((state) => state.v_locationTag !== "bed");
        this.effects.v_targetTag = "bed";
    }

    deriveState(env, actor, state) {
        if (!state.hasOwnProperty("bedTag")) state.a_bedTag = actor.bedTag;
    }

    generatePlan(spec={}) {
        return new FindBedPlan(spec);
    }

}

class FindBedPlan extends AiPlan {
    prepare(actor, state) {
        super.prepare(actor, state);
        // prepare query to find bed w/ matching tag
        this.query = new EQuery((e) => (e instanceof(Bed) && e.bedTag === state.a_bedTag && e.state === ModelState.idle));
        // submit query to queue...
        this.getQueryQ().push(this.query);
        this.bed;
        return true;
    }

    update(ctx) {
        //console.log("update query: " + Fmt.ofmt(this.query));
        if (!this.query.done) return false;
        // find best match...
        let bestDist;
        let best;
        for (const bed of this.query.matches) {
            let dist = Mathf.distance(this.actor.x, this.actor.y, bed.x, bed.y);
            if (bestDist === undefined || dist<bestDist) {
                bestDist = dist;
                best = bed;
            }
        }
        this.bed = best;
        this.cost = bestDist;
        return true;
    }

    finalize() {
        // handle failure
        if (!this.bed) {
            if (this.dbg) console.log(`FindBedPlan: can't find bed for tag: ${this.actor.bedTag}`);
            return undefined;
        }
        // handle success
        this.state.v_target = this.bed;
        this.state.v_bed = this.bed;
        return {
            effects: this.state,
            utility: 1,
            cost: this.cost,
        }
    }
}