export { WakeScheme };

import { AiScheme }         from "../base/ai/aiScheme.js";
import { AiGoal }           from "../base/ai/aiGoal.js";
import { AiPlan }           from "../base/ai/aiPlan.js";
import { AiProcess }        from "../base/ai/aiProcess.js";
import { Condition }        from "../base/condition.js";
import { Fmt }              from "../base/fmt.js";
import { LeaveAction }      from "./leave.js";
import { LevelNode } from "../lvlGraph.js";

class WakeScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = (goal) => goal !== AiGoal.sleep;
        this.preconditions.push((state) => state.a_conditions.has(Condition.asleep));
        this.preconditions.push((state) => state.a_occupyId);
        this.effects.push((state) => state.a_conditions.delete(Condition.asleep));
        this.effects.push((state) => state.a_occupyId = 0);
    }

    deriveState(env, actor, state) {
        if (!state.hasOwnProperty("a_occupyId")) state.a_occupyId = actor.occupyId;
        if (!state.hasOwnProperty("a_conditions")) state.a_conditions = new Set(actor.conditions);
    }

    generatePlan(spec={}) {
        return new WakePlan(spec);
    }

}

class WakePlan extends AiPlan {

    prepare(actor, state) {
        super.prepare(actor, state);
        // pull linked target...
        this.target = this.getEntities().get(actor.occupyId);
        if (!this.target) {
            return false;
        }
        return true;
    }

    finalize() {
        // update actor position
        let effects = [];
        if (this.target.actorSavedX && this.target.actorSavedY) {
            effects.push((state) => {
                state.a_pos = new LevelNode(this.target.actorSavedX, this.target.actorSavedY, this.actor.layer)
            });
        }
        return {
            effects: effects,
            utility: 1,
            cost: 1,
            processes: [
                new WakeProcess({target: this.target}),
            ]
        }
    }

}

class WakeProcess extends AiProcess {
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
