export { StateSystem };

import { System }       from "./system.js";
import { Model }        from "./model.js";
import { ModelState } from "./modelState.js";

class StateSystem extends System {
    cpre(spec) {
        super.cpre(spec);
        spec.iterateTTL = spec.iterateTTL || 0;
    }

    // METHODS -------------------------------------------------------------
    iterate(ctx, e) {

        // state predicates
        if (e.speed) {
            e.state = ModelState.walk;
        } else {
            e.state = ModelState.idle;
        }

    }

}