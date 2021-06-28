export { LeaveAction };

import { Action }           from "../base/action.js";

class LeaveAction extends Action {

    constructor(spec={}) {
        super(spec);
        this.target = spec.target;
    }

    start(actor) {
        console.log(`leave action actor: ${actor} target: ${this.target}}`);
        this.actor = actor;
        // check that target is occupied by actor
        if (this.target.actorId === actor.gid) {
            console.log(`actor: ${actor} cannot leave: ${this.target} -- not occupied`);
            this.ok = false;
        } else {
            // actor occupies target
            this.target.leave(actor);
        }
    }

    update(ctx) {
        this.done = true;
        return this.done;
    }

}