export { DropScheme };

import { AiScheme }         from "../base/ai/aiScheme.js";
import { AiPlan }           from "../base/ai/aiPlan.js";
import { AiProcess }        from "../base/ai/aiProcess.js";
import { Action }           from "../base/action.js";

class DropScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = spec.goalPredicate || ((v) => true);
        this.preconditions.push((state) => state.a_carryTag !== undefined);
        this.effects.push((state) => state.a_carryTag = undefined);
    }

    deriveState(env, actor, state) {
        if (!state.hasOwnProperty("a_carryTag")) state.a_carryTag = actor.carryTag;
    }

    generatePlan(spec={}) {
        return new DropPlan(spec);
    }

}


class DropPlan extends AiPlan {

    finalize() {
        // handle success
        return {
            utility: 1,
            cost: 1,
            processes: [
                new DropProcess(),
            ]
        }
    }

}

class DropProcess extends AiProcess {

    prepare(actor) {
        this.actions = [
            new DropAction(),
        ];
        // set actor's action queue to be the individual actions from movement...
        actor.actions = this.actions.slice(0);
        return true;
    }

    update(ctx) {
        if (this.actions.length === 0) return true;
        // wait for actions to be completed
        let lastAction = this.actions[this.actions.length-1];
        return lastAction.done;
    }

}



class DropAction extends Action {

    start(actor) {
        // drop
        actor.carryTag = undefined;
        console.log(`drop action actor: ${actor} drop: ${actor.carryTag}}`);
    }

    update(ctx) {
        this.done = true;
        return this.done;
    }

}