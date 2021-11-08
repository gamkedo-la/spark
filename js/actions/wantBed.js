export { WantBedScheme };

import { AiGoal }           from "../base/ai/aiGoal.js";
import { AiPlan }           from "../base/ai/aiPlan.js";
import { AiScheme }         from "../base/ai/aiScheme.js";
import { Condition }        from "../base/condition.js";

class WantBedScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = (goal) => goal === AiGoal.sleep;
        this.preconditions.push((state) => !state.v_wantBed);                               // prevents cycles in wanting bed, wanting something else, wanting bed...
        this.preconditions.push((state) => !state.a_occupyId);                              // is actor currently occupying an area
        this.preconditions.push((state) => !state.v_occupyTag);                             // has occupation already been planned
        this.preconditions.push((state) => state.v_wantTag === undefined);
        this.preconditions.push((state) => !state.a_conditions.has(Condition.asleep));      //
        this.effects.push((state) => state.v_wantTag = "Bed");
        this.effects.push((state) => state.v_wantBed = true);
    }

    deriveState(env, actor, state) {
        if (!state.hasOwnProperty("a_occupyId")) state.a_occupyId = actor.occupyId;
        if (!state.hasOwnProperty("a_ownerTag")) state.a_ownerTag = actor.ownerTag;
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