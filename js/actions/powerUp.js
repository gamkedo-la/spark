export { PowerUpAction };

import { Action }               from "../base/action.js";
import { Condition }            from "../base/condition.js";

class PowerUpAction extends Action {

    constructor(spec={}) {
        super(spec);
        this.target = spec.target;
        this.powerUpCondition = spec.powerUpCondition || Condition.powered;
    }

    start(actor) {
        console.log(`starting PanToAction`);
        if (this.target) {
            this.target.conditions.add(this.powerUpCondition);
        } else {
            console.error(`${this.constructor.name} failed: no target`);
            this.done = false;
        }
        this.done = true;
    }

    update(ctx) {
        return this.done;
    }
}