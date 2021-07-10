export { ActionSystem };

import { System }       from "./system.js";

/** ========================================================================
 * ActionSystem - manages entities that have an active action queue
 */
class ActionSystem extends System {
    cpre(spec) {
        super.cpre(spec);
        spec.iterateTTL = spec.iterateTTL || 0;
        spec.fixedPredicate = spec.fixedPredicate || ((e) => e.cat === "Model" && !e.passive);
    }
    cpost(spec) {
        super.cpost(spec);
        this.gain = spec.gain || .01;
        this.decay = spec.decay || .01;
        this.waypointRange = spec.waypointRange || 5;
        this.dbg = spec.dbg;
    }

    // METHODS -------------------------------------------------------------
    iterate(ctx, e) {
        // only match entities that have actions pending
        if (!e.currentAction && !e.actions) return;

        // check for completion of current action
        if (e.currentAction) {

            if (e.currentAction.done) {
                if (this.dbg) console.log(`e: ${e} completed action: ${e.currentAction}`);
                // start next action
                e.currentAction = e.actions.shift();
                if (e.currentAction) {
                    e.currentAction.start(e);
                    if (this.dbg) console.log(`e: ${e} 1 started action: ${e.currentAction}`);
                }
            } else {
                e.currentAction.update(ctx);
            }

        } else if (e.actions && e.actions.length) {
            // start a new set of actions... stop moving
            e.speed = 0;

            // start next action
            e.currentAction = e.actions.shift();
            if (e.currentAction) {
                e.currentAction.start(e);
                if (this.dbg) console.log(`e: ${e} 2 started action: ${e.currentAction}`);
            }
        }

    }

}