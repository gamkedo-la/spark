export { WaitAction };

import { Action }               from "../base/action.js";


class WaitAction extends Action {
    static dfltTTL = 1000;

    constructor(spec={}) {
        super(spec);
        this.ttl = spec.ttl || PauseAction.dfltTTL;
    }

    start(actor) {
        console.log(`starting wait action`);
    }

    update(ctx) {
        console.log(`waiting...`);
        this.ttl -= ctx.deltaTime;
        if (this.ttl <= 0) console.log(`wait is done`);
        return this.ttl <= 0;
    }

}