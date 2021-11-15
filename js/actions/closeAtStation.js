export { CloseAtStationScheme };

import { AiScheme }         from "../base/ai/aiScheme.js";
import { AiGoal }           from "../base/ai/aiGoal.js";
import { AiPlan }           from "../base/ai/aiPlan.js";
import { AiProcess }        from "../base/ai/aiProcess.js";
import { Action }           from "../base/action.js";

class CloseAtStationScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = (goal) => (goal === AiGoal.close);
        this.preconditions.push((state) => state.v_occupyTag === "Workstation");
        this.effects.push((state) => state[AiGoal.toString(AiGoal.close)] = true);
    }

    generatePlan(spec={}) {
        return new CloseAtStationPlan(spec);
    }

}


class CloseAtStationPlan extends AiPlan {
    prepare(actor, state) {
        super.prepare(actor, state);
        let target = this.state.v_target;
        if (target.conditions.has(target.closedCondition)) {
            return false;
        }
        return true;
    }


    finalize() {
        // handle success
        return {
            utility: 2, // higher utility ensures this gets done first if it can...
            cost: 1,
            processes: [
                new CloseProcess({target: this.state.v_target}),
            ]
        }
    }

}

class CloseProcess extends AiProcess {
    constructor(spec={}) {
        super(spec);
        this.target = spec.target;
    }

    prepare(actor) {
        this.actions = [
            new CloseAction({target: this.target}),
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

class CloseAction extends Action {
    static dfltTTL = 2000;

    constructor(spec={}) {
        super(spec);
        this.target = spec.target;
        this.ttl = spec.ttl || CloseAction.dfltTTL;
    }

    start(actor) {
        this.actor = actor;
        // actor applies sweeping condition
        //this.actor.conditions.add(Condition.sweeping);
    }

    update(ctx) {
        this.ttl -= ctx.deltaTime;
        if (this.ttl <= 0) {
            this.done = true;
            //this.actor.conditions.delete(Condition.sweeping);
            // remove close condition from target
            this.target.conditions.add(this.target.closedCondition);
        }
        return this.done;
    }

}
