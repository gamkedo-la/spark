export { LeaveScheme };
export { LeaveAction };

import { Action }           from "../base/action.js";

import { AiScheme }         from "../base/ai/aiScheme.js";
import { AiPlan }           from "../base/ai/aiPlan.js";
import { AiProcess }        from "../base/ai/aiProcess.js";
import { Condition }        from "../base/condition.js";
import { LevelNode }        from "../lvlGraph.js";

class LeaveScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.preconditions.push((state) => !state.v_left);
        this.preconditions.push((state) => state.a_occupyId);
        this.effects.push((state) => state.a_occupyId = 0);
        this.effects.push((state) => state.v_left = true);
    }

    deriveState(env, actor, state) {
        if (!state.hasOwnProperty("a_occupyId")) state.a_occupyId = actor.occupyId;
    }

    generatePlan(spec={}) {
        return new LeavePlan(spec);
    }

}

class LeavePlan extends AiPlan {

    prepare(actor, state) {
        super.prepare(actor, state);
        // pull linked target...
        this.target = this.getEntities().get(actor.occupyId);
        if (!this.target) {
            console.log("LeavePlan: can't look up target for link: " + actor.occupyId);
            return false;
        }
        return true;
    }

    finalize() {
        let effects = [];
        if (this.target.actorSavedX && this.target.actorSavedY) {
            effects.push((state) => {
                state.a_pos = new LevelNode(this.target.actorSavedX, this.target.actorSavedY, this.actor.layer)
                //console.log(`leave setting state a_pos to ${state.a_pos}`);
            });
        }
        return {
            effects: effects,
            utility: 1,
            cost: 1,
            processes: [
                new LeaveProcess({target: this.target}),
            ]
        }
    }

}

class LeaveProcess extends AiProcess {
    constructor(spec={}) {
        super(spec);
        this.target = spec.target;
    }

    prepare(actor) {
        this.actions = [
            new LeaveAction({target: this.target}),
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

}

class LeaveAction extends Action {

    constructor(spec={}) {
        super(spec);
        this.target = spec.target;
    }

    start(actor) {
        console.log(`leave action actor: ${actor} target: ${this.target}}`);
        this.actor = actor;
        // check that target is occupied by actor
        if (this.target.actorId !== actor.gid) {
            console.log(`actor: ${actor} cannot leave: ${this.target} -- not occupied`);
            this.ok = false;
        } else {
            // actor leaves target
            //this.target.leave(actor);

            // update target state
            this.target.conditions.delete(this.target.occupiedCondition);
            if (this.target.hasOwnProperty("emptyX")) this.target.offx = this.target.emptyX;
            if (this.target.hasOwnProperty("emptyY")) this.target.offy = this.target.emptyY;
            this.target.actorId = 0;
            this.target.updated = true;

            // update actor state
            actor.conditions.delete(this.target.actorCondition)
            actor.x = this.target.actorSavedX;
            actor.y = this.target.actorSavedY;
            actor.depth = this.target.actorSavedDepth;
            actor.occupyId = 0;
            actor.updated = true;

        }
    }

    update(ctx) {
        this.done = true;
        return this.done;
    }

}