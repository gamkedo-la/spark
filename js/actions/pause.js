import { Action }               from "../base/action.js";
import { Atts }                 from "../base/atts.js";

export { PauseAction };

class PauseAction extends Action {

    start(actor) {
        Atts.paused = true;
    }

    update(ctx) {
        this.done = true;
        return true;
    }
}
