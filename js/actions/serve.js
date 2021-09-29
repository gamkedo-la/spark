export { ServeBeerScheme };

import { AiScheme }         from "../base/ai/aiScheme.js";
import { AiGoal }           from "../base/ai/aiGoal.js";
import { AiPlan }           from "../base/ai/aiPlan.js";
import { AiProcess }        from "../base/ai/aiProcess.js";
import { Action }           from "../base/action.js";
import { Condition }        from "../base/condition.js";

class ServeBeerScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = (goal) => goal === AiGoal.work;
        this.preconditions.push((state) => state.a_carryTag === "Beer");
        this.preconditions.push((state) => state.v_moveTag === "ServeBeer");
        this.effects.push((state) => state[AiGoal.toString(AiGoal.work)] = true);
    }

    generatePlan(spec={}) {
        return new ServeBeerPlan(spec);
    }

}

class ServeBeerPlan extends AiPlan {

    finalize() {
        // handle success
        return {
            utility: 1,
            cost: 1,
            processes: [
                new ServeBeerProcess({target: this.state.v_target}),
            ]
        }
    }

}

class ServeBeerProcess extends AiProcess {
    constructor(spec={}) {
        super(spec);
        this.target = spec.target;
    }

    prepare(actor) {
        this.actions = [
            new ServeBeerAction({target: this.target}),
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

class ServeBeerAction extends Action {

    constructor(spec={}) {
        super(spec);
        this.target = spec.target;
        this.ttl = spec.ttl || 1000;
    }

    start(actor) {
        console.log(`serve beer action actor: ${actor} target: ${this.target}}`);
        this.actor = actor;
        // actor drops what they were carrying
        this.actor.carryTag = undefined;
    }

    update(ctx) {
        this.ttl -= ctx.deltaTime;
        if (this.ttl <= 0) {
            console.log(`actor ${this.actor} done serving beer`);
            this.done = true;
            //this.actor.conditions.delete(Condition.eating);
            // actor clears service order
            this.actor.serviceOrderId = 0;
            this.actor.serviceTag = null;
            // beer is placed
            // FIXME: is beer spawned?
            this.target.beerId = 101;
        }
        return this.done;
    }

}