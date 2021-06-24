export { OccupyAction };

import { Action }           from "../base/action.js";

class OccupyAction extends Action {

    constructor(spec={}) {
        super(spec);
        this.target = spec.target;
    }

    start(actor) {
        console.log(`occupy action actor: ${actor} target: ${this.target}}`);
        this.actor = actor;
        // check that target can be occupied
        if (!this.target.occupy || this.target.conditions.has(this.target.occupiedCondition)) {
            console.log(`actor: ${actor} cannot occupy: ${this.target} -- already occupied`);
            this.ok = false;
        } else {
            // actor occupies target
            this.target.occupy(actor);
        }
    }

    update(ctx) {
        this.done = true;
        return this.done;
    }

}