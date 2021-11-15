export { ResetMoraleAction };

import { Action } from "../base/action.js";

class ResetMoraleAction extends Action {

    start(actor) {
        // reset actor's morale
        if (actor.morale) {
            actor.morale.reset();
        }
    }

    update(ctx) {
        this.done = true;
        return this.done;
    }

}
