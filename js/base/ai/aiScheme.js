export { AiScheme };

import { Fmt } from "../fmt.js";

// =========================================================================

class AiScheme {
    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        this.preconditions = spec.preconditions || [];
        this.effects = spec.effects || [];
        this.goalPredicate = spec.goalPredicate || ((v) => true);
    }

    // METHODS -------------------------------------------------------------
    deriveState(env, e, set) {
    }

    match(goal) {
        return this.goalPredicate(goal);
    }

    check(actor, state) {
        // check preconditions
        for (const cond of this.preconditions) {
            if (!cond(state)) {
                //console.log(`${this} failed condition: ${cond}`);
                return undefined;
            }
        }
        // return plan info with applied state effects
        let planInfo = {
            effects: this.effects,
        }
        return planInfo;
    }

    generatePlan() {
        return undefined;
    }

    toString() {
        return Fmt.toString(this.constructor.name);
    }

}