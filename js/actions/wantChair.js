export { WantChairScheme };

import { AiGoal }           from "../base/ai/aiGoal.js";
import { AiPlan }           from "../base/ai/aiPlan.js";
import { AiScheme }         from "../base/ai/aiScheme.js";
import { Condition }        from "../base/condition.js";

class WantChairScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = (goal) => goal === AiGoal.eat;
        this.preconditions.push((state) => !state.v_wantChair);                               // prevents cycles in wanting chair, wanting something else, wanting chair...
        this.preconditions.push((state) => !state.a_occupyId);
        this.preconditions.push((state) => state.v_occupyTag === undefined);
        //this.preconditions.push((state) => !state.a_conditions.has(Condition.eating));
        //this.preconditions.push((state) => !state.a_conditions.has(Condition.asleep));
        this.preconditions.push((state) => state.v_wantTag === undefined);
        this.effects.push((state) => state.v_wantTag = "Chair");
        this.effects.push((state) => state.v_wantChair = true);
    }

    deriveState(env, actor, state) {
        if (!state.hasOwnProperty("a_conditions")) state.a_conditions = new Set(actor.conditions);
        if (!state.hasOwnProperty("a_occupyId")) state.a_occupyId = actor.occupyId;
    }

    generatePlan(spec={}) {
        return new WantChairPlan(spec);
    }

}

class WantChairPlan extends AiPlan {

    finalize() {
        return {
            utility: 1,
            cost: 1,
        }
    }
}