export { WantPrepFoodServiceScheme, WantPrepBeerServiceScheme };

import { AiGoal }           from "../base/ai/aiGoal.js";
import { AiPlan }           from "../base/ai/aiPlan.js";
import { AiScheme }         from "../base/ai/aiScheme.js";
import { Fmt }              from "../base/fmt.js";

class WantPrepFoodServiceScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = (goal) => goal === AiGoal.work;
        this.preconditions.push((state) => !state.v_wantPrepFoodService);                           // prevents cycles in wanting keg, wanting something else, wanting keg...
        this.preconditions.push((state) => !state.a_occupyId);
        this.preconditions.push((state) => state.v_occupyTag === undefined);
        this.preconditions.push((state) => state.a_serviceTag === "Food");
        this.preconditions.push((state) => state.a_carryTag !== "Food");
        this.preconditions.push((state) => state.v_wantTag === undefined);
        this.preconditions.push((state) => !state.v_occupyTag);                             // has occupation already been planned?
        this.effects.push((state) => state.v_wantTag = "Stove");
        this.effects.push((state) => state.v_gatherTag = "Food");
        this.effects.push((state) => state.v_wantPrepFoodService = true);
    }

    deriveState(env, actor, state) {
        if (!state.hasOwnProperty("a_occupyId")) state.a_occupyId = actor.occupyId;
        if (!state.hasOwnProperty("a_serviceTag")) state.a_serviceTag = actor.serviceTag;
        if (!state.hasOwnProperty("a_carryTag")) state.a_carryTag = actor.carryTag;
    }

    generatePlan(spec={}) {
        return new WantPrepFoodServicePlan(spec);
    }

}

class WantPrepFoodServicePlan extends AiPlan {

    finalize() {
        return {
            utility: 1,
            cost: 1,
        }
    }
}

class WantPrepBeerServiceScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = (goal) => goal === AiGoal.work;
        this.preconditions.push((state) => !state.v_wantPrepBeerService);                           // prevents cycles in wanting keg, wanting something else, wanting keg...
        this.preconditions.push((state) => !state.a_occupyId);
        this.preconditions.push((state) => state.v_occupyTag === undefined);
        this.preconditions.push((state) => state.a_serviceTag === "Beer");
        this.preconditions.push((state) => state.a_carryTag !== "Beer");
        this.preconditions.push((state) => state.v_wantTag === undefined);
        this.preconditions.push((state) => !state.v_occupyTag);                             // has occupation already been planned?
        this.effects.push((state) => state.v_wantTag = "Keg");
        this.effects.push((state) => state.v_gatherTag = "Beer");
        this.effects.push((state) => state.v_wantPrepBeerService = true);
    }

    deriveState(env, actor, state) {
        if (!state.hasOwnProperty("a_occupyId")) state.a_occupyId = actor.occupyId;
        if (!state.hasOwnProperty("a_serviceTag")) state.a_serviceTag = actor.serviceTag;
        if (!state.hasOwnProperty("a_carryTag")) state.a_carryTag = actor.carryTag;
    }

    generatePlan(spec={}) {
        return new WantPrepBeerServicePlan(spec);
    }

}

class WantPrepBeerServicePlan extends AiPlan {

    finalize() {
        return {
            utility: 1,
            cost: 1,
        }
    }
}