export { GatherScheme };

import { AiScheme }         from "../base/ai/aiScheme.js";
import { AiPlan }           from "../base/ai/aiPlan.js";
import { AiProcess }        from "../base/ai/aiProcess.js";
import { Action }           from "../base/action.js";
import { Direction } from "../base/dir.js";

class GatherScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = spec.goalPredicate || ((v) => true);
        this.preconditions.push((state) => !state.v_gathered);
        this.preconditions.push((state) => state.a_carryTag === undefined);
        this.preconditions.push((state) => state.v_gatherTag !== undefined);
        this.preconditions.push((state) => state.v_moveTag === state.v_gatherTag);
        this.effects.push((state) => state.a_carryTag = state.v_gatherTag);
        this.effects.push((state) => state.v_gathered = true);
        //this.effects.push((state) => state.v_wantTag = undefined);
    }

    deriveState(env, actor, state) {
        if (!state.hasOwnProperty("a_carryTag")) state.a_carryTag = actor.carryTag;
    }

    generatePlan(spec={}) {
        return new GatherPlan(spec);
    }

}

class GatherPlan extends AiPlan {

    prepare(actor, state) {
        super.prepare(actor, state);
        let target = this.state.v_target;
        return true;
    }

    finalize() {
        // handle success
        return {
            utility: 1,
            cost: 1,
            processes: [
                new GatherProcess({target: this.state.v_target}),
            ]
        }
    }

}

class GatherProcess extends AiProcess {
    constructor(spec={}) {
        super(spec);
        this.target = spec.target;
    }

    prepare(actor) {
        this.actions = [
            new GatherAction({target: this.target}),
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

class GatherAction extends Action {

    constructor(spec={}) {
        super(spec);
        this.target = spec.target;
        this.ttl = spec.ttl || 1000;
    }

    start(actor) {
        //console.log(`gather action actor: ${actor} target: ${this.target}}`);
        if (this.target.gatherOffX) actor.x = this.target.x + this.target.gatherOffX;
        if (this.target.gatherOffY) actor.y = this.target.y + this.target.gatherOffY;
        if (this.target.gatherDir) actor.heading = Direction.asHeading(this.target.gatherDir);
        this.actor = actor;
    }

    update(ctx) {
        this.ttl -= ctx.deltaTime;
        if (this.ttl <= 0) {
            // actor gathers from target
            this.target.gather(this.actor);
            this.done = true;
        }
        return this.done;
    }

}
