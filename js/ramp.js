export { Ramp };

import { Generator }        from './base/generator.js';
import { Model }            from './base/model.js';

class Ramp extends Model {
    cpost(spec) {
        super.cpost(spec);
        // -- ramp direction, right means when char goes left to right the go up the ramp
        this.right = spec.hasOwnProperty("right") ? spec.right : true;
        // -- traverse is the amount of height adjust per horizontal traverse
        this.traverse = spec.traverse || 1;
        // -- activator
        if (spec.xactivator) {
            this.activator = Generator.generate(Object.assign({"cls": "Collider", x: this.x, y: this.y, blocking: false, nbcolor: "rgba(127,127,0,.4)"}, spec.xactivator));
        }
    }

    get minx() {
        if (this.activator && this.collider) {
            return Math.min(this.activator.minx, this.collider.minx);
        } else if (this.activator) {
            return this.activator.minx;
        } else if (this.collider) {
            return this.collider.minx;
        }
        return this._x;
    }
    get maxx() {
        if (this.activator && this.collider) {
            return Math.max(this.activator.maxx, this.collider.maxx);
        } else if (this.activator) {
            return this.activator.maxx;
        } else if (this.collider) {
            return this.collider.maxx;
        }
        return this._x;
    }
    get miny() {
        if (this.activator && this.collider) {
            return Math.min(this.activator.miny, this.collider.miny);
        } else if (this.activator) {
            return this.activator.miny;
        } else if (this.collider) {
            return this.collider.miny;
        }
        return this._y;
    }
    get maxy() {
        if (this.activator && this.collider) {
            return Math.max(this.activator.maxy, this.collider.maxy);
        } else if (this.activator) {
            return this.activator.maxy;
        } else if (this.collider) {
            return this.collider.maxy;
        }
        return this._y;
    }

    doactivate(actor, overlap) {
        // negative is up, positive down for y axis
        actor.ramp = (this.right) ? -this.traverse : this.traverse;
    }
}