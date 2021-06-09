export { Animation };
import { Sketch } from './sketch.js';
import { Sprite } from './sprite.js';
import { Fmt } from "./fmt.js";
import { Generator } from './generator.js';

/** ========================================================================
 * A single cel of an animation.
 */
class Cel {
    static dfltTTL = 100;
    constructor(spec={}) {
        this.sketch = (spec.xsketch) ? Generator.generate(spec.xsketch) : Sketch.zero;
        this.ttl = spec.ttl || Cel.dfltTTL;
    }

    toString() {
        return Fmt.toString(this.constructor.name, this.ttl, this.sketch);
    }
}

/** ========================================================================
 * An animation is a sketch used to render a series of animation cels (sketches).
 */
class Animation extends Sprite {

    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        super(spec);
        this.loop = (spec.hasOwnProperty("loop")) ? spec.loop : true;
        let cels = spec.cels || [{}];
        this.cels = cels.map((v) => new Cel(v));
        this.cidx = 0;
        if (this._width === 0) this._width = this.cel.sketch.width;
        if (this._height === 0) this._height = this.cel.sketch.height;
        this.elapsed = 0;
        this._done = false;
        this.step = false;
    }

    // PROPERTIES ----------------------------------------------------------
    get done() {
        return this._done;
    }

    get cel() {
        return this.cels[this.cidx];
    }

    get sketch() {
        if (this.cels.length) {
            return this.cels[this.cidx].sketch;
        }
        return Sketch.zero;
    }

    get animIdx() {
        return this.cidx;
    }

    // METHODS -------------------------------------------------------------
    reset() {
        this.cidx = 0;
        this.elapsed = 0;
        this._done = false;
        this.step = false;
    }

    advance() {
        this.cidx++;
        if (this.cidx >= this.cels.length) {
            if (this.loop) {
                this.cidx = 0;
                //console.log("looping");
            } else {
                this._done = true;
                this.cidx = this.cels.length-1;
            }
        }
    }

    _render(renderCtx, x=0, y=0) {
        this.sketch.render(renderCtx, x, y);
    }

    /**
     * Update animation state
     * @param {*} ctx 
     */
    iupdate(ctx) {
        if (this.done) return;
        if (this.step) {
            if (this.step === "next") this.advance();
            if (this.step === "prev" && this.cidx > 0) this.cidx--;
            this.step = (this.done) ? false : true;
            return;
        }
        this.elapsed += ctx.deltaTime;
        while (!this.done && this.elapsed > this.cel.ttl) {
            this.elapsed -= this.cel.ttl;
            this.advance();
            this.updated = true;
        }
        return this.updated;
    }

}