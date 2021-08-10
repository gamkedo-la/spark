export { WantWorkstationScheme };

import { AiGoal }           from "../base/ai/aiGoal.js";
import { AiPlan }           from "../base/ai/aiPlan.js";
import { AiScheme }         from "../base/ai/aiScheme.js";
import { Condition }        from "../base/condition.js";

class WantWorkstationScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = (goal) => (goal === AiGoal.wait) || (goal == AiGoal.work || (goal == AiGoal.close));
        this.preconditions.push((state) => !state.v_wantWorkstation);                           // prevents cycles in wanting workstation, wanting something else, wanting workstation...
        this.preconditions.push((state) => !state.a_occupyId);                              // is actor already occupying space?
        this.preconditions.push((state) => state.v_wantTag === undefined);
        this.preconditions.push((state) => !state.v_occupyTag);                             // has occupation already been planned?
        this.effects.push((state) => state.v_wantTag = "Workstation");
        this.effects.push((state) => state.v_wantWorkstation = true);
    }

    deriveState(env, actor, state) {
        if (!state.hasOwnProperty("a_occupyId")) state.a_occupyId = actor.occupyId;
        if (!state.hasOwnProperty("a_conditions")) state.a_conditions = new Set(actor.conditions);
    }

    generatePlan(spec={}) {
        return new WantWorkstationPlan(spec);
    }

}

class WantWorkstationPlan extends AiPlan {

    finalize() {
        return {
            utility: 1,
            cost: 1,
        }
    }
}