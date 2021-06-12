export { CtrlSystem, SetSpeedHeadingFeat };

import { System }       from "./system.js";
import { Feat }         from "./feat.js";
import { Bindings }     from "./bindings.js";
import { Vect }         from "./vect.js";
import { Mathf }        from "./math.js";
import { Condition } from "./condition.js";

class SetSpeedHeadingFeat extends Feat {
    constructor(target, speed, heading) {
        super();
        this.target = target;
        this.speed = speed;
        this.heading = heading;
    }

    execute() {
        if (this.target) {
            this.target.speed = this.speed;
            this.target.heading = this.heading;
            //console.log("setting feat heading: " + this.heading);
        }
    }
}

class CtrlSystem extends System {
    cpre(spec) {
        super.cpre(spec);
        spec.iterateTTL = spec.iterateTTL || 0;
    }
    cpost(spec) {
        super.cpost(spec);
        this.ctrlId = spec.ctrlId || 1;
        this.bindings = spec.bindings || Bindings.zero;
        this.gain = spec.gain || .01;
        this.decay = spec.decay || .01;
        this.dfltHeading = spec.hasOwnProperty("dfltHeading") ? spec.dfltHeading : Math.PI * .5;
    }

    // METHODS -------------------------------------------------------------
    iterate(ctx, e) {
        // only match to entities w/ same control id...
        if (e.ctrlId !== this.ctrlId) return;
        let dt = ctx.deltaTime;

        let wantCtrl = this.bindings.left || this.bindings.right || this.bindings.up || this.bindings.down;
        if (e.currentAction && !wantCtrl) return;

        // check for primary/secondary interactions...
        if (!e.interact) {
            e.interact = this.bindings.primary && !e.wantInteract && !e.wantSecondary;
            e.wantInteract = this.bindings.primary;
        }

        // check for conditions preventing movement
        if (e.conditions.has(Condition.seated) || e.conditions.has(Condition.asleep)) {
            e.speed = 0;
            return;
        }

        // calculate current x/y axis values
        let xaxis = Math.cos(e.heading) * e.speed;
        let yaxis = Math.sin(e.heading) * e.speed;

        if (this.bindings.left || this.bindings.right) {
            xaxis = Mathf.clamp(xaxis + (this.bindings.right - this.bindings.left) * dt * this.gain, -1, 1);
        } else {
            if (xaxis > 0) {
                xaxis = Math.max(0, xaxis - this.decay * dt);
            } else if (xaxis < 0) {
                xaxis = Math.min(0, xaxis + this.decay * dt);
            }
        }
        if (this.bindings.up || this.bindings.down) {
            yaxis = Mathf.clamp(yaxis + (this.bindings.down - this.bindings.up) * dt * this.gain, -1, 1);
        } else {
            if (yaxis > 0) {
                yaxis = Math.max(0, yaxis - this.decay * dt);
            } else if (yaxis < 0) {
                yaxis = Math.min(0, yaxis + this.decay * dt);
            }
        }

        // calculate new speed and heading
        let v = new Vect(Mathf.round(xaxis, 2), Mathf.round(yaxis,2));
        let speed = Math.min(v.mag, 1.0);
        //let heading = (speed === 0) ? this.dfltHeading : v.heading(true);
        let heading = (speed === 0) ? e.heading : v.heading(true);
        if (e.heading !== heading || e.speed !== speed) {
            //console.log("heading: " + heading);
            this.feats.push(new SetSpeedHeadingFeat(e, speed, heading));
            //console.log(`e: ${e} v: ${v} speed: ${speed} heading: ${heading}`);
        }
    }

}