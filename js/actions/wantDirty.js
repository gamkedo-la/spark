export { WantDirtyScheme };

import { AiGoal }           from "../base/ai/aiGoal.js";
import { AiPlan }           from "../base/ai/aiPlan.js";
import { AiScheme }         from "../base/ai/aiScheme.js";
import { Condition }        from "../base/condition.js";

class WantDirtyScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = (goal) => goal === AiGoal.work;
        this.preconditions.push((state) => !state.v_wantDirty);                               // prevents cycles in wanting chair, wanting something else, wanting chair...
        this.preconditions.push((state) => !state.a_occupyId);
        this.preconditions.push((state) => state.v_wantTag === undefined);
        this.effects.push((state) => state.v_wantTag = "Dirty");
        this.effects.push((state) => state.v_wantDirty = true);
        this.effects.push((state) => state.v_findPredicate = ((v) => v.conditions && v.conditions.has(Condition.dirty)) );
    }

    deriveState(env, actor, state) {
        if (!state.hasOwnProperty("a_occupyId")) state.a_occupyId = actor.occupyId;
    }

    generatePlan(spec={}) {
        return new WantDirtyPlan(spec);
    }

}

class WantDirtyPlan extends AiPlan {

    finalize() {
        return {
            utility: 1,
            cost: 1,
        }
    }
}