export { Action, MoveToAction, OpenAction, DummyAction };

import { Fmt }              from "./fmt.js";
import { ModelState } from "./modelState.js";
import { Vect } from "./vect.js";

class Action {
    constructor(spec={}) {
        this.dbg = spec.dbg;
        this.done = false;
        this.ok = true;
        this.info = spec.info || "action";
    }
    start(actor) {
    }
    update(ctx) {
        return true;
    }

    toString() {
        return Fmt.toString(this.constructor.name, this.info, this.done);
    }
}

class MoveToAction extends Action {
    static dfltRange = 5;
    constructor(spec={}) {
        super();
        this.x = spec.x || 0;
        this.y = spec.y || 0;
        this.range = spec.range || MoveToAction.dfltRange;
        this.snap = spec.hasOwnProperty("snap") ? spec.snap : false;
        this.pos = new Vect(this.x,this.y);
    }

    start(actor) {
        this.actor = actor;
    }

    update(ctx) {
        // distance to target
        let dist = Vect.dist(this.actor, this.pos);
        // within range of target
        if (dist < this.range) {
            if (this.dbg) console.log(`${this.actor} arrived at target: ${this.pos}`);
            this.done = true;
            this.actor.speed = 0;
            if (this.snap) {
                this.actor.x = this.x;
                this.actor.y = this.y;
            }
        // move towards target
        } else {
            // calculate heading/speed from actor to target
            let v = (new Vect(this.pos)).sub(this.actor);
            let heading = v.heading(true);
            let speed = 1;
            if (this.actor.heading !== heading || this.actor.speed !== speed) {
                this.actor.heading = heading;
                //console.log("action set heading: " + this.actor.heading);
                this.actor.speed = speed;
            }
        }
        return this.done;
    }

    toString() {
        return Fmt.toString(this.constructor.name, this.x, this.y);
    }
}

class DummyAction extends Action {
    start(actor) {
        this.done = true;
    }
}

class OpenAction extends Action {
    constructor(spec={}) {
        super(spec);
        this.target = spec.target;
    }

    start(actor) {
        this.actor = actor;
        this.target.open();
    }

    update(ctx) {
        if (this.target.state === ModelState.open) {
            this.done = true;
        }
        return this.done;
    }

    toString() {
        return Fmt.toString(this.constructor.name, this.target);
    }
}
