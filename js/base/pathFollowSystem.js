export { PathFollowSystem };

import { SetSpeedHeadingFeat } from "./ctrlSystem.js";
import { SetPosFeat } from "./moveSystem.js";
import { System }       from "./system.js";
import { Vect } from "./vect.js";


/** ========================================================================
 * PathFollowSystem - manages entities that are following pathfinding paths
 * - path
 * - heading
 * - speed
 */
class PathFollowSystem extends System {
    cpre(spec) {
        super.cpre(spec);
        spec.iterateTTL = spec.iterateTTL || 0;
    }
    cpost(spec) {
        super.cpost(spec);
        this.gain = spec.gain || .01;
        this.decay = spec.decay || .01;
        this.waypointRange = spec.waypointRange || 5;
        this.dbg = spec.dbg;
    }

    // METHODS -------------------------------------------------------------
    iterate(ctx, e) {
        // only match entities that have path
        if (!e.path) return;
        let dt = ctx.deltaTime;

        // distance to next waypoint
        let waypoint = e.path[0];
        //console.log("waypoint: " + waypoint);
        let wdist = Vect.dist(e, waypoint);
        if (wdist < this.waypointRange) {
            // FIXME: feats?
            let lastWay = waypoint;
            waypoint = e.path.shift();
            if (e.path.length) {
                if (this.dbg) console.log(`${e} arrived at waypoint: ${lastWay}`);
                this.feats.push(new SetPosFeat(e, lastWay.x, lastWay.y));
            } else {
                e.path = undefined;
                if (this.dbg) console.log(`${e} arrived at target: ${waypoint}`);
                this.feats.push(new SetPosFeat(e, lastWay.x, lastWay.y));
                this.feats.push(new SetSpeedHeadingFeat(e, 0, e.heading));
                return;
            }
        }

        // calculate heading/speed to next waypoint
        let v = (new Vect(waypoint)).sub(e);
        let heading = v.heading(true);
        let speed = 1;
        if (e.heading !== heading || e.speed !== speed) {
            this.feats.push(new SetSpeedHeadingFeat(e, speed, heading));
            //console.log(`e: ${e} v: ${v} speed: ${speed} heading: ${heading}`);
        }

        /*
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
        let heading = (speed === 0) ? this.dfltHeading : v.heading(true);
        if (e.heading !== heading || e.speed !== speed) {
            this.feats.push(new SetSpeedHeadingFeat(e, speed, heading));
            //console.log(`e: ${e} v: ${v} speed: ${speed} heading: ${heading}`);
        }
        */
    }

}