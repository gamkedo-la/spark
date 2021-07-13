export { SyncAnimation };

import { Animation } from './animation.js';

/** ========================================================================
 * An animation is a sketch used to render a series of animation cels (sketches).
 */
class SyncAnimation extends Animation {

    // STATIC VARIABLES ----------------------------------------------------
    static syncStates = {};

    // STATIC METHODS ------------------------------------------------------
    static getSyncState(tag) {
        let state = this.syncStates[tag];
        if (!state) {
            state = {
                cidx: 0,
                elapsed: 0,
                frame: 0,
                advance: false,
            }
            this.syncStates[tag] = state;
        }
        return state;
    }

    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        super(spec);
        this.syncTag = spec.syncTag || "sync";
    }

    // PROPERTIES ----------------------------------------------------------
    get animIdx() {
        let state = SyncAnimation.getSyncState(this.syncTag);
        return state.cidx;
    }

    get cel() {
        let state = SyncAnimation.getSyncState(this.syncTag);
        return this.cels[state.cidx];
    }

    get sketch() {
        if (this.cels.length) {
            let state = SyncAnimation.getSyncState(this.syncTag);
            return this.cels[state.cidx].sketch;
        }
        return Sketch.zero;
    }

    // METHODS -------------------------------------------------------------
    advance(state) {
        state.cidx++;
        if (state.cidx >= this.cels.length) {
            if (this.loop) {
                state.cidx = 0;
            } else {
                this._done = true;
                state.cidx = this.cels.length-1;
            }
        }
    }

    previous(state) {
        state.cidx--;
        if (state.cidx < 0) state.cidx = this.cels.length-1;
    }

    /**
     * Update animation state
     * @param {*} ctx 
     */
    iupdate(ctx) {
        if (this.done) return false;
        let state = SyncAnimation.getSyncState(this.syncTag);
        let newFrame = (ctx.frame !== state.frame);
        //console.log(`ctx frame: ${ctx.frame}`);
        if (this.step) {
            if (this.step === "next") this.advance(state);
            if (this.step === "prev") this.previous(state);
            this.step = (this.done) ? false : true;
            return false;
        }
        if (newFrame) {
            state.frame = ctx.frame;
            state.elapsed += ctx.deltaTime;
            //console.log(`elapsed: ${state.elapsed}`);
            while (!this.done && state.elapsed > this.cel.ttl) {
                state.elapsed -= this.cel.ttl;
                state.advance = true;
                this.advance(state);
                this.updated = true;
            }
        } else {
            if (state.advance) this.updated = true;
        }
        //console.log("animation.iupdate updated: " + this.updated);
        return this.updated;
    }

}