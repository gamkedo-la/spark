export { TakeBeerOrderScheme };

import { AiScheme }         from "../base/ai/aiScheme.js";
import { AiGoal }           from "../base/ai/aiGoal.js";
import { AiPlan }           from "../base/ai/aiPlan.js";
import { AiProcess }        from "../base/ai/aiProcess.js";
import { Action }           from "../base/action.js";
import { Condition }        from "../base/condition.js";
import { Direction } from "../base/dir.js";

class TakeBeerOrderScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = (goal) => goal === AiGoal.work;
        this.preconditions.push((state) => state.v_moveTag === "BeerOrder");
        this.effects.push((state) => state[AiGoal.toString(AiGoal.work)] = true);
    }

    generatePlan(spec={}) {
        return new TakeBeerOrderPlan(spec);
    }

}

class TakeBeerOrderPlan extends AiPlan {

    finalize() {
        // handle success
        return {
            utility: 1,
            cost: 1,
            processes: [
                new TakeBeerOrderProcess({target: this.state.v_target}),
            ]
        }
    }

}

class TakeBeerOrderProcess extends AiProcess {
    constructor(spec={}) {
        super(spec);
        this.target = spec.target;
    }

    prepare(actor) {
        this.actions = [
            new TakeBeerOrderAction({target: this.target}),
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

class TakeBeerOrderAction extends Action {
    static dfltTTL = 2000;

    constructor(spec={}) {
        super(spec);
        this.target = spec.target;
        this.ttl = spec.ttl || TakeBeerOrderAction.dfltTTL;
    }

    start(actor) {

        // update actor state
        //actor.conditions.add(this.target.actorCondition);
        if (this.target.serveOffX) actor.x = this.target.x + this.target.serveOffX;
        if (this.target.serveOffY) actor.y = this.target.y + this.target.serveOffY;
        if (this.target.serveDir) actor.heading = Direction.asHeading(this.target.serveDir);
        actor.updated = true;

        console.log(`take beer order action actor: ${actor} target: ${this.target}}`);
        this.actor = actor;
    }

    update(ctx) {
        this.ttl -= ctx.deltaTime;
        if (this.ttl <= 0) {
            console.log(`actor ${this.actor} done taking order`);
            this.done = true;
            this.actor.serviceOrderId = this.target.gid;
            this.actor.serviceTag = "Beer";
        }
        return this.done;
    }

}