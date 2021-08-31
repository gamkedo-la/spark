export { WaitAction };
import { Action }               from "../base/action.js";
import { Fmt }                  from "../base/fmt.js";

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