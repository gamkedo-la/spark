export { StateMgr };

import { Gizmo }            from "./gizmo.js";

/** ========================================================================
 * The State class is the basic building block of game state.
 * The StateMgr class manages state instances, identifying the active state (only one state is active at a time).
 */
class StateMgr extends Gizmo {

    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        spec.cat = "Mgr";
        super(spec);
    }
    cpost(spec) {
        // the state stack (non-active states)
        this.stack = [];
        // the current state
        this._current;
    }

    // PROPERTIES ----------------------------------------------------------
    get current() {
        return this._current;
    }

    get last() {
        return (this.stack.length > 0) ? this.stack[0] : undefined;
    }

    // METHODS -------------------------------------------------------------
    // swap current state w/ new state
    swap(ctrl) {
        let old = this._current;
        this._current = ctrl;
        if (old && old.destroy) old.destroy();
    }

    push(ctrl) {
        this.stack.unshift(this._current);
        this._current = ctrl;
    }

    // pop last state from stack and assign as current state
    pop() {
        let old = this._current;
        if (this.stack.length > 0) {
            let ctrl = this.stack.shift();
            this._current = ctrl;
        } else {
            this._current = undefined;
        }
        if (old && old.destroy) old.destroy();
    }

    clear() {
        while (this._current) {
            this.pop();
        }
    }

    update(ctx) {
        // update pushed states first...
        for (let i=this.stack.length-1; i>=0; i--) {
            if (this.stack[i] && this.stack[i].active) this.stack[i].update(ctx);
        }
        if (this._current) this._current.update(ctx);
    }

    render() {
        // render pushed states first...
        for (let i=this.stack.length-1; i>=0; i--) {
            if (this.stack[i] && this.stack[i].visible) this.stack[i].render();
        }
        // render current state
        if (this._current) this._current.render();
    }

}
