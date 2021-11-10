export { WantPlantScheme };

import { AiGoal }           from "../base/ai/aiGoal.js";
import { AiPlan }           from "../base/ai/aiPlan.js";
import { AiScheme }         from "../base/ai/aiScheme.js";
import { Condition }        from "../base/condition.js";


class WantPlantScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = (goal) => goal === AiGoal.work;
        this.preconditions.push((state) => !state.v_occupyTag);                 // occupy wasn't planned previous
        this.preconditions.push((state) => !state.a_occupyId);                  // not currently occupying
        this.preconditions.push((state) => !state.v_wantPlant);                 // prevents cycles
        this.preconditions.push((state) => !state.v_wantTag);                   // wanting wasn't planned previous
        this.preconditions.push((state) => state.a_carryTag === "Water");       // carrying resource
        this.effects.push((state) => state.v_wantTag = "Plant");
        this.effects.push((state) => state.v_wantPlant = true);
        this.effects.push((state) => state.v_findPredicate = ((v) => v.tag.startswith("plant") && v.conditions && v.conditions.has(Condition.thirsty)) );
    }

    deriveState(env, actor, state) {
        if (!state.hasOwnProperty("a_occupyId")) state.a_occupyId = actor.occupyId;
        if (!state.hasOwnProperty("a_carryTag")) state.a_carryTag = actor.carryTag;
    }

    generatePlan(spec={}) {
        return new WantPlantPlan(spec);
    }

}

class WantPlantPlan extends AiPlan {

    finalize() {
        return {
            utility: 1,
            cost: 1,
        }
    }
}