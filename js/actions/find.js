export { FindScheme };

import { AiPlan }           from "../base/ai/aiPlan.js";
import { AiScheme }         from "../base/ai/aiScheme.js";
import { EQuery }           from "../base/eQuery.js";
import { Fmt }              from "../base/fmt.js";
import { Mathf }            from "../base/math.js";


class FindScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = spec.goalPredicate || ((v) => true);
        this.preconditions.push((state) => state.v_wantTag !== undefined);
        this.preconditions.push((state) => state.v_findTag !== state.v_wantTag);
        this.preconditions.push((state) => state.v_moveTag !== state.v_wantTag);
        this.effects.push((state) => state.v_findTag = state.v_wantTag);
    }

    generatePlan(spec={}) {
        return new FindPlan(spec);
    }

}

class FindPlan extends AiPlan {
    prepare(actor, state) {
        super.prepare(actor, state);
        // prepare query to find target w/ matching tag
        this.query = new EQuery((e) => 
            (!state.v_findPredicate && e.cls === state.v_wantTag) && 
            (!state.v_findPredicate || state.v_findPredicate(e)) && 
            (!e.ownerTag || (e.ownerTag === state.a_ownerTag)) && 
            !e.isOccupied);
        // submit query to queue...
        this.getQueryQ().push(this.query);
        this.target = undefined;
        return true;
    }

    update(ctx) {
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

        this.target = best;
        this.cost = bestDist;
        return true;
    }

    finalize() {
        // handle failure
        if (!this.target) {
            if (this.dbg) console.log(`FindPlan: can't find object for tag: ${this.state.v_wantTag}`);
            return undefined;
        }
        // handle success
        let effects = [
            (state) => state.v_target = this.target,
        ];
        return {
            effects: effects,
            utility: 1,
            cost: this.cost,
        }
    }

}