export { WaitAction, WaitForDialog };
import { Action }               from "../base/action.js";
import { Atts } from "../base/atts.js";
import { Dialog }               from "../base/dialog.js";
import { Fmt }                  from "../base/fmt.js";
import { Event }                from "../base/event.js";

class WaitAction extends Action {
    static dfltTTL = 1000;
    constructor(spec={}) {
        super(spec);
        this.ttl = spec.ttl || WaitAction.dfltTTL;
    }

    start(actor) {
        this.actor = actor;
    }

    update(ctx) {
        this.ttl -= ctx.deltaTime;
        if (this.ttl <= 0) {
            this.done = true;
        }
        return this.done;
    }

    toString() {
        return Fmt.toString(this.constructor.name, this.ttl);
    }
}

class WaitForDialog extends Action {
    static dfltTTL = 1000;
    constructor(spec={}) {
        super(spec);
        this.xdialog = spec.xdialog || {};
        this.eventQ = spec.eventQ || Atts.gameEventQ;
    }

    start(actor) {
        this.actor = actor;
        this.xdialog.actor = actor;
        this.dialog = new Dialog(this.xdialog);
        this.eventQ.push(new Event("npc.dialog", {actor: this.actor, dialog: this.dialog}));
    }

    update(ctx) {
        if (this.dialog.done) {
            this.done = true;
        }
        return this.done;
    }

    toString() {
        return Fmt.toString(this.constructor.name, this.dialog);
    }
}