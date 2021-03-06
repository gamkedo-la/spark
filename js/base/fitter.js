export { Fitter, FitToParent };

import { Fmt } from "./fmt.js";

class Fitter {
    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        this.top = spec.top || 0;
        this.bottom = spec.bottom || 0;
        this.left = spec.left || 0;
        this.right = spec.right || 0;
        if (spec.border) {
            this.left = this.right = this.top = this.bottom = spec.border;
        }
        // the target object whose size is being adjusted by the fitter
        this.target = spec.target || {};
        // the reference object (if any) whose size is being used as a reference
        this._ref = spec.ref || { width: 0, height: 0 };
    }

    // PROPERTIES ----------------------------------------------------------
    get ref() {
        return this._ref;
    }

    get x() {
        return this.rwidth * this.left;
    }

    get y() {
        return this.rheight * this.top;
    }

    get width() {
        if (this.ref.xform) {
            return this.ref.xform.width * (1-(this.left+this.right));
        }
        return this.ref.width * (1-(this.left+this.right));
    }

    get height() {
        if (this.ref.xform) {
            return this.ref.xform.height * (1-(this.top+this.bottom));
        }
        return this.ref.height * (1-(this.top+this.bottom));
    }

    get rheight() {
        if (this.ref.xform) {
            return this.ref.xform.height;
        }
        return this.ref.height;
    }

    get rwidth() {
        if (this.ref.xform) {
            return this.ref.xform.width;
        }
        return this.ref.width;
    }

    // METHODS -------------------------------------------------------------
    toString() {
        return Fmt.ofmt(this, this.constructor.name);
    }

}

class FitToParent extends Fitter {
    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        super(spec);
    }

    // PROPERTIES ----------------------------------------------------------
    get ref() {
        if (this.target && this.target.parent) return this.target.parent;
        return super.ref;
    }

}