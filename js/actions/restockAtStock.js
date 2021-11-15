export { RestockAtStockScheme };

import { AiScheme }         from "../base/ai/aiScheme.js";
import { AiGoal }           from "../base/ai/aiGoal.js";
import { AiPlan }           from "../base/ai/aiPlan.js";
import { AiProcess }        from "../base/ai/aiProcess.js";
import { Action }           from "../base/action.js";
import { Condition } from "../base/condition.js";
import { Generator } from "../base/generator.js";

class RestockAtStockScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = (goal) => goal === AiGoal.work;
        this.preconditions.push((state) => state.v_occupyTag === "Stock");
        this.effects.push((state) => state[AiGoal.toString(AiGoal.work)] = true);
    }

    generatePlan(spec={}) {
        return new RestockAtStockPlan(spec);
    }

}

class RestockAtStockPlan extends AiPlan {

    finalize() {
        // handle success
        return {
            utility: 1,
            cost: 1,
            processes: [
                new RestockProcess({target: this.state.v_target}),
            ]
        }
    }

}

class RestockProcess extends AiProcess {
    constructor(spec={}) {
        super(spec);
        this.target = spec.target;
    }

    prepare(actor) {
        this.actions = [
            new RestockAction({target: this.target}),
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

class RestockAction extends Action {
    static dfltTTL = 1000;

    constructor(spec={}) {
        super(spec);
        this.target = spec.target;
        this.ttl = spec.ttl || RestockAction.dfltTTL;
        this.xsfx = spec.xsfx || { cls: "Media", tag: "vendor.restock"};
    }

    start(actor) {
        this.actor = actor;
        // actor applies restock condition
        //this.actor.conditions.add(Condition.sweeping);
        if (this.xsfx) {
            let sound = Generator.generate(this.xsfx);
            sound.play();
        }
    }

    update(ctx) {
        this.ttl -= ctx.deltaTime;
        if (this.ttl <= 0) {
            this.done = true;
            //this.actor.conditions.delete(Condition.sweeping);
            // mark target as restocked
            this.target.restock.needsReset = true;
        }
        return this.done;
    }

}
