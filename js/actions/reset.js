export { ResetMoraleAction };

import { Action } from "../base/action.js";

class ResetMoraleAction extends Action {

    start(actor) {
        // reset actor's morale
        if (actor.morale) {
            console.log(`actor ${actor} morale reset`);
            actor.morale.reset();
        }
    }

    update(ctx) {
        this.done = true;
        return this.done;
    }

}