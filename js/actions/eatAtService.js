export { WaitAtServiceScheme, EatAtServiceScheme, DrinkAtServiceScheme, ComplimentAtServiceScheme };

import { AiScheme }         from "../base/ai/aiScheme.js";
import { AiGoal }           from "../base/ai/aiGoal.js";
import { AiPlan }           from "../base/ai/aiPlan.js";
import { AiProcess }        from "../base/ai/aiProcess.js";
import { Action }           from "../base/action.js";
import { Condition } from "../base/condition.js";
import { ChatSystem } from "../chatSystem.js";
import { ComplimentAction } from "./compliment.js";

class WaitAtServiceScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = (goal) => goal === AiGoal.socialize;
        this.preconditions.push((state) => state.v_occupyTag === "MealService");
        this.effects.push((state) => state[AiGoal.toString(AiGoal.socialize)] = true);
    }

    generatePlan(spec={}) {
        return new WaitAtServicePlan(spec);
    }
}

class WaitAtServicePlan extends AiPlan {

    finalize() {
        // handle success
        return {
            utility: 1,
            cost: 1,
        }
    }

}

class EatAtServiceScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = (goal) => goal === AiGoal.socialize;
        this.preconditions.push((state) => state.a_occupyCls === "MealService");
        this.preconditions.push((state) => state.a_conditions.has(Condition.hungry));
        this.effects.push((state) => state[AiGoal.toString(AiGoal.socialize)] = true);
    }
    deriveState(env, actor, state) {
        if (!state.hasOwnProperty("a_occupyCls")) state.a_occupyCls = actor.occupyCls;
        if (!state.hasOwnProperty("a_conditions")) state.a_conditions = new Set(actor.conditions);
    }
    generatePlan(spec={}) {
        return new EatAtServicePlan(spec);
    }
}

class DrinkAtServiceScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = (goal) => goal === AiGoal.socialize;
        this.preconditions.push((state) => state.a_occupyCls === "MealService");
        this.preconditions.push((state) => state.a_conditions.has(Condition.thirsty));
        this.effects.push((state) => state[AiGoal.toString(AiGoal.socialize)] = true);
    }
    deriveState(env, actor, state) {
        if (!state.hasOwnProperty("a_occupyCls")) state.a_occupyCls = actor.occupyCls;
        if (!state.hasOwnProperty("a_conditions")) state.a_conditions = new Set(actor.conditions);
    }
    generatePlan(spec={}) {
        return new DrinkAtServicePlan(spec);
    }
}

class ComplimentAtServiceScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = (goal) => goal === AiGoal.socialize;
        this.preconditions.push((state) => state.a_occupyCls === "MealService");
        this.effects.push((state) => state[AiGoal.toString(AiGoal.socialize)] = true);
    }
    deriveState(env, actor, state) {
        if (!state.hasOwnProperty("a_occupyCls")) state.a_occupyCls = actor.occupyCls;
        if (!state.hasOwnProperty("a_conditions")) state.a_conditions = new Set(actor.conditions);
    }
    generatePlan(spec={}) {
        return new ComplimentAtServicePlan(spec);
    }
}

class EatAtServicePlan extends AiPlan {
    prepare(actor, state) {
        super.prepare(actor, state);
        // lookup what actor is occupying
        let oobj = this.entities.get(actor.occupyId);
        console.log(`============== oobj is: ${oobj}`);
        if (oobj) console.log(`target foodid is: ${oobj.foodId}`);
        if (!oobj || !oobj.foodId) {
            console.log("EatAtServicePlan: no food");
            return false;
        }
        return true;
    }
    finalize() {
        // handle success
        return {
            utility: 1,
            cost: 1,
            processes: [
                new EatProcess({target: this.state.v_target}),
            ]
        }
    }
}

class DrinkAtServicePlan extends AiPlan {
    prepare(actor, state) {
        super.prepare(actor, state);
        // lookup what actor is occupying
        let oobj = this.entities.get(actor.occupyId);
        console.log(`============== oobj is: ${oobj}`);
        if (oobj) console.log(`target beerId is: ${oobj.beerId}`);
        if (!oobj || !oobj.beerId) {
            console.log("DrinkAtServicePlan: no beer");
            return false;
        }
        return true;
    }
    finalize() {
        // handle success
        return {
            utility: 1,
            cost: 1,
            processes: [
                new DrinkProcess({target: this.state.v_target}),
            ]
        }
    }
}

class ComplimentAtServicePlan extends AiPlan {
    prepare(actor, state) {
        super.prepare(actor, state);
        // lookup what actor is occupying
        let service = this.entities.get(actor.occupyId);
        // lookup innkeeper
        this.innkeeper = this.entities.findFirst((e) => e.tag === "ciara");
        if (!this.innkeeper) {
            console.log(`cant find inkeeper`);
            return false;
        }
        // check if occupy location has been served food and beer...
        if (service) console.log(`service beerId is: ${service.beerId} foodId is: ${service.foodId}`);
        if (!service || !service.beerId || !service.foodId) {
            console.log("ComplimentAtServicePlan: missing food or beer");
            return false;
        }
        // check for chat timers
        if (!ChatSystem.checkChat(actor, this.innkeeper, "chat.compliment")) {
            console.log("compliment timer hit");
            return false;
        }
        return true;
    }
    finalize() {
        // handle success
        return {
            utility: 1,
            cost: 1,
            processes: [
                new ComplimentProcess({innkeeper: this.innkeeper, msg: "yay! beer!"}),
            ]
        }
    }
}

class EatProcess extends AiProcess {
    constructor(spec={}) {
        super(spec);
        this.target = spec.target;
    }
    prepare(actor) {
        this.actions = [
            new EatAction({target: this.target}),
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

class DrinkProcess extends AiProcess {
    constructor(spec={}) {
        super(spec);
        this.target = spec.target;
    }
    prepare(actor) {
        this.actions = [
            new DrinkAction({target: this.target}),
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

class EatAction extends Action {
    constructor(spec={}) {
        super(spec);
        this.target = spec.target;
        this.ttl = spec.ttl || 10000;
    }
    start(actor) {
        //console.log(`eat action actor: ${actor} target: ${this.target}}`);
        this.actor = actor;
        // actor drops food
        this.actor.carryTag = undefined;
        // actor applies eating condition
        this.actor.conditions.add(Condition.eating);
    }
    update(ctx) {
        this.ttl -= ctx.deltaTime;
        if (this.ttl <= 0) {
            //console.log(`actor ${this.actor} done eating`);
            this.done = true;
            this.actor.conditions.delete(Condition.eating);
            if (this.actor.maxFedTTL) this.actor.fedTTL = this.actor.maxFedTTL;
        }
        return this.done;
    }
}

class DrinkAction extends Action {
    constructor(spec={}) {
        super(spec);
        this.target = spec.target;
        this.ttl = spec.ttl || 10000;
    }
    start(actor) {
        //console.log(`eat action actor: ${actor} target: ${this.target}}`);
        this.actor = actor;
        // actor drops food
        this.actor.carryTag = undefined;
        // actor applies condition
        this.actor.conditions.add(Condition.drinking);
    }
    update(ctx) {
        this.ttl -= ctx.deltaTime;
        if (this.ttl <= 0) {
            //console.log(`actor ${this.actor} done drinking`);
            this.done = true;
            this.actor.conditions.delete(Condition.drinking);
            if (this.actor.maxFedTTL) this.actor.quenchTTL = this.actor.maxQuenchTTL;
        }
        return this.done;
    }
}

class ComplimentProcess extends AiProcess {
    constructor(spec={}) {
        super(spec);
        this.innkeeper = spec.innkeeper;
        this.msg = spec.msg;
    }
    prepare(actor) {
        this.actions = [
            new ComplimentAction({target: this.innkeeper, msg: this.msg}),
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