export { MoveScheme, MovePlan };

import { AiScheme }         from "../base/ai/aiScheme.js";
import { AiPlan }           from "../base/ai/aiPlan.js";
import { AiProcess }        from "../base/ai/aiProcess.js";
import { LevelNode }        from "../lvlGraph.js";
import { Util }             from "../base/util.js";
import { Fmt } from "../base/fmt.js";
import { Base } from "../base/base.js";

class MoveScheme extends AiScheme {
    constructor(spec={}) {
        super(spec);
        this.goalPredicate = (goal) => true;
        this.preconditions.push((state) => state.v_findTag !== undefined);
        this.preconditions.push((state) => state.v_moveTag !== state.v_findTag);
        this.effects.push((state) => state.v_moveTag = state.v_findTag);
    }

    deriveState(env, actor, state) {
        if (!state.hasOwnProperty("a_pos")) state.a_pos = new LevelNode(actor.x, actor.y, actor.layer);
    }

    generatePlan(spec={}) {
        return new MovePlan(spec);
    }
}

class MovePlan extends AiPlan {
    prepare(actor, state) {
        //console.log(`MovePlan prepare state ${Fmt.ofmt(state)}`);
        super.prepare(actor, state);
        if (!this.state.v_target) {
            return false;
        }
        if (!this.state.a_pos) {
            return false;
        }
        return true;
    }

    update(ctx) {
        // find path to target ...
        // -- consider if target has defined approaches
        let targets = [];
        let approaches = this.state.v_target.approaches;
        if (approaches) {
            for (const approach of approaches) {
                //console.log(`considering approach: ${approach}`);
                // is approach viable?
                if (!Util.empty(this.findOverlaps(approach, (v => v !== this.actor && v !== this.state.v_target && v.collider && (v.collider.blocking & this.actor.collider.blocking))))) continue;
                //console.log(`push approach: ${approach}`);
                targets.push(approach);
            }
        }
        if (!targets.length) {
            targets = [ new LevelNode(this.state.v_target.x, this.state.v_target.y, this.state.v_target.layer) ];
        }

        // iterate through possible targets, find best path
        let best;
        let bestPath;
        //console.log(`===> consider targets: ${targets}`);
        let pathfinder = this.getPathfinder();
        for (const target of targets) {
            /*
            if (this.state.a_pos.x===808 && this.state.a_pos.y===120 &&
                target.x===1000 && target.y===104) {
                pathfinder.dbg = true;
            }
            */
            let blocking = (this.actor && this.actor.collider) ? this.actor.collider.blocking : 0;
            let pathinfo = pathfinder.find(this.state.a_pos, target, blocking);
            //pathfinder.dbg = false;
            //if (!pathinfo) console.log(`===> pathfinder from ${this.state.a_pos} to ${target} failed`);
            if (!pathinfo) continue;
            if (!best || pathinfo.cost < bestPath.cost) {
                best = target;
                bestPath = pathinfo;
            }
        }
        this.target = best;
        this.pathinfo = bestPath;
        return true;
    }

    finalize() {
        // handle failure
        if (!this.pathinfo) {
            //if (this.dbg) console.log("MovePlan failed: no path to target: " + this.state.v_target);
            return false;
        }
        //console.log(`move target: ${this.target} pathinfo: ${Fmt.ofmt(this.pathinfo)}`);
        // handle success
        //this.state.v_target = undefined;
        let effects = [
            (state) => {
                state.a_pos = this.target;
            },
        ];
        return {
            effects: effects,
            utility: 1,
            cost: this.pathinfo.cost,
            processes: [
                new MoveProcess({actions: this.pathinfo.actions}),
            ]
        }
    }

}

class MoveProcess extends AiProcess {
    static maxCollisions = 3;
    constructor(spec={}) {
        super(spec);
        this.actions = spec.actions || [];
        this.currentCollisions = 0;
        this.ok = true;
    }

    prepare(actor) {
        // set actor's action queue to be the individual actions from movement process...
        actor.actions = this.actions.slice(0);
        this.actor = actor;
        return true;
    }

    update(ctx) {
        if (this.actions.length === 0) return true;
        if (this.actor.collisionIds) {
            this.currentCollisions++;
            let target = Base.instance.entities.get(this.actor.collisionIds[0]);
            //console.log(`actor colliding with: ${this.actor.collisionIds} |${target}| ${this.currentCollisions}`);
            if (this.currentCollisions > MoveProcess.maxCollisions) {
                //console.log(`actor ${this.actor} failing movement, too many concurrent collisions`);
                //this.actor.currentAction.ok = false;
                this.actor.currentAction = undefined;
                this.actor.actions = [];
                this.actor.speed = 0;
                this.ok = false;
                return true;
            }
        } else {
            this.currentCollisions = 0;
        }
        // wait for actions to be completed
        let lastAction = this.actions[this.actions.length-1];
        return lastAction.done;
    }

    finalize() {
        // FIXME: in here is where we would put logic to handle movement failures... 
        // -- e.g.: if the actor gets stuck somewhere, we should be able to detect it... 
        // -- detection would be done in process.  could use a timer for each step.  if not completed in time, assume that the actor is stuck and fail the overall AI action...
        return this.ok;
    }
}
