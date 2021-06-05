export { CtrlMgr };

import { Gizmo }            from "./gizmo.js";

/** ========================================================================
 * Controllers are the basic building blocks of game state.
 * Control management manages those controllers, identifying the active controller (only one controller is active at a time).
 */
class CtrlMgr extends Gizmo {

    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        spec.cat = "Mgr";
        super(spec);
    }
    cpost(spec) {
        // the controller stack (non-active controllers)
        this.stack = [];
        // the current controller
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
    // replace current controller w/ new controller
    replace(ctrl) {
        let old = this._current;
        console.log("old: " + old);
        this._current = ctrl;
        if (old && old.destroy) old.destroy();
    }

    push(ctrl) {
        this.stack.unshift(this._current);
        this._current = ctrl;
    }

    // pop last controller from stack and assign as current controller
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

}