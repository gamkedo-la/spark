export { WantStoveScheme };

import { AiGoal }           from "../base/ai/aiGoal.js";
import { AiPlan }           from "../base/ai/aiPlan.js";
import { AiScheme }         from "../base/ai/aiScheme.js";
import { Condition }        from "../base/condition.js";
import { Fmt } from "../base/fmt.js";

class WantStoveScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = (goal) => goal === AiGoal.eat;
        this.preconditions.push((state) => !state.v_wantStove);                           // prevents cycles in wanting stove, wanting something else, wanting stove...
        this.preconditions.push((state) => !state.a_occupyId);
        this.preconditions.push((state) => state.v_occupyTag === undefined);
        this.preconditions.push((state) => state.a_conditions.has(Condition.hungry));
        this.preconditions.push((state) => state.a_carryTag !== "Food");
        this.preconditions.push((state) => state.v_wantTag === undefined);
        this.preconditions.push((state) => !state.v_occupyTag);                             // has occupation already been planned?
        this.effects.push((state) => state.v_wantTag = "Stove");
        this.effects.push((state) => state.v_gatherTag = "Food");
        this.effects.push((state) => state.v_wantStove = true);
    }

    deriveState(env, actor, state) {
        if (!state.hasOwnProperty("a_occupyId")) state.a_occupyId = actor.occupyId;
        if (!state.hasOwnProperty("a_conditions")) state.a_conditions = new Set(actor.conditions);
        if (!state.hasOwnProperty("a_carryTag")) state.a_carryTag = actor.carryTag;
    }

    generatePlan(spec={}) {
        return new WantStovePlan(spec);
    }

}

class WantStovePlan extends AiPlan {

    finalize() {
        return {
            utility: 1,
            cost: 1,
        }
    }
}