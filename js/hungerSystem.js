export { HungerSystem };

import { System }               from "./base/system.js";
import { Condition }            from "./base/condition.js";

/**
 * system to manage entity hunger
 */
class HungerSystem extends System {
    cpre(spec) {
        spec.iterateTTL = spec.iterateTTL || 1000;
        spec.fixedPredicate = spec.fixedPredicate || ((e) => e.cat === "Model" && !e.passive && e.maxFedTTL);
        super.cpre(spec);
    }

    // METHODS -------------------------------------------------------------
    iterate(ctx, e) {
        // update current fed timer (if non-zero)
        if (e.fedTTL > 0) e.fedTTL -= ctx.deltaTime;
        if (e.fedTTL <= 0) {
            if (!e.conditions.has(Condition.hungry)) {
                if (this.dbg) console.log(`${e} has become hungry`);
                e.conditions.add(Condition.hungry);
            }
        } else {
            if (e.conditions.has(Condition.hungry)) {
                if (this.dbg) console.log(`${e} is no longer hungry`);
                e.conditions.delete(Condition.hungry);
            }
        }

        // update current quench timer (if non-zero)
        if (e.quenchTTL > 0) e.quenchTTL -= ctx.deltaTime;
        if (e.quenchTTL <= 0) {
            if (!e.conditions.has(Condition.thirsty)) {
                if (this.dbg) console.log(`${e} has become thirsty`);
                e.conditions.add(Condition.thirsty);
            }
        } else {
            if (e.conditions.has(Condition.thirsty)) {
                if (this.dbg) console.log(`${e} is no longer thirsty`);
                e.conditions.delete(Condition.thirsty);
            }
        }

    }

}