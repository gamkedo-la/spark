export { EventSystem };

import { System }               from "./system.js";

/**
 * system to coalesce event triggers
 */
class EventSystem extends System {
    cpre(spec) {
        spec.iterateTTL = spec.iterateTTL || 0;
        super.cpre(spec);
    }

    // METHODS -------------------------------------------------------------
    iterate(ctx, e) {
        // skip non model entities
        if (e.cat !== "Model") return;

        // is model updated?
        if (e.updated) {
            e.evtUpdated.trigger();
            e.updated = false;
        }

    }

}