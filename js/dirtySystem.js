export { WorkTimer, DirtySystem };

import { System }               from "./base/system.js";
import { Condition }            from "./base/condition.js";
import { Fmt } from "./base/fmt.js";

class WorkTimer {
    // FIXME: tie this to time in a day
    static dfltTTL = 5000;
    constructor(spec={}) {
        this.jitter = spec.jitter || .5;
        this.maxTTL = spec.maxTTL || WorkTimer.dfltTTL;
        // have first TTL be random amount of max TTL
        this.ttl = Math.random() * this.maxTTL
        this.needsReset = false;
        this.condition = spec.condition || Condition.dirty;
    }
}

/**
 * system to manage work timers (dirty, restock)
 */
class DirtySystem extends System {
    cpre(spec) {
        spec.iterateTTL = spec.iterateTTL || 1000;
        spec.fixedPredicate = spec.fixedPredicate || ((e) => e.cat === "Model" && (e.dirty || e.restock));
        super.cpre(spec);
    }

    // METHODS -------------------------------------------------------------
    iterate(ctx, e) {
        for (const tag of ["dirty", "restock"]) {
            let timer = e[tag];
            if (!timer) continue;

            // check for timer reset
            if (timer.needsReset) {
                let jitter = timer.jitter * timer.maxTTL;
                if (Math.random() > .5) jitter *= -1;
                timer.ttl = timer.maxTTL + jitter;
                timer.needsReset = false;
                if (e.conditions.has(timer.condition)) {
                    if (this.dbg) console.log(`${e} is no longer ${Condition.toString(timer.condition)}`);
                    e.conditions.delete(timer.condition);
                }
            }
            // update current timer (if non-zero)
            timer.ttl -= this.deltaTime;
            if (timer.ttl <= 0) {
                if (!e.conditions.has(timer.condition)) {
                    if (this.dbg) console.log(`${e} has become ${Condition.toString(timer.condition)}`);
                    e.conditions.add(timer.condition);
                }
            }
        }
    }

}