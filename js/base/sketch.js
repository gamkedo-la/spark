export { Sketch };

import { Fmt } from "./fmt.js";
import { EvtChannel } from "./event.js";
import { Generator } from "./generator.js";
import { Stats } from "./stats.js";

/**
 * A sketch is the base abstract data object that represents something that can be drawn to the screen... 
 * -- an image (sprite)
 * -- an animation
 * -- simple js primitives for drawing
 * -- a particle
 */
class Sketch {
    // STATIC PROPERTIES ---------------------------------------------------
    static get zero() {
        return new Sketch();
    }

    // STATIC METHODS ------------------------------------------------------
    static link(sketch, parent, tag, cb) {
        if (parent[tag]) Sketch.unlink(parent[tag], parent, tag, cb);
        if (sketch) {
            sketch.parent = parent;
            sketch.evtUpdated.listen(cb);
        }
        parent[tag] = sketch;
        return sketch;
    }

    static unlink(sketch, parent, tag, cb) {
        if (sketch) {
            sketch.evtUpdated.ignore(cb);
            sketch.parent = undefined;
        }
        parent[tag] = undefined;
    }

    // CONSTRUCTOR ---------------------------------------------------------
    /**
     * create a new sketch
     */
    constructor(spec={}) {
        this.parent = spec.parent;
        this.tag = spec.tag || "tag";
        this._width = spec.width || 0;
        this._height = spec.height || 0;
        this.lockRatio = spec.lockRatio || false;
        let gen = spec.gen || Generator.instance;
        this.fitter = (spec.xfitter) ? gen.generate(Object.assign({target: this}, spec.xfitter)) : undefined;
        this.cfWidth = this.cfHeight = this.cfX = this.cfY = 0;
        this.updated = false;
        // event channels
        this.__evtUpdated = new EvtChannel("updated", {actor: this});
    }

    // PROPERTIES ----------------------------------------------------------
    get ratio() {
        return (this._height) ? (this._width/this._height) : 1;
    }

    get width() {
        if (this.fitter) {
            // if ratio is locked, adjust based on current ratio and fitter...
            if (this.lockRatio) return this.cfWidth;
            return this.fitter.width;
        }
        return this._width;
    }

    get height() {
        if (this.fitter) {
            // if ratio is locked, adjust based on current ratio and fitter...
            if (this.lockRatio) return this.cfHeight;
            return this.fitter.height;
        }
        return this._height;
    }

    get minx() {
        if (this.fitter) {
            if (this.lockRatio) return this.cfX;
            return this.fitter.x;
        }
        return 0;
    }
    get miny() {
        if (this.fitter) {
            if (this.lockRatio) return this.cfY;
            return this.fitter.y;
        }
        return 0;
    }

    get animIdx() {
        return 0;
    }

    get done() {
        return true;
    }

    // EVENTS --------------------------------------------------------------
    get evtUpdated() { return this.__evtUpdated; }

    // METHODS -------------------------------------------------------------
    /**
     * A sketch can be updated...
     * @param {*} ctx 
     */
    update(ctx) {
        if (this.fitter && this.lockRatio) {
            if (this.fitter.width != this.lastFitterWidth || this.fitter.height != this.lastFitterHeight ||
                this.fitter.x != this.lastFitterX || this.fitter.y != this.lastFitterY) {
                this.lastFitterWidth = this.fitter.width;
                this.lastFitterHeight = this.fitter.height;
                this.lastFitterX = this.fitter.x;
                this.lastFitterY = this.fitter.y;
                let dw = this.fitter.width;
                let dh = this.fitter.height;
                //console.log(`w: ${this._width} h: ${this._height} fw: ${this.fitter.width} fh: ${this.fitter.height}`);
                if ((this._width / dw) < (this._height / dh)) {
                    dw = dh * this.ratio;
                } else {
                    dh = dw / this.ratio;
                }
                this.cfWidth = dw;
                this.cfHeight = dh;
                this.cfX = this.fitter.x + (this.fitter.width-dw )* .5;
                this.cfY = this.fitter.y + (this.fitter.height-dh) * .5;
                this.evtUpdated.trigger();
                this.updated = true;
            }
        }
        // handle internal updates
        let v = this.iupdate(ctx);
        this.updated |= v;
        //if (this.tag === "fairy") console.log("sketch updated: " + v);
        // trigger update event if needed
        if (this.updated) {
            this.evtUpdated.trigger();
        }
        // handle 
        let updated = this.updated;
        this.updated = false;
        return updated;
    }

    iupdate(ctx) {
        return false;
    }

    /**
     * A sketch can be reset...
     */
    reset() {
    }

    /**
     * A sketch can be rendered...
     * @param {canvasContext} renderCtx - canvas context on which to draw
     */
    render(renderCtx, x=0, y=0) {
        Stats.count("render");
        //if (this.constructor.name === "Animator") console.log("upper render x: " + x + " y: " + y);
        // local adjustments based on fitter
        x += this.minx;
        y += this.miny;
        // sketch-specific render
        this._render(renderCtx, x, y);
    }

    _render(renderCtx, x=0, y=0) {
    }

    /**
     * convert to string
     */
    toString() {
        return Fmt.toString(this.constructor.name, this.tag, this.size);
    }

}