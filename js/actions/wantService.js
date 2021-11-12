export { WantServiceScheme };

import { AiGoal }           from "../base/ai/aiGoal.js";
import { AiPlan }           from "../base/ai/aiPlan.js";
import { AiScheme }         from "../base/ai/aiScheme.js";
import { Condition } from "../base/condition.js";

class WantServiceScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = (goal) => goal === AiGoal.socialize;
        this.preconditions.push((state) => !state.v_wantService);                               // prevents cycles in wanting chair, wanting something else, wanting chair...
        this.preconditions.push((state) => !state.a_conditions.has(Condition.seated));
        this.preconditions.push((state) => !state.a_occupyId);
        this.preconditions.push((state) => state.v_occupyTag === undefined);
        this.preconditions.push((state) => state.v_wantTag === undefined);
        this.preconditions.push((state) => !state.v_occupyTag);                             // has occupation already been planned?
        this.effects.push((state) => state.v_wantTag = "MealService");
        this.effects.push((state) => state.v_wantService = true);
        this.effects.push((state) => state.v_findPredicate = ((v) => v.cls === "MealService" && !v.conditions.has(v.occupiedCondition)) );
    }

    deriveState(env, actor, state) {
        if (!state.hasOwnProperty("a_conditions")) state.a_conditions = new Set(actor.conditions);
        if (!state.hasOwnProperty("a_occupyId")) state.a_occupyId = actor.occupyId;
    }

    generatePlan(spec={}) {
        return new WantServicePlan(spec);
    }

}

class WantServicePlan extends AiPlan {

    finalize() {
        return {
            utility: 1,
            cost: 1,
        }
    }
}