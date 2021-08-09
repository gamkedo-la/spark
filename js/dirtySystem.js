export { Dirty, DirtySystem };

import { System }               from "./base/system.js";
import { Condition }            from "./base/condition.js";

class Dirty {
    // FIXME: tie this to time in a day
    static dfltDirtyTTL = 5000;
    constructor(spec={}) {
        this.jitter = spec.jitter || .5;
        this.maxTTL = spec.maxTTL || Dirty.dfltDirtyTTL;
        // have first TTL be random amount of max TTL
        this.ttl = Math.random() * this.maxTTL
        this.cleaned = false;
    }
}

/**
 * system to manage collection of "dirt" on objects
 */
class DirtySystem extends System {
    cpre(spec) {
        spec.iterateTTL = spec.iterateTTL || 1000;
        spec.fixedPredicate = spec.fixedPredicate || ((e) => e.cat === "Model" && e.dirty);
        super.cpre(spec);
    }

    // METHODS -------------------------------------------------------------
    iterate(ctx, e) {
        // if dirty spot was cleaned... reset dirty ttl
        if (e.dirty.cleaned) {
            let jitter = e.dirty.jitter * e.dirty.maxTTL;
            if (Math.random() > .5) jitter *= -1;
            e.dirty.ttl = e.dirty.maxTTL + jitter;
            e.dirty.cleaned = false;
            if (e.conditions.has(Condition.dirty)) {
                if (this.dbg) console.log(`${e} is no longer dirty`);
                e.conditions.delete(Condition.dirty);
            }
        }
        // update current timer (if non-zero)
        e.dirty.ttl -= this.deltaTime;
        if (e.dirty.ttl <= 0) {
            if (!e.conditions.has(Condition.dirty)) {
                if (this.dbg) console.log(`${e} has become dirty`);
                e.conditions.add(Condition.dirty);
            }
        }
    }

}