export { WantFoodScheme };

import { AiGoal }           from "../base/ai/aiGoal.js";
import { AiPlan }           from "../base/ai/aiPlan.js";
import { AiScheme }         from "../base/ai/aiScheme.js";
import { Condition }        from "../base/condition.js";

class WantFoodScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = (goal) => goal === AiGoal.eat;
        this.preconditions.push((state) => state.a_conditions.has(Condition.hungry));
        this.preconditions.push((state) => !state.a_conditions.has(Condition.eating));
        this.preconditions.push((state) => !state.a_conditions.has(Condition.asleep));
        this.preconditions.push((state) => state.a_ownerTag !== undefined);               // only gather food from actor's stores (requires actor to have owner tag)
        this.preconditions.push((state) => state.a_carryTag !== "Food");
        this.preconditions.push((state) => state.v_wantTag === undefined);
        this.preconditions.push((state) => state.v_locationTag !== "Food");
        this.effects.push((state) => state.v_wantTag = "Food");
    }

    deriveState(env, actor, state) {
        // bug here: reserve tag gets set by the different schemes... 
        // even though they can all want something else
        if (!state.hasOwnProperty("a_reserveTag")) state.a_reserveTag = actor.reserveTag;
        if (!state.hasOwnProperty("a_conditions")) state.a_conditions = new Set(actor.conditions);
        if (!state.hasOwnProperty("a_carryTag")) state.a_carryTag = actor.carryTag;
    }

    generatePlan(spec={}) {
        return new WantFoodPlan(spec);
    }

}

class WantFoodPlan extends AiPlan {

    finalize() {
        return {
            utility: 1,
            cost: 1,
        }
    }
}