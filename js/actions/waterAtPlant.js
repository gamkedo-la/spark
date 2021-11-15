export { WaterAtPlantScheme };

import { AiScheme }         from "../base/ai/aiScheme.js";
import { AiGoal }           from "../base/ai/aiGoal.js";
import { AiPlan }           from "../base/ai/aiPlan.js";
import { AiProcess }        from "../base/ai/aiProcess.js";
import { Action }           from "../base/action.js";
import { Condition }        from "../base/condition.js";

class WaterAtPlantScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = (goal) => goal === AiGoal.work;
        this.preconditions.push((state) => state.a_carryTag === "Water");
        this.preconditions.push((state) => state.v_moveTag === "Plant");
        this.preconditions.push((state) => !state.v_occupyTag);                             // has occupation already been planned
        this.effects.push((state) => state[AiGoal.toString(AiGoal.work)] = true);
    }

    generatePlan(spec={}) {
        return new WaterAtPlantPlan(spec);
    }

}

class WaterAtPlantPlan extends AiPlan {

    finalize() {
        // handle success
        return {
            utility: 1,
            cost: 1,
            processes: [
                new WaterProcess({target: this.state.v_target}),
            ]
        }
    }

}

class WaterProcess extends AiProcess {
    constructor(spec={}) {
        super(spec);
        this.target = spec.target;
    }

    prepare(actor) {
        this.actions = [
            new WaterAction({target: this.target}),
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

class WaterAction extends Action {

    constructor(spec={}) {
        super(spec);
        this.target = spec.target;
        this.ttl = spec.ttl || 4000;
    }

    start(actor) {
        this.actor = actor;
        // actor drops water
        this.actor.carryTag = undefined;
        // actor applies eating condition
        this.actor.conditions.add(Condition.watering);
    }

    update(ctx) {
        this.ttl -= ctx.deltaTime;
        if (this.ttl <= 0) {
            this.done = true;
            this.actor.conditions.delete(Condition.watering);
            // mark target as no longer thirsty
            this.target.thirsty.needsReset = true;
        }
        return this.done;
    }

}
