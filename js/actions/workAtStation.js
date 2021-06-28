export { WorkAtStationScheme };

import { AiScheme }         from "../base/ai/aiScheme.js";
import { AiGoal }           from "../base/ai/aiGoal.js";
import { AiPlan }           from "../base/ai/aiPlan.js";

class WorkAtStationScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = (goal) => goal === AiGoal.manage;
        this.preconditions.push((state) => state.v_occupyTag === "Workstation");
        this.effects.push((state) => state[AiGoal.toString(AiGoal.manage)] = true);
    }

    generatePlan(spec={}) {
        return new WorkAtStationPlan(spec);
    }

}

class WorkAtStationPlan extends AiPlan {

    finalize() {
        // handle success
        return {
            effects: this.state,
            utility: 1,
            cost: 1,
        }
    }

}