export { ServeBeerScheme, ClearBeerScheme };

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
                new ServeBeerProcess({target: this.state.v_target}),
            ]
        }
    }

}

class ServeBeerProcess extends AiProcess {
    constructor(spec={}) {
        super(spec);
        this.target = spec.target;
    }

    prepare(actor) {
        this.actions = [
            new ServeBeerAction({target: this.target}),
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

class ServeBeerAction extends Action {

    constructor(spec={}) {
        super(spec);
        this.target = spec.target;
        this.ttl = spec.ttl || 1000;
        this.assets = spec.assets || Base.instance.assets;
    }

    start(actor) {
        console.log(`serve beer action actor: ${actor} target: ${this.target}}`);
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
            console.log(`actor ${this.actor} done serving beer`);
            this.done = true;
            //this.actor.conditions.delete(Condition.eating);
            // actor clears service order
            this.actor.serviceOrderId = 0;
            this.actor.serviceTag = null;
            // beer is placed
            let xbeer = this.assets.fromTag("bar.beer");
            xbeer = Object.assign({
                x: this.target.x + this.target.beerOffX,
                y: this.target.y + this.target.beerOffY,
                depth: this.target.depth + 1,
                layer: this.target.layer,
            }, xbeer);
            let beer = Generator.generate(xbeer);

            console.log(`xbeer: ${Fmt.ofmt(xbeer)}, beer: ${beer}`);
            // FIXME: is beer spawned?
            this.target.beerId = beer.gid;
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
                new ClearBeerProcess({target: this.state.v_target}),
            ]
        }
    }

}

class ClearBeerProcess extends AiProcess {
    constructor(spec={}) {
        super(spec);
        this.target = spec.target;
    }

    prepare(actor) {
        this.actions = [
            new ClearBeerAction({target: this.target}),
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

class ClearBeerAction extends Action {

    constructor(spec={}) {
        super(spec);
        this.target = spec.target;
        this.ttl = spec.ttl || 1000;
        this.entities = spec.entities || Base.instance.entities;
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
            // lookup beer by ID
            let beer = this.entities.get(this.target.beerId);
            if (!beer) console.error(`tried to clean up beer but it wasn't there...`);
            // destroy the beer
            if (beer) beer.destroy();
            // clear beer reference from target
            this.target.beerId = 0;
        }
        return this.done;
    }

}