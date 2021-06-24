export { UseWorkstationScheme };

import { AiScheme }         from "../base/ai/aiScheme.js";
import { AiGoal }           from "../base/ai/aiGoal.js";
import { AiPlan }           from "../base/ai/aiPlan.js";
import { AiProcess }        from "../base/ai/aiProcess.js";
import { Condition }        from "../base/condition.js";
import { OccupyAction }     from "./occupy.js";

class UseWorkstationScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = (goal) => goal === AiGoal.manage;
        this.preconditions.push((state) => state.v_locationTag === "workstation");
        this.preconditions.push((state) => !state.conditions.has(Condition.working));
        this.effects.a_conditions.add(Condition.working);
    }

    deriveState(env, actor, state) {
        if (!state.hasOwnProperty("a_conditions")) state.a_conditions = new Set(actor.conditions);
    }

    generatePlan(spec={}) {
        return new UseWorkstationPlan(spec);
    }

}

class UseWorkstationPlan extends AiPlan {

    prepare(actor, state) {
        super.prepare(actor, state);
        if (!this.state.v_workstation) {
            console.log("UseWorkstationPlan: state missing workstation");
            return false;
        }
        if (this.state.v_bed.conditions.has(Condition.occupied)) {
            console.log("UseWorkstationPlan: workstation is occupied");
            return false;
        }
        return true;
    }

    finalize() {
        // handle success
        return {
            effects: this.state,
            utility: 1,
            cost: 1,
            processes: [
                new UseWorkstationProcess({workstation: this.state.v_workstation}),
            ]
        }
    }

}

class UseWorkstationProcess extends AiProcess {
    constructor(spec={}) {
        super(spec);
        this.workstation = spec.workstation;
    }

    prepare(actor) {
        this.actions = [
            new OccupyAction({target: this.workstation}),
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