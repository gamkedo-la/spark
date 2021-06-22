export { SleepBedScheme, SleepBedPlan };

import { AiScheme }         from "../base/ai/aiScheme.js";
import { AiGoal }           from "../base/ai/aiGoal.js";
import { AiPlan }           from "../base/ai/aiPlan.js";
import { AiProcess }        from "../base/ai/aiProcess.js";
import { ModelState }       from "../base/modelState.js";
import { Action }           from "../base/action.js";

class SleepBedScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = (goal) => goal === AiGoal.sleep;
        this.preconditions.push((state) => state.v_locationTag === "bed");
        //this.effects.target = "bed";
        this.effects[AiGoal.toString(AiGoal.sleep)] = true;
    }

    generatePlan(spec={}) {
        return new SleepBedPlan(spec);
    }

}

class SleepBedPlan extends AiPlan {

    prepare(actor, state) {
        super.prepare(actor, state);
        if (!this.state.v_bed) {
            console.log("SleepBedPlan: state missing entity bed");
            return false;
        }
        if (this.state.v_bed.state !== ModelState.idle) {
            console.log("SleepBedPlan: bed is occupied");
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
                new SleepBedProcess({bed: this.state.v_bed}),
            ]
        }
    }

}

class SleepBedProcess extends AiProcess {
    constructor(spec={}) {
        super(spec);
        this.bed = spec.bed;
    }

    prepare(actor) {
        this.actions = [
            new EnterBedAction({bed: this.bed}),
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

class EnterBedAction extends Action {

    constructor(spec={}) {
        super(spec);
        this.bed = spec.bed;
    }

    start(actor) {
        console.log("enter bed actor: " + actor);
        console.log("enter bed bed: " + this.bed);
        this.actor = actor;
        // actor occupies bed
        this.bed.occupy(actor);
        /*
        actor.x = this.bed.x;
        actor.y = this.bed.y;
        actor.linkId = this.bed.gid;
        console.log("===> setting actor.linkId: " + actor.linkId);
        // update actor state
        actor.state = ModelState.sleep;
        // update bed state
        this.bed.state = ModelState.occupied;
        this.bed.linkId = actor.gid;
        */
    }

    update(ctx) {
        this.done = true;
        return this.done;
    }

}