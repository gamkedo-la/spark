export { TakeBeerOrderScheme, TakeFoodOrderScheme };

import { AiScheme }         from "../base/ai/aiScheme.js";
import { AiGoal }           from "../base/ai/aiGoal.js";
import { AiPlan }           from "../base/ai/aiPlan.js";
import { AiProcess }        from "../base/ai/aiProcess.js";
import { Action }           from "../base/action.js";
import { Direction }        from "../base/dir.js";
import { Condition }        from "../base/condition.js";

class TakeBeerOrderScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = (goal) => goal === AiGoal.work;
        this.preconditions.push((state) => !state.v_hasOrder);                      // prevent cycles
        this.preconditions.push((state) => state.v_moveTag === "BeerOrder");        // at beer
        this.preconditions.push((state) => !state.v_occupyTag);                     // has occupation already been planned
        this.effects.push((state) => state.v_wantTag = "Beer");
        this.effects.push((state) => state.v_gatherTag = "Beer");
        this.effects.push((state) => state.v_hasOrder = true);
        this.effects.push((state) => state.v_findPredicate = ((v) => v.dispenseTag === "Beer" && v.conditions.has(Condition.sparked)));
    }
    generatePlan(spec={}) {
        return new TakeBeerOrderPlan(spec);
    }
}

class TakeBeerOrderPlan extends AiPlan {
    finalize() {
        // handle success
        let effects = [ (state) => state.v_patron = state.v_target ];
        return {
            effects: effects,
            utility: 1,
            cost: 1,
            processes: [
                new TakeOrderProcess({
                    target: this.state.v_target,
                    serviceTag: "Beer",
                }),
            ]
        }
    }
}

class TakeFoodOrderScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = (goal) => goal === AiGoal.work;
        this.preconditions.push((state) => !state.v_hasOrder);                      // prevent cycles
        this.preconditions.push((state) => state.v_moveTag === "FoodOrder");        // at food
        this.preconditions.push((state) => !state.v_occupyTag);                     // has occupation already been planned
        this.effects.push((state) => state.v_wantTag = "Food");
        this.effects.push((state) => state.v_gatherTag = "Food");
        this.effects.push((state) => state.v_hasOrder = true);
        this.effects.push((state) => state.v_findPredicate = ((v) => v.cls === "Stove"));
    }
    generatePlan(spec={}) {
        return new TakeFoodOrderPlan(spec);
    }
}

class TakeFoodOrderPlan extends AiPlan {
    finalize() {
        // handle success
        let effects = [ (state) => state.v_patron = state.v_target ];
        return {
            effects: effects,
            utility: 1,
            cost: 1,
            processes: [
                new TakeOrderProcess({
                    target: this.state.v_target,
                    serviceTag: "Food",
                }),
            ]
        }
    }
}


class TakeOrderProcess extends AiProcess {
    constructor(spec={}) {
        super(spec);
        this.serviceTag = spec.serviceTag || "Beer";
        this.target = spec.target;
    }

    prepare(actor) {
        this.actions = [
            new TakeOrderAction({
                target: this.target, 
                serviceTag: this.serviceTag,
            }),
        ];
        // set actor's action queue to be the individual actions
        actor.actions = this.actions.slice(0);
        return true;
    }

    update(ctx) {
        if (this.actions.length === 0) return true;
        // wait for actions to be completed
        let lastAction = this.actions[this.actions.length-1];
        return lastAction.done;
    }

}

class TakeOrderAction extends Action {
    static dfltTTL = 500;

    constructor(spec={}) {
        super(spec);
        this.target = spec.target;
        this.serviceTag = spec.serviceTag || "Beer";
        this.ttl = spec.ttl || TakeOrderAction.dfltTTL;
    }

    start(actor) {

        // update actor state
        //actor.conditions.add(this.target.actorCondition);
        if (this.target.serveOffX) actor.x = this.target.x + this.target.serveOffX;
        if (this.target.serveOffY) actor.y = this.target.y + this.target.serveOffY;
        if (this.target.serveDir) actor.heading = Direction.asHeading(this.target.serveDir);
        actor.updated = true;

        console.log(`take order action actor: ${actor} target: ${this.target}} tag: ${this.serviceTag}`);
        this.actor = actor;
    }

    update(ctx) {
        this.ttl -= ctx.deltaTime;
        if (this.ttl <= 0) {
            console.log(`actor ${this.actor} done taking order`);
            this.done = true;
            this.actor.serviceOrderId = this.target.gid;
            this.actor.serviceTag = this.serviceTag;
        }
        return this.done;
    }

}