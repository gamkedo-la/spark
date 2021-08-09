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
        console.log(`sweep action actor: ${actor} target: ${this.target}}`);
        this.actor = actor;
        // actor applies sweeping condition
        this.actor.conditions.add(Condition.sweeping);
    }

    update(ctx) {
        this.ttl -= ctx.deltaTime;
        if (this.ttl <= 0) {
            console.log(`actor ${this.actor} done sweeping`);
            this.done = true;
            this.actor.conditions.delete(Condition.sweeping);
        }
        return this.done;
    }

}