import { Action }               from "../base/action.js";
import { Atts }                 from "../base/atts.js";

export { PauseAction };

class PauseAction extends Action {

    start(actor) {
        Atts.paused = true;
        console.log(`starting pause action`);
    }

    update(ctx) {
        this.done = true;
        return true;
    }
}