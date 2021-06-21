export { Camera };

import { Bounds }           from "./bounds.js";
import { Config }           from "./config.js";
import { Util }             from "./util.js";
import { UxCanvas }         from "./uxCanvas.js";


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
        // camera can follow a target
        this.target = undefined;
        this.dbg = spec.dbg || false;
        // camera references world boundaries...
        this.getWorldMaxX = spec.getWorldMaxX || (() => this.width);
        this.getWorldMaxY = spec.getWorldMaxY || (() => this.height);
        Util.bind(this, "onTargetUpdate");
        console.log(`camera dim: ${this.width},${this.height}`);
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
        this.updateTrack()
    }

    // METHODS -------------------------------------------------------------
    trackTarget(target) {
        // if currently have a target...
        if (this.target) {
            this.target.evtUpdated.ignore(this.onTargetUpdate);
        }
        this.target = target;
        this.target.evtUpdated.listen(this.onTargetUpdate);
    }

    trackWorld(world) {
        this.getWorldMaxX = () => world.maxx-world.minx;
        this.getWorldMaxY = () => world.maxy-world.miny;
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

    resize(width, height) {
        this.width = width;
        this.height = height;
        this.halfWidth = this.width * .5;
        this.halfHeight = this.height * .5;
    }

}
