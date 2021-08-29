export { Camera };

import { Bounds }           from "./bounds.js";
import { Config }           from "./config.js";
import { Mathf } from "./math.js";
import { Util }             from "./util.js";
import { UxCanvas }         from "./uxCanvas.js";
import { Vect } from "./vect.js";


// =========================================================================
class Camera {
    // STATIC VARIABLES ----------------------------------------------------
    static _main;

    // STATIC PROPERTIES ---------------------------------------------------
    static get main() {
        if (!this._main) this._main = new this();
        return this._main;
    }

    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        // viewport dimensions
        if (spec.hasOwnProperty("width") && spec.hasOwnProperty("height")) {
            this.width = spec.width;
            this.height = spec.height;
        } else {
            let canvas = UxCanvas.getCanvas();
            this.width = canvas.width;
            this.height = canvas.height;
        }
        this.renderScale = spec.renderScale || Config.renderScale;
        this.halfWidth = this.width * .5;
        this.halfHeight = this.height * .5;
        // deltas for borders around game level in which the camera will not pan
        this.dx = spec.dx || 150;
        this.dy = spec.dy || 150;
        // current offset of camera
        this._x = 0;
        this._y = 0;
        // pan params
        this.panSpeed = 0;
        this.panMaxSpeed = spec.panMaxSpeed || .5;
        this.panAccel = spec.panAccel || this.panMaxSpeed/1000;
        this.panTarget = undefined;
        this.panReached = false;
        // camera can follow a target
        this.target = undefined;
        this.dbg = spec.dbg || false;
        // camera references world boundaries...
        this.getWorldMaxX = spec.getWorldMaxX || (() => this.width);
        this.getWorldMaxY = spec.getWorldMaxY || (() => this.height);
        Util.bind(this, "onTargetUpdate");
    }

    // PROPERTIES ----------------------------------------------------------
    get minx() {
        return this._x;
    }
    get miny() {
        return this._y;
    }

    // center of viewport
    get x() {
        return this._x + this.halfWidth;
    }
    get y() {
        return this._y + this.halfHeight;
    }

    get maxx() {
        return this._x + this.width;
    }
    get maxy() {
        return this._y + this.height;
    }

    // EVENT HANDLERS ------------------------------------------------------
    onTargetUpdate(evt) {
        if (!this.panTarget) {
            this.updateTrack()
        }
    }

    // METHODS -------------------------------------------------------------
    update(ctx) {
        if (this.panTarget) {
            this.updatePan(ctx);
        }
    }

    trackTarget(target) {
        // if currently have a target...
        if (this.target) {
            this.target.evtUpdated.ignore(this.onTargetUpdate);
        }
        this.target = target;
        this.target.evtUpdated.listen(this.onTargetUpdate);
        this.updateTrack();
        this.center();
    }

    trackWorld(world) {
        this.getWorldMaxX = () => world.maxx-world.minx;
        this.getWorldMaxY = () => world.maxy-world.miny;
    }

    updatePan(ctx) {
        // the pan target position
        let px = (this.panTarget.x * this.renderScale) - this.halfWidth;
        let py = (this.panTarget.y * this.renderScale) - this.halfHeight;
        let dt = ctx.deltaTime;
        // delta position values in x,y
        let dx = px-this._x;
        let dy = py-this._y;
        // computed distance to pan trget
        let distance = Mathf.distance(px, py, this._x, this._y);
        if (distance > 10) {
            let angle = Math.atan2(dy,dx);
            let cosangle = Math.cos(angle);
            let sinangle = Math.sin(angle);
            let decelDistance = (this.panSpeed * this.panSpeed) / (2 * this.panAccel);
            //we are still far, continue accelerating (if possible)
            if (distance > decelDistance) {
                this.panSpeed = Math.min(this.panSpeed + this.panAccel * dt, this.panMaxSpeed);
            //we are about to reach the target, let's start decelerating.
            } else {
                this.panSpeed = Math.max(this.panSpeed - this.panAccel * dt, 0);
            }
            this._x += (this.panSpeed * cosangle * dt);
            this._y += (this.panSpeed * sinangle * dt);
        // magic close enough... jump to final position
        } else {
            this._x = px;
            this._y = py;
            this.panReached = true;
        }
    }


    updateTrack() {
        // calculate current x,y
        if (!this.target) return;
        // world max x/y
        let wmaxx = this.getWorldMaxX() * this.renderScale;
        let wmaxy = this.getWorldMaxY() * this.renderScale;
        // target min/max x/y
        let tx = this.target.x * this.renderScale;
        let ty = this.target.y * this.renderScale;
        // left of pan area
        if (tx < (this._x + this.dx) && tx >= this.dx) {
            this._x = tx - this.dx;
            if (this.dbg) console.log("pan left - tx: " + tx + " wmaxx: " + wmaxx + " newx: " + this._x);
        }
        // right of pan area
        if (tx > (this._x + this.width - this.dx)) {
            if (tx <= wmaxx-this.dx) {
                this._x = tx - (this.width - this.dx);
            } else {
                this._x = wmaxx - this.width;
            }
            if (this.dbg) console.log("pan right - tx: " + tx + " wmaxx: " + wmaxx + " newx: " + this._x);
        }
        // above pan area
        if (ty < (this._y + this.dy) && ty >= this.dy) {
            this._y = ty - this.dy;
            if (this.dbg) console.log("pan up - ty: " + ty + " wmaxy: " + wmaxy + " newy: " + this._y);
        }
        // below pan area
        if (ty > (this._y + this.height - this.dy)) {
            //console.log(`ty: ${ty} _y: ${this._y} height: ${this.height} dy: ${this.dy} wmaxy: ${wmaxy}`);
            if (ty <= wmaxy-this.dy) {
                this._y = ty - (this.height - this.dy);
            } else {
                this._y = wmaxy - this.height;
            }
            if (this.dbg) console.log("pan down - ty: " + ty + " wmaxy: " + wmaxy + " newy: " + this._y);
        }
    }

    contains(obj) {
        return Bounds.contains(this, obj);
    }

    containsXY(x, y) {
        return Bounds.containsXY(this, x, y);
    }

    overlaps(obj) {
        return Bounds.overlaps(this, obj, false);
    }

    reset() {
        this._x = 0;
        this._y = 0;
    }

    // center at current target
    center() {
        if (this.target) {
            let tx = this.target.x * this.renderScale;
            let ty = this.target.y * this.renderScale;
            this._x = tx - this.halfWidth;
            this._y = ty - this.halfHeight;
        }
    }

    startPan(target) {
        this.panTarget = target;
        this.panReached = false;
    }

    stopPan() {
        this.panTarget = undefined;
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
        this.halfWidth = this.width * .5;
        this.halfHeight = this.height * .5;
    }

}
