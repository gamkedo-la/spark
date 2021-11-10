export { WantWaterScheme };

import { AiGoal }           from "../base/ai/aiGoal.js";
import { AiPlan }           from "../base/ai/aiPlan.js";
import { AiScheme }         from "../base/ai/aiScheme.js";

class WantWaterScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = (goal) => goal === AiGoal.work;
        this.preconditions.push((state) => !state.v_occupyTag);                 // occupy wasn't planned previous
        this.preconditions.push((state) => !state.a_occupyId);                  // not currently occupying
        this.preconditions.push((state) => !state.v_wantWater);                 // prevents cycles
        this.preconditions.push((state) => !state.v_wantTag);                   // wanting wasn't planned previous
        this.preconditions.push((state) => state.a_carryTag !== "Water");       // not already carrying something else
        this.effects.push((state) => state.v_wantTag = "Water");
        this.effects.push((state) => state.v_gatherTag = "Water");
        this.effects.push((state) => state.v_wantWater = true);
        this.effects.push((state) => state.v_findPredicate = ((v) => v.dispenseTag === "Water"));
    }

    deriveState(env, actor, state) {
        if (!state.hasOwnProperty("a_occupyId")) state.a_occupyId = actor.occupyId;
        if (!state.hasOwnProperty("a_carryTag")) state.a_carryTag = actor.carryTag;
    }

    generatePlan(spec={}) {
        return new WantWaterPlan(spec);
    }

}

class WantWaterPlan extends AiPlan {

    finalize() {
        return {
            utility: 1,
            cost: 1,
        }
    }
}