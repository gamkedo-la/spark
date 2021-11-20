export { DisableGloomAction, FinishGameAction };

import { Action }               from "../base/action.js";
import { Atts }                 from "../base/atts.js";
import { Config }               from "../base/config.js";
import { Event }                 from "../base/event.js";

class DisableGloomAction extends Action {

    constructor(spec={}) {
        super(spec);
    }

    start(actor) {
        Config.dbg.hideGloom = true;
    }

    update(ctx) {
        this.done = true;
        return true;
    }
}

class FinishGameAction extends Action {

    constructor(spec={}) {
        super(spec);
        this.eventQ = spec.eventQ || Atts.gameEventQ;
    }

    start(actor) {
        this.eventQ.push(new Event("game.finish"));
    }

    update(ctx) {
        this.done = true;
        return true;
    }
}
