export { WantBeerOrderScheme, WantBeerClearScheme, WantServeBeerScheme, WantFoodOrderScheme, WantFoodClearScheme, WantServeFoodScheme };

import { AiGoal }           from "../base/ai/aiGoal.js";
import { AiPlan }           from "../base/ai/aiPlan.js";
import { AiScheme }         from "../base/ai/aiScheme.js";
import { Condition }        from "../base/condition.js";

class WantBeerOrderScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = (goal) => goal === AiGoal.work;
        this.preconditions.push((state) => !state.a_occupyId);                  // not currently occupying
        this.preconditions.push((state) => !state.v_wantOrder);                 // prevents cycles
        this.preconditions.push((state) => !state.v_wantTag);                   // wanting wasn't planned previous
        this.preconditions.push((state) => !state.v_occupyTag);                 // occupy wasn't planned previous
        this.effects.push((state) => state.v_wantTag = "BeerOrder");
        this.effects.push((state) => state.v_wantOrder = true);
        // find meal service where: a) service is occupied and b) beer id is 0
        this.effects.push((state) => state.v_findPredicate = ((v) => v.mealService && v.conditions.has(v.occupiedCondition) && v.beerId === 0));
    }
    deriveState(env, actor, state) {
        if (!state.hasOwnProperty("a_occupyId")) state.a_occupyId = actor.occupyId;
    }
    generatePlan(spec={}) {
        return new WantBeerOrderPlan(spec);
    }
}

class WantFoodOrderScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = (goal) => goal === AiGoal.work;
        this.preconditions.push((state) => !state.a_occupyId);                  // not currently occupying
        this.preconditions.push((state) => !state.v_wantOrder);                 // prevents cycles
        this.preconditions.push((state) => !state.v_wantTag);                   // wanting wasn't planned previous
        this.preconditions.push((state) => !state.v_occupyTag);                 // occupy wasn't planned previous
        this.effects.push((state) => state.v_wantTag = "FoodOrder");
        this.effects.push((state) => state.v_wantOrder = true);
        // find meal service where: a) service is occupied and b) food id is 0
        this.effects.push((state) => state.v_findPredicate = ((v) => v.mealService && v.conditions.has(v.occupiedCondition) && v.foodId === 0));
    }
    deriveState(env, actor, state) {
        if (!state.hasOwnProperty("a_occupyId")) state.a_occupyId = actor.occupyId;
    }
    generatePlan(spec={}) {
        return new WantFoodOrderPlan(spec);
    }
}

class WantBeerOrderPlan extends AiPlan {
    finalize() {
        return {
            utility: 1,
            cost: 1,
        }
    }
}

class WantFoodOrderPlan extends AiPlan {
    finalize() {
        return {
            utility: 1,
            cost: 1,
        }
    }
}

class WantBeerClearScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = (goal) => goal === AiGoal.work;
        this.preconditions.push((state) => !state.v_wantClear);                 // prevents cycles
        this.preconditions.push((state) => !state.v_occupyTag);                 // occupy wasn't planned previous
        this.preconditions.push((state) => !state.a_occupyId);                  // not currently occupying
        this.preconditions.push((state) => !state.v_wantTag);                   // wanting wasn't planned previous
        this.effects.push((state) => state.v_wantTag = "BeerClear");
        this.effects.push((state) => state.v_wantClear = true);
        // find meal service where: a) service is not occupied and b) beer is present
        this.effects.push((state) => state.v_findPredicate = ((v) => v.mealService && !v.conditions.has(v.occupiedCondition) && v.beerId));
    }
    deriveState(env, actor, state) {
        if (!state.hasOwnProperty("a_occupyId")) state.a_occupyId = actor.occupyId;
    }
    generatePlan(spec={}) {
        return new WantBeerClearPlan(spec);
    }
}

class WantFoodClearScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = (goal) => goal === AiGoal.work;
        this.preconditions.push((state) => !state.v_wantClear);                 // prevents cycles
        this.preconditions.push((state) => !state.v_occupyTag);                 // occupy wasn't planned previous
        this.preconditions.push((state) => !state.a_occupyId);                  // not currently occupying
        this.preconditions.push((state) => !state.v_wantTag);                   // wanting wasn't planned previous
        this.effects.push((state) => state.v_wantTag = "FoodClear");
        this.effects.push((state) => state.v_wantClear = true);
        // find meal service where: a) service is not occupied and b) food is present
        this.effects.push((state) => state.v_findPredicate = ((v) => v.mealService && !v.conditions.has(v.occupiedCondition) && v.foodId));
    }
    deriveState(env, actor, state) {
        if (!state.hasOwnProperty("a_occupyId")) state.a_occupyId = actor.occupyId;
    }
    generatePlan(spec={}) {
        return new WantFoodClearPlan(spec);
    }
}

class WantBeerClearPlan extends AiPlan {
    finalize() {
        return {
            utility: 1,
            cost: 1,
        }
    }
}

class WantFoodClearPlan extends AiPlan {
    finalize() {
        return {
            utility: 1,
            cost: 1,
        }
    }
}

class WantServeBeerScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = (goal) => goal === AiGoal.work;
        this.preconditions.push((state) => state.a_carryTag === "Beer");        // carrying beer?
        this.preconditions.push((state) => !state.v_wantServe);                 // prevents cycles
        this.preconditions.push((state) => !state.v_occupyTag);                 // occupy wasn't planned previous
        this.preconditions.push((state) => !state.a_occupyId);                  // not currently occupying
        this.effects.push((state) => state.v_wantTag = "ServeBeer");
        this.effects.push((state) => state.v_findTag = "ServeBeer");
        this.effects.push((state) => state.v_wantServe= true);
    }
    deriveState(env, actor, state) {
        if (!state.hasOwnProperty("a_occupyId")) state.a_occupyId = actor.occupyId;
    }
    generatePlan(spec={}) {
        return new WantServeBeerPlan(spec);
    }
}

class WantServeFoodScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = (goal) => goal === AiGoal.work;
        this.preconditions.push((state) => state.a_carryTag === "Food");        // carrying food?
        this.preconditions.push((state) => !state.v_wantServe);                 // prevents cycles
        this.preconditions.push((state) => !state.v_occupyTag);                 // occupy wasn't planned previous
        this.preconditions.push((state) => !state.a_occupyId);                  // not currently occupying
        this.effects.push((state) => state.v_wantTag = "ServeFood");
        this.effects.push((state) => state.v_findTag = "ServeFood");
        this.effects.push((state) => state.v_wantServe = true);
    }
    deriveState(env, actor, state) {
        if (!state.hasOwnProperty("a_occupyId")) state.a_occupyId = actor.occupyId;
    }
    generatePlan(spec={}) {
        return new WantServeFoodPlan(spec);
    }
}

class WantServeBeerPlan extends AiPlan {
    finalize() {
        return {
            effects: [ (state) => state.v_target = state.v_patron ],
            utility: 1,
            cost: 1,
        }
    }
}

class WantServeFoodPlan extends AiPlan {
    finalize() {
        return {
            effects: [ (state) => state.v_target = state.v_patron ],
            utility: 1,
            cost: 1,
        }
    }
}