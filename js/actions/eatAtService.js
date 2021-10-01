export { WaitAtServiceScheme, EatAtServiceScheme };

import { AiScheme }         from "../base/ai/aiScheme.js";
import { AiGoal }           from "../base/ai/aiGoal.js";
import { AiPlan }           from "../base/ai/aiPlan.js";
import { AiProcess }        from "../base/ai/aiProcess.js";
import { Action }           from "../base/action.js";
import { Condition } from "../base/condition.js";

class WaitAtServiceScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = (goal) => goal === AiGoal.socialize;
        this.preconditions.push((state) => state.v_occupyTag === "MealService");
        this.effects.push((state) => state[AiGoal.toString(AiGoal.socialize)] = true);
    }

    generatePlan(spec={}) {
        return new WaitAtServicePlan(spec);
    }
}

class WaitAtServicePlan extends AiPlan {

    finalize() {
        // handle success
        return {
            utility: 1,
            cost: 1,
        }
    }

}

class EatAtServiceScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = (goal) => goal === AiGoal.socialize;
        this.preconditions.push((state) => state.v_occupyTag === "Service");
        this.effects.push((state) => state[AiGoal.toString(AiGoal.socialize)] = true);
    }

    generatePlan(spec={}) {
        return new EatAtServicePlan(spec);
    }

}

class EatAtServicePlan extends AiPlan {

    finalize() {
        // handle success
        return {
            utility: 1,
            cost: 1,
            processes: [
                new EatProcess({target: this.state.v_target}),
            ]
        }
    }

}

class EatProcess extends AiProcess {
    constructor(spec={}) {
        super(spec);
        this.target = spec.target;
    }

    prepare(actor) {
        this.actions = [
            new EatAction({target: this.target}),
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

class EatAction extends Action {

    constructor(spec={}) {
        super(spec);
        this.target = spec.target;
        this.ttl = spec.ttl || 10000;
    }

    start(actor) {
        //console.log(`eat action actor: ${actor} target: ${this.target}}`);
        this.actor = actor;
        // actor drops food
        this.actor.carryTag = undefined;
        // actor applies eating condition
        this.actor.conditions.add(Condition.eating);
    }

    update(ctx) {
        this.ttl -= ctx.deltaTime;
        if (this.ttl <= 0) {
            //console.log(`actor ${this.actor} done eating`);
            this.done = true;
            this.actor.conditions.delete(Condition.eating);
        }
        return this.done;
    }

}