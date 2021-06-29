export { WantBedScheme };

import { AiGoal }           from "../base/ai/aiGoal.js";
import { AiPlan }           from "../base/ai/aiPlan.js";
import { AiScheme }         from "../base/ai/aiScheme.js";
import { Condition }        from "../base/condition.js";

class WantBedScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = (goal) => goal === AiGoal.sleep;
        this.preconditions.push((state) => !state.a_conditions.has(Condition.asleep));
        this.preconditions.push((state) => state.a_reserveTag !== undefined);
        this.preconditions.push((state) => state.v_wantTag === undefined);
        this.preconditions.push((state) => state.v_locationTag !== "Bed");
        this.effects.push((state) => state.v_wantTag = "Bed");
    }

    deriveState(env, actor, state) {
        if (!state.hasOwnProperty("a_reserveTag")) state.a_reserveTag = actor.bedTag;
        if (!state.hasOwnProperty("a_conditions")) state.a_conditions = new Set(actor.conditions);
    }

    generatePlan(spec={}) {
        return new WantBedPlan(spec);
    }

}

class WantBedPlan extends AiPlan {

    finalize() {
        return {
            utility: 1,
            cost: 1,
        }
    }
}