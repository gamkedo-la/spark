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
        this.preconditions.push((state) => state.v_targetTag === undefined);
        this.preconditions.push((state) => state.v_locationTag !== state.v_wantTag);
        this.effects.push((state) => state.v_targetTag = state.v_wantTag);
    }

    generatePlan(spec={}) {
        return new FindPlan(spec);
    }

}

class FindPlan extends AiPlan {
    prepare(actor, state) {
        super.prepare(actor, state);
        // prepare query to find target w/ matching tag
        console.log(`find plan wantTag: ${state.v_wantTag} reserveTag: ${state.a_reserveTag}`);
        this.query = new EQuery((e) => (
            e.cls === state.v_wantTag) && 
            (!e.reserveTag || (e.reserveTag === state.a_reserveTag)) && 
            !e.isOccupied);
        // submit query to queue...
        this.getQueryQ().push(this.query);
        this.target = undefined;
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
        /*
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
        */

        this.target = best;
        //this.approach = bestApproach;
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
        //this.state.v_approach = this.approach;
        this.state.v_target = this.target;
        return {
            effects: this.state,
            utility: 1,
            cost: this.cost,
        }
    }

}