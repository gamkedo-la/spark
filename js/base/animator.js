export { Animator };

import { Direction } from "./dir.js";
import { Fmt } from "./fmt.js";
import { Generator } from "./generator.js";
import { ModelState } from "./modelState.js";
import { Sketch } from "./sketch.js";

/** ========================================================================
 * An animator is responsible for driving animations based on state passed through update
 */
class Animator extends Sketch {

    // PROPERTIES ----------------------------------------------------------
    get width() {
        if (this.anim) return this.anim.width;
        return 0;
    }
    get height() {
        if (this.anim) return this.anim.height;
        return 0;
    }
    get animIdx() {
        return this.anim.animIdx;
    }
    get done() {
        return this.anim.done;
    }

    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        super(spec);
        //console.log("spec: " + Fmt.ofmt(spec));
        // -- animations state mapping
        this.animations = spec.animations || {};
        // -- sketch cache
        this.sketches = {};
        this.state = ModelState.none;
        this.pendingState;
        // -- current animation
        this.anim = Sketch.zero;
    }

    // METHODS -------------------------------------------------------------
    getAnim(state) {
        // lookup sketch in cache
        let sketch = this.sketches[state];
        if (sketch) return sketch;
        // otherwise... generate new sketch based on state
        let spec = this.animations[state];
        //console.log("spec: " + Fmt.ofmt(spec));
        sketch = (spec) ? Generator.generate(spec) : undefined;
        //console.log("sketch: " + sketch);
        // cache sketch
        if (sketch) this.sketches[state] = sketch;
        return sketch;
    }

    getTransition(from, to) {
        // lookup sketch in cache
        let key = `${ModelState.toString(from)}:${ModelState.toString(to)}`;
        let tanim = this.getAnim(key);
        //console.log(`transition key: ${key} anim: ${tanim}`);
        return tanim;
    }

    iupdate(ctx) {
        // update the current animation state
        if (this.anim) {
            this.updated |= this.anim.update(ctx);
            //console.log("animator this.updated: " + this.updated);
        }

        // compare desired state to current state (pending or actual)
        let wantState = ctx.state || ModelState.idle;
        // hackety hack hack - treat enlightened walk state as normal walk state for animation
        if (wantState === ModelState.enlightenedWalk) wantState = ModelState.walk;
        if (ctx.facing) {
            let tag = `${ModelState.toString(wantState)}_${Direction.toString(ctx.facing)}`;
            //if (tag !== this.lastTag) {
                //console.log(`changed tag: ${tag} wantState: ${ModelState[tag]}`);
                //this.lastTag = tag;
            //}
            wantState = ModelState[tag];
        }
        let fromState = (this.pendingState) ? this.pendingState : this.state;
        //console.log(`from: ${fromState} want: ${wantState}`);
        // check for no state change
        if (wantState === fromState) {
            // if currently in transition/pending state, check for animation completion
            if (this.pendingState) {
                if (this.anim.done) {
                    this.anim = this.getAnim(this.pendingState);
                    //console.log(`Animator pending from: ${this.state} want: ${ModelState.toString(this.pendingState)} anim: ${this.anim}`);
                    this.pendingState = undefined;
                    this.state = this.pendingState;
                    this.updated = true;
                }
            }
            return this.updated;  
        }
        this.pendingState = undefined;
        // we have a new state transition...
        // -- check for animation for given state
        let anim = this.getAnim(wantState);
        //console.log(`Animator from: ${ModelState.toString(fromState)} want: ${ModelState.toString(wantState)} anim: ${anim}`);
        //if (anim) console.log(`animation ${anim} dim: ${anim.width},${anim.height}`);
        if (!anim) return this.updated;
        anim.reset();
        this.updated = true;
        // -- check for transition to a pending state...
        let trans = this.getTransition(fromState, wantState);
        //console.log("anim: " + anim + " trans: " + trans);
        // -- if we have a transition... start transition animation and set current state to pending
        let newState = wantState;
        if (trans) {
            this.anim = trans;
            this.anim.reset();
            newState = "x" + fromState + "." + wantState;
            this.pendingState = wantState;
            //console.log(`transition state is: ${newState} pending: ${this.pendingState} anim: ${this.anim}`);
        // -- otherwise, no transition, start state animation directly
        } else {
            this.anim = anim;
        }
        // assign state
        this.state = newState;
        return this.updated;
    }

    _render(ctx, x=0, y=0) {
        //console.log("this.anim: " + this.anim + " x: " + x + " y: " + y);
        if (this.anim) this.anim.render(ctx, x, y);
    }

    toString() {
        return Fmt.toString(this.constructor.name, this.state, Fmt.ofmt(this.animations));
    }

}