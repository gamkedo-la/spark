export { OccupyScheme };

import { AiScheme }         from "../base/ai/aiScheme.js";
import { AiPlan }           from "../base/ai/aiPlan.js";
import { AiProcess }        from "../base/ai/aiProcess.js";
import { Action }           from "../base/action.js";

class OccupyScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = spec.goalPredicate || ((v) => true);
        this.preconditions.push((state) => state.v_wantTag !== undefined);
        this.preconditions.push((state) => state.v_occupyTag === undefined);
        this.preconditions.push((state) => state.v_locationTag === state.v_wantTag);
        this.effects.push((state) => state.v_occupyTag = state.v_wantTag);
    }

    deriveState(env, actor, state) {
        if (!state.hasOwnProperty("a_occupyId")) state.a_occupyId = actor.occupyId;
    }

    generatePlan(spec={}) {
        return new OccupyPlan(spec);
    }

}

class OccupyPlan extends AiPlan {

    prepare(actor, state) {
        super.prepare(actor, state);
        let target = this.state.v_target;
        if (target.conditions.has(target.occupiedCondition)) {
            console.log("OccupyPlan: target is occupied");
            return false;
        }
        return true;
    }

    finalize() {
        // handle success
        return {
            effects: this.state,
            utility: 1,
            cost: 1,
            processes: [
                new OccupyProcess({target: this.state.v_target}),
            ]
        }
    }

}

class OccupyProcess extends AiProcess {
    constructor(spec={}) {
        super(spec);
        this.target = spec.target;
    }

    prepare(actor) {
        this.actions = [
            new OccupyAction({target: this.target}),
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