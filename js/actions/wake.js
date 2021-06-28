export { WakeScheme };

import { AiScheme }         from "../base/ai/aiScheme.js";
import { AiGoal }           from "../base/ai/aiGoal.js";
import { AiPlan }           from "../base/ai/aiPlan.js";
import { AiProcess }        from "../base/ai/aiProcess.js";
import { Condition }        from "../base/condition.js";
import { Fmt }              from "../base/fmt.js";
import { LeaveAction }      from "./leave.js";

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
        console.log("=== WakePlan state: " + Fmt.ofmt(state));
        super.prepare(actor, state);
        // pull linked target...
        this.target = this.getEntities().get(state.a_occupyId);
        if (!this.target) {
            console.log("WakePlan: can't look up target for link: " + state.a_occupyId);
            return false;
        }
        return true;
    }

    finalize() {
        return {
            effects: this.state,
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