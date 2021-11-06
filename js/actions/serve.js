export { ServeBeerScheme, ServeFoodScheme, ClearBeerScheme, ClearFoodScheme };

import { AiScheme }         from "../base/ai/aiScheme.js";
import { AiGoal }           from "../base/ai/aiGoal.js";
import { AiPlan }           from "../base/ai/aiPlan.js";
import { AiProcess }        from "../base/ai/aiProcess.js";
import { Action }           from "../base/action.js";
import { Base }             from "../base/base.js";
import { Fmt }              from "../base/fmt.js";
import { Generator }        from "../base/generator.js";
import { Direction }        from "../base/dir.js";

class ServeBeerScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = (goal) => goal === AiGoal.work;
        this.preconditions.push((state) => state.a_carryTag === "Beer");
        this.preconditions.push((state) => state.v_moveTag === "ServeBeer");
        this.preconditions.push((state) => !state.v_occupyTag);                     // has occupation already been planned
        this.effects.push((state) => state[AiGoal.toString(AiGoal.work)] = true);
    }
    generatePlan(spec={}) {
        return new ServeBeerPlan(spec);
    }
}

class ServeBeerPlan extends AiPlan {
    finalize() {
        // handle success
        return {
            utility: 1,
            cost: 1,
            processes: [
                new ServeProcess({
                    target: this.state.v_target,
                    serveTag: "beer",
                    assetTag: "bar.beer",
                }),
            ]
        }
    }
}

class ServeFoodScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = (goal) => goal === AiGoal.work;
        this.preconditions.push((state) => state.a_carryTag === "Food");
        this.preconditions.push((state) => state.v_moveTag === "ServeFood");
        this.preconditions.push((state) => !state.v_occupyTag);                     // has occupation already been planned
        this.effects.push((state) => state[AiGoal.toString(AiGoal.work)] = true);
    }
    generatePlan(spec={}) {
        return new ServeFoodPlan(spec);
    }
}

class ServeFoodPlan extends AiPlan {
    finalize() {
        // handle success
        return {
            utility: 1,
            cost: 1,
            processes: [
                new ServeProcess({
                    target: this.state.v_target,
                    serveTag: "food",
                    assetTag: "plate",
                }),
            ]
        }
    }
}

class ServeProcess extends AiProcess {
    constructor(spec={}) {
        super(spec);
        this.target = spec.target;
        this.serveTag = spec.serveTag || "beer";
        this.assetTag = spec.assetTag || "bar.beer";
    }

    prepare(actor) {
        this.actions = [
            new ServeAction({
                target: this.target,
                serveTag: this.serveTag,
                assetTag: this.assetTag,
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

class ServeAction extends Action {

    constructor(spec={}) {
        super(spec);
        this.target = spec.target;
        this.ttl = spec.ttl || 1000;
        this.assets = spec.assets || Base.instance.assets;
        this.serveTag = spec.serveTag || "beer";
        this.assetTag = spec.assetTag || "bar.beer";
    }

    start(actor) {
        console.log(`serve action actor: ${actor} target: ${this.target}} serve: ${this.serveTag}`);
        this.actor = actor;
        // update actor state
        //actor.conditions.add(this.target.actorCondition);
        if (this.target.serveOffX) actor.x = this.target.x + this.target.serveOffX;
        if (this.target.serveOffY) actor.y = this.target.y + this.target.serveOffY;
        if (this.target.serveDir) actor.heading = Direction.asHeading(this.target.serveDir);
        actor.updated = true;
        // actor drops what they were carrying
        this.actor.carryTag = undefined;
    }

    update(ctx) {
        this.ttl -= ctx.deltaTime;
        if (this.ttl <= 0) {
            console.log(`actor ${this.actor} done serving ${this.serveTag}`);
            this.done = true;
            //this.actor.conditions.delete(Condition.eating);
            // actor clears service order
            this.actor.serviceOrderId = 0;
            this.actor.serviceTag = null;
            // spawn served item
            let offx = this.target.hasOwnProperty(`${this.serveTag}OffX`) ? this.target[`${this.serveTag}OffX`] : 0;
            let offy = this.target.hasOwnProperty(`${this.serveTag}OffY`) ? this.target[`${this.serveTag}OffY`] : 0;
            let xserved = this.assets.fromTag(this.assetTag);
            xserved = Object.assign({
                x: this.target.x + offx,
                y: this.target.y + offy,
                depth: this.target.depth + 1,
                layer: this.target.layer,
            }, xserved);
            let served = Generator.generate(xserved);
            let serveid = `${this.serveTag}Id`;
            this.target[serveid] = served.gid;
        }
        return this.done;
    }

}

class ClearBeerScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = (goal) => goal === AiGoal.work;
        this.preconditions.push((state) => !state.a_occupyId);                              // is actor currently occupying an area
        this.preconditions.push((state) => !state.v_occupyTag);                             // has occupation already been planned
        this.preconditions.push((state) => state.v_moveTag === "BeerClear");
        this.effects.push((state) => state[AiGoal.toString(AiGoal.work)] = true);
    }
    generatePlan(spec={}) {
        return new ClearBeerPlan(spec);
    }
}

class ClearBeerPlan extends AiPlan {
    finalize() {
        // handle success
        return {
            utility: 1,
            cost: 1,
            processes: [
                new ClearProcess({
                    target: this.state.v_target,
                    clearId: "beerId",
                }),
            ]
        }
    }
}

class ClearFoodScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = (goal) => goal === AiGoal.work;
        this.preconditions.push((state) => !state.a_occupyId);                              // is actor currently occupying an area
        this.preconditions.push((state) => !state.v_occupyTag);                             // has occupation already been planned
        this.preconditions.push((state) => state.v_moveTag === "FoodClear");
        this.effects.push((state) => state[AiGoal.toString(AiGoal.work)] = true);
    }
    generatePlan(spec={}) {
        return new ClearFoodPlan(spec);
    }
}

class ClearFoodPlan extends AiPlan {
    finalize() {
        // handle success
        return {
            utility: 1,
            cost: 1,
            processes: [
                new ClearProcess({
                    target: this.state.v_target,
                    clearId: "foodId",
                }),
            ]
        }
    }
}

class ClearProcess extends AiProcess {
    constructor(spec={}) {
        super(spec);
        this.target = spec.target;
        this.clearId = spec.clearId || "beerId";
    }

    prepare(actor) {
        this.actions = [
            new ClearAction({
                target: this.target,
                clearId: this.clearId,
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

class ClearAction extends Action {

    constructor(spec={}) {
        super(spec);
        this.target = spec.target;
        this.ttl = spec.ttl || 1000;
        this.entities = spec.entities || Base.instance.entities;
        this.clearId = spec.clearId || "beerId";
    }

    start(actor) {
        console.log(`clear beer action actor: ${actor} target: ${this.target}}`);
        this.actor = actor;

        // update actor state
        //actor.conditions.add(this.target.actorCondition);
        if (this.target.serveOffX) actor.x = this.target.x + this.target.serveOffX;
        if (this.target.serveOffY) actor.y = this.target.y + this.target.serveOffY;
        if (this.target.serveDir) actor.heading = Direction.asHeading(this.target.serveDir);
        actor.updated = true;

    }

    update(ctx) {
        this.ttl -= ctx.deltaTime;
        if (this.ttl <= 0) {
            console.log(`actor ${this.actor} done clearing beer`);
            this.done = true;
            // lookup clear object by ID
            let clear = this.entities.get(this.target[this.clearId]);
            if (!clear) console.error(`tried to clean up ${this.clearId} but it wasn't there...`);
            // destroy the object
            if (clear) clear.destroy();
            // clear beer reference from target
            this.target[this.clearId] = 0;
        }
        return this.done;
    }

}