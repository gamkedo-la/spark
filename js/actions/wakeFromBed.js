export { WakeFromBedScheme, WakeFromBedPlan };

import { AiScheme }         from "../base/ai/aiScheme.js";
import { AiGoal }           from "../base/ai/aiGoal.js";
import { AiPlan }           from "../base/ai/aiPlan.js";
import { AiProcess }        from "../base/ai/aiProcess.js";
import { ModelState }       from "../base/modelState.js";
import { Action }           from "../base/action.js";
import { Fmt } from "../base/fmt.js";

class WakeFromBedScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = (goal) => goal !== AiGoal.sleep;
        this.preconditions.push((state) => state.a_state === ModelState.sleep);
        this.preconditions.push((state) => state.a_linkId);
        this.effects.a_state = ModelState.idle;
        //this.effects.elink = undefined;
        this.effects[AiGoal.toString(AiGoal.idle)] = true;
    }

    deriveState(env, actor, state) {
        if (!state.hasOwnProperty("state")) state.a_state = actor.state;
        if (!state.hasOwnProperty("linkId")) state.a_linkId = actor.linkId;
    }

    generatePlan(spec={}) {
        return new WakeFromBedPlan(spec);
    }

}

class WakeFromBedPlan extends AiPlan {

    prepare(actor, state) {
        console.log("=== WakeFromBed state: " + Fmt.ofmt(state));
        super.prepare(actor, state);
        // pull linked bed...
        this.bed = this.getEntities().get(state.a_linkId);
        if (!this.bed) {
            console.log("WakeFromBedPlan: can't look up bed for link: " + state.a_linkId);
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
                new WakeFromBedProcess({bed: this.bed}),
            ]
        }
    }

}

class WakeFromBedProcess extends AiProcess {
    constructor(spec={}) {
        super(spec);
        this.bed = spec.bed;
    }

    prepare(actor) {
        this.actions = [
            new WakeFromBedAction({bed: this.bed}),
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

class WakeFromBedAction extends Action {

    constructor(spec={}) {
        super(spec);
        this.bed = spec.bed;
    }

    start(actor) {
        //console.log("enter bed actor: " + actor);
        //console.log("enter bed bed: " + this.bed);
        this.actor = actor;
        // does bed have port
        let target;
        if (Object.getPrototypeOf(this.bed).hasOwnProperty("approaches")) {
            let approaches = this.bed.approaches;
            for (const approach of approaches) {
                // FIXME: check for occupied
                target = approach;
                break;
            }
        } else {
            target = bed;
        }
        // reposition actor from bed
        actor.x = target.x;
        actor.y = target.y;
        actor.elink = 0;
        // update actor state
        actor.state = ModelState.idle;
        // update bed state
        this.bed.state = ModelState.idle;
        this.bed.elink = 0;
    }

    update(ctx) {
        this.done = true;
        return this.done;
    }

}