export { WantWorkstationScheme };

import { AiGoal }           from "../base/ai/aiGoal.js";
import { AiPlan }           from "../base/ai/aiPlan.js";
import { AiScheme }         from "../base/ai/aiScheme.js";
import { Condition }        from "../base/condition.js";

class WantWorkstationScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = (goal) => goal === AiGoal.manage;
        this.preconditions.push((state) => !state.v_wantWorkstation);                           // prevents cycles in wanting workstation, wanting something else, wanting workstation...
        this.preconditions.push((state) => !state.a_conditions.has(Condition.working));
        this.preconditions.push((state) => !state.a_conditions.has(Condition.asleep));
        this.preconditions.push((state) => state.v_wantTag === undefined);
        this.effects.push((state) => state.v_wantTag = "Workstation");
        this.effects.push((state) => state.v_wantWorkstation = true);
    }

    deriveState(env, actor, state) {
        if (!state.hasOwnProperty("a_ownerTag")) state.a_ownerTag = actor.ownerTag;
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