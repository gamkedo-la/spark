export { StateSystem };

import { System }       from "./system.js";
import { Model }        from "./model.js";
import { ModelState }   from "./modelState.js";
import { Condition }    from "./condition.js";

class StateSystem extends System {
    cpre(spec) {
        super.cpre(spec);
        spec.iterateTTL = spec.iterateTTL || 0;
        spec.fixedPredicate = spec.fixedPredicate || ((e) => e.cat === "Model" && !e.passive);
    }

    // METHODS -------------------------------------------------------------
    iterate(ctx, e) {

        let wantState;

        // check conditions (in order of precedence)
        if (e.conditions) {
            if (e.conditions.has(Condition.asleep)) {
                wantState = ModelState.sleep;
            } else if (e.conditions.has(Condition.seated)) {
                wantState = ModelState.seated;
            } else if (e.conditions.has(Condition.occupied)) {
                wantState = ModelState.occupied;
            } else if (e.conditions.has(Condition.opened)) {
                wantState = ModelState.open;
            } else if (e.conditions.has(Condition.cast)) {
                wantState = ModelState.cast;
            } else if (e.conditions.has(Condition.sparked)) {
                wantState = ModelState.sparked;
            } else if (e.conditions.has(Condition.powered)) {
                wantState = ModelState.powered;
            }
        }

        // handle movement states
        if (!wantState) {
            // state predicates
            if (e.speed) {
                wantState = ModelState.walk;
            } else {
                wantState = e.dfltState;
            }
        }

        // change state (if needed)
        if (wantState && wantState !== e.state) {
            if (this.dbg) console.log(`${e} change state from: ${ModelState.toString(e.state)} to ${ModelState.toString(wantState)}`);
            e.state = wantState;
            e.updated = true;
        }

    }

}