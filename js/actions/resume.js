import { Action }               from "../base/action.js";
import { Atts }                 from "../base/atts.js";

export { ResumeAction };

class ResumeAction extends Action {

    start(actor) {
        Atts.paused = false;
    }

    update(ctx) {
        this.done = true;
        return true;
    }
}
