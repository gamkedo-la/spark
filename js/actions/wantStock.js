export { WantStockScheme };

import { AiGoal }           from "../base/ai/aiGoal.js";
import { AiPlan }           from "../base/ai/aiPlan.js";
import { AiScheme }         from "../base/ai/aiScheme.js";
import { Condition }        from "../base/condition.js";

class WantStockScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = (goal) => goal === AiGoal.work;
        this.preconditions.push((state) => !state.v_wantStock);                           // prevents cycles in wanting stove, wanting something else, wanting stove...
        this.preconditions.push((state) => !state.a_occupyId);
        this.preconditions.push((state) => state.v_wantTag === undefined);
        this.preconditions.push((state) => !state.v_occupyTag);                             // has occupation already been planned
        this.effects.push((state) => state.v_wantTag = "Stock");
        this.effects.push((state) => state.v_findPredicate = ((v) => v.conditions && v.conditions.has(Condition.restock)) );
        this.effects.push((state) => state.v_wantStock = true);
    }

    deriveState(env, actor, state) {
        if (!state.hasOwnProperty("a_occupyId")) state.a_occupyId = actor.occupyId;
    }

    generatePlan(spec={}) {
        return new WantStockPlan(spec);
    }

}

class WantStockPlan extends AiPlan {

    finalize() {
        return {
            utility: 1,
            cost: 1,
        }
    }
}