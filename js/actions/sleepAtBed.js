export { SleepAtBedScheme };

import { AiScheme }         from "../base/ai/aiScheme.js";
import { AiGoal }           from "../base/ai/aiGoal.js";
import { AiPlan }           from "../base/ai/aiPlan.js";
import { ResetMoraleAction } from "./reset.js";
import { AiProcess }        from "../base/ai/aiProcess.js";

class SleepAtBedScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = (goal) => goal === AiGoal.sleep;
        this.preconditions.push((state) => state.v_occupyTag === "Bed");
        this.effects.push((state) => state[AiGoal.toString(AiGoal.sleep)] = true);
    }

    generatePlan(spec={}) {
        return new SleepAtBedPlan(spec);
    }

}

class SleepAtBedPlan extends AiPlan {

    finalize() {
        // handle success
        return {
            utility: 1,
            cost: 1,
            processes: [
                new SleepProcess(),
            ]
        }
    }

}

class SleepProcess extends AiProcess {
    prepare(actor) {
        this.actions = [
            new ResetMoraleAction({target: this.target}),
        ];
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