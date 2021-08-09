export { WorkAtStationScheme };

import { AiScheme }         from "../base/ai/aiScheme.js";
import { AiGoal }           from "../base/ai/aiGoal.js";
import { AiPlan }           from "../base/ai/aiPlan.js";

class WorkAtStationScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = (goal) => goal === AiGoal.wait;
        this.preconditions.push((state) => state.v_occupyTag === "Workstation");
        this.effects.push((state) => state[AiGoal.toString(AiGoal.wait)] = true);
    }

    generatePlan(spec={}) {
        return new WorkAtStationPlan(spec);
    }

}

class WorkAtStationPlan extends AiPlan {

    finalize() {
        // handle success
        return {
            utility: 1,
            cost: 1,
        }
    }

}