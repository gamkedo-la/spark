export { SleepAtBedScheme };

import { AiScheme }         from "../base/ai/aiScheme.js";
import { AiGoal }           from "../base/ai/aiGoal.js";
import { AiPlan }           from "../base/ai/aiPlan.js";

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
        }
    }

}