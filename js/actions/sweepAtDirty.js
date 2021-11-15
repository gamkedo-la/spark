export { SweepAtDirtyScheme };

import { AiScheme }         from "../base/ai/aiScheme.js";
import { AiGoal }           from "../base/ai/aiGoal.js";
import { AiPlan }           from "../base/ai/aiPlan.js";
import { AiProcess }        from "../base/ai/aiProcess.js";
import { Action }           from "../base/action.js";
import { Condition } from "../base/condition.js";

class SweepAtDirtyScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = (goal) => goal === AiGoal.work;
        this.preconditions.push((state) => state.v_moveTag === "Dirty");
        this.preconditions.push((state) => !state.v_occupyTag);                             // has occupation already been planned
        this.effects.push((state) => state[AiGoal.toString(AiGoal.work)] = true);
    }

    generatePlan(spec={}) {
        return new SweepAtDirtyPlan(spec);
    }

}

class SweepAtDirtyPlan extends AiPlan {

    finalize() {
        // handle success
        return {
            utility: 1,
            cost: 1,
            processes: [
                new SweepProcess({target: this.state.v_target}),
            ]
        }
    }

}

class SweepProcess extends AiProcess {
    constructor(spec={}) {
        super(spec);
        this.target = spec.target;
    }

    prepare(actor) {
        this.actions = [
            new SweepAction({target: this.target}),
        ];
        // set actor's action queue to be the individual actions
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

class SweepAction extends Action {
    static dfltTTL = 5000;

    constructor(spec={}) {
        super(spec);
        this.target = spec.target;
        this.ttl = spec.ttl || SweepAction.dfltTTL;
    }

    start(actor) {
        this.actor = actor;
        // actor applies sweeping condition
        this.actor.conditions.add(Condition.sweeping);
    }

    update(ctx) {
        this.ttl -= ctx.deltaTime;
        if (this.ttl <= 0) {
            this.done = true;
            this.actor.conditions.delete(Condition.sweeping);
            // mark area as clean
            this.target.dirty.needsReset = true;
        }
        return this.done;
    }

}
