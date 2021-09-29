export { WantKegScheme };

import { AiGoal }           from "../base/ai/aiGoal.js";
import { AiPlan }           from "../base/ai/aiPlan.js";
import { AiScheme }         from "../base/ai/aiScheme.js";
import { Condition }        from "../base/condition.js";
import { Fmt } from "../base/fmt.js";

class WantKegScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = (goal) => goal === AiGoal.work;
        this.preconditions.push((state) => !state.v_wantKeg);                           // prevents cycles in wanting keg, wanting something else, wanting keg...
        this.preconditions.push((state) => !state.a_occupyId);
        this.preconditions.push((state) => state.v_occupyTag === undefined);
        this.preconditions.push((state) => state.a_serviceTag === "Beer");
        this.preconditions.push((state) => state.a_carryTag !== "Beer");
        this.preconditions.push((state) => state.v_wantTag === undefined);
        this.preconditions.push((state) => !state.v_occupyTag);                             // has occupation already been planned?
        this.effects.push((state) => state.v_wantTag = "Keg");
        this.effects.push((state) => state.v_gatherTag = "Beer");
        this.effects.push((state) => state.v_wantKeg = true);
    }

    deriveState(env, actor, state) {
        if (!state.hasOwnProperty("a_occupyId")) state.a_occupyId = actor.occupyId;
        if (!state.hasOwnProperty("a_serviceTag")) state.a_serviceTag = actor.serviceTag;
        if (!state.hasOwnProperty("a_carryTag")) state.a_carryTag = actor.carryTag;
    }

    generatePlan(spec={}) {
        return new WantKegPlan(spec);
    }

}

class WantKegPlan extends AiPlan {

    finalize() {
        return {
            utility: 1,
            cost: 1,
        }
    }
}