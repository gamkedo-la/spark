export { OccupyScheme, OccupyAction };

import { AiScheme }         from "../base/ai/aiScheme.js";
import { AiPlan }           from "../base/ai/aiPlan.js";
import { AiProcess }        from "../base/ai/aiProcess.js";
import { Action }           from "../base/action.js";
import { Direction } from "../base/dir.js";
import { Fmt } from "../base/fmt.js";

class OccupyScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = spec.goalPredicate || ((v) => true);
        this.preconditions.push((state) => !state.v_occupied);
        this.preconditions.push((state) => !state.a_occupyId);
        this.preconditions.push((state) => state.v_wantTag !== undefined);
        this.preconditions.push((state) => state.v_occupyTag === undefined);
        this.preconditions.push((state) => state.v_moveTag === state.v_wantTag);
        this.effects.push((state) => state.v_occupyTag = state.v_wantTag);
        this.effects.push((state) => state.v_occupied = true);
        this.effects.push((state) => state.v_wantTag = undefined);
    }

    deriveState(env, actor, state) {
        if (!state.hasOwnProperty("a_occupyId")) state.a_occupyId = actor.occupyId;
    }

    generatePlan(spec={}) {
        return new OccupyPlan(spec);
    }

}

class OccupyPlan extends AiPlan {

    prepare(actor, state) {
        super.prepare(actor, state);
        let target = this.state.v_target;
        if (target.conditions.has(target.occupiedCondition)) {
            //console.log("OccupyPlan: target is occupied");
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
                new OccupyProcess({target: this.state.v_target}),
            ]
        }
    }

}

class OccupyProcess extends AiProcess {
    constructor(spec={}) {
        super(spec);
        this.target = spec.target;
    }

    prepare(actor) {
        this.actions = [
            new OccupyAction({target: this.target}),
        ];
        // set actor's action queue to be the individual actions from movement...
        actor.actions = this.actions.slice(0);
        return true;
    }

    update(ctx) {
        if (this.actions.length === 0) return true;
        // wait for actions to be completed
        let lastAction = this.actions[this.actions.length-1];
        return lastAction.done;
    }

    finalize() {
        return this.actions.every((v) => v.ok);
    }

}

class OccupyAction extends Action {

    constructor(spec={}) {
        super(spec);
        this.target = spec.target;
    }

    start(actor) {
        //console.log(`occupy action actor: ${actor} target: ${this.target}}`);
        this.actor = actor;
        // check that target can be occupied
        if (this.target.conditions.has(this.target.occupiedCondition)) {
            //console.log(`actor: ${actor} cannot occupy: ${this.target} -- already occupied ${this.target.actorId}`);
            this.ok = false;
        } else {
            // actor occupies target
            //this.target.occupy(actor);

            // update target state
            this.target.conditions.add(this.target.occupiedCondition);
            if (this.target.occupiedX) this.target.offx = this.target.occupiedX;
            if (this.target.occupiedY) this.target.offy = this.target.occupiedY;
            this.target.actorSavedX = actor.x;
            this.target.actorSavedY = actor.y;
            this.target.actorSavedDepth = actor.depth;
            this.target.actorId = actor.gid;
            this.target.updated = true;

            // update actor state
            actor.conditions.add(this.target.actorCondition);
            if (this.target.occupiedOffX) actor.x = this.target.x + this.target.occupiedOffX;
            if (this.target.occupiedOffY) actor.y = this.target.y + this.target.occupiedOffY;
            if (this.target.occupiedDir) actor.heading = Direction.asHeading(this.target.occupiedDir);
            if (this.target.occupiedOffD) actor.depth += this.target.occupiedOffD;
            actor.occupyId = this.target.gid;
            actor.occupyCls = this.target.cls;
            actor.updated = true;

        }
    }

    update(ctx) {
        this.done = true;
        return this.done;
    }

}
