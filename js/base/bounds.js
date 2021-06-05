export { Bounds };

import { Vect } from "./vect.js";
import { Fmt } from "./fmt.js";
import { Util } from "./util.js";
import { ColliderSet } from "./collider.js";

// =========================================================================
class Bounds {
    // STATIC METHODS ------------------------------------------------------
    static hasBounds(obj) {
        return obj && 
               obj.minx !== undefined &&
               obj.maxx !== undefined &&
               obj.miny !== undefined &&
               obj.maxy !== undefined;
    }

    static _overlaps(obj1, obj2, overlap=true) {
        if (!this.hasBounds(obj1) || !this.hasBounds(obj2)) return false;
        let xoverlap = (obj1.minx >= obj2.minx && obj1.minx < obj2.maxx) ||
            (obj1.maxx > obj2.minx && obj1.maxx <= obj2.maxx) ||
            (obj2.minx >= obj1.minx && obj2.minx < obj1.maxx) || 
            (obj2.maxx > obj1.minx && obj2.maxx <= obj1.maxx);
        let yoverlap =
            (obj1.miny >= obj2.miny && obj1.miny < obj2.maxy) ||
            (obj1.maxy > obj2.miny && obj1.maxy <= obj2.maxy) ||
            (obj2.miny >= obj1.miny && obj2.miny < obj1.maxy) || 
            (obj2.maxy > obj1.miny && obj2.maxy <= obj1.maxy);
        if (xoverlap && yoverlap) {
            if (overlap) {
                let minX = Math.max(obj1.minx, obj2.minx);
                let maxX = Math.min(obj1.maxx, obj2.maxx);
                let minY = Math.max(obj1.miny, obj2.miny);
                let maxY = Math.min(obj1.maxy, obj2.maxy);
                let width = maxX-minX;
                let height = maxY-minY;
                return new Bounds(minX, minY, width, height);
            } else {
                return true;
            }
        }
        return xoverlap && yoverlap;
    }

    static overlaps(obj1, obj2, overlap=true) {
        let rslt;
        if (obj1 instanceof(ColliderSet)) {
            for (const o1 of obj1) {
                if (obj2 instanceof(ColliderSet)) {
                    for (const o2 of obj2) {
                        if (overlap) {
                            rslt = Bounds.newOrExtend(rslt, this._overlaps(o1, o2, true));
                        } else {
                            if (this._overlaps(o1, o2, false)) return true;
                        }
                    }
                } else {
                    if (overlap) {
                        rslt = Bounds.newOrExtend(rslt, this._overlaps(o1, obj2, true));
                    } else {
                        if (this._overlaps(o1, obj2, false)) return true;
                    }
                }
            }
        } else if (obj2 instanceof(ColliderSet)) {
            for (const o2 of obj2) {
                if (overlap) {
                    rslt = Bounds.newOrExtend(rslt, this._overlaps(obj1, o2, true));
                } else {
                    if (this._overlaps(obj1, o2, false)) return true;
                }
            }
        } else {
            return this._overlaps(obj1, obj2, overlap);
        }
        return rslt;
    }

    static contains(obj, other) {
        if (!this.hasBounds(obj) || !other) return false;
        return other.x >= obj.minx && other.x <= obj.maxx &&
               other.y >= obj.miny && other.y <= obj.maxy;
    }

    static containsXY(obj, x, y) {
        if (!this.hasBounds(obj)) return false;
        return x >= obj.minx && x <= obj.maxx &&
               y >= obj.miny && y <= obj.maxy;
    }

    // CONSTRUCTOR ---------------------------------------------------------
    /**
     * create a new bounds
     * @param {*} x - x position of minimum point within bounds
     * @param {*} y - y position of minimum point within bounds
     * @param {*} width - width in pixels
     * @param {*} height - height in pixels
     */
    constructor(x, y, width, height) {
        // the local position (minimum)
        this.x = x;
        this.y = y;
        // the size contraints (width/height)
        this.width = width;
        this.height = height;
    }

    // STATIC PROPERTIES ---------------------------------------------------
    static get zero() {
        return new Bounds(0, 0, 0, 0);
    }

    // PROPERTIES ----------------------------------------------------------
    get pos() {
        return new Vect(this.x, this.y);
    }

    get minx() {
        return this.x;
    }
    get miny() {
        return this.y;
    }
    get min() {
        return new Vect(this.x, this.y);
    }

    get maxx() {
        return this.x + this.width;
    }
    get maxy() {
        return this.y + this.height;
    }
    get max() {
        return new Vect(this.x + this.width, this.y + this.height);
    }

    get midx() {
        return this.x + (this.width * .5);
    }
    get midy() {
        return this.y + (this.height * .5);
    }
    get mid() {
        return new Vect(this.x + (this.width * .5), this.y + (this.height * .5));
    }

    // STATIC FUNCTIONS ----------------------------------------------------
    static newOrExtend(ob, nb) {
        if (!ob) return nb;
        ob.extend(nb);
        return ob;
    }

    // METHODS -------------------------------------------------------------
    /**
     * make a copy of the current bounds and return
     */
    copy() {
        return new Bounds(this.x, this.y, this.width, this.height);
    }

    /**
     * determine if the given position (in world space) is within the current bounds
     * @param {Vect} pos - position to check
     */
    contains(pos) {
        return pos.x >= this.minx && pos.x <= this.maxx &&
               pos.y >= this.miny && pos.y <= this.maxy;
    }

    /**
     * determine if the given position (in world space) is within the current bounds
     */
    containsXY(x, y) {
        return x >= this.minx && x <= this.maxx &&
               y >= this.miny && y <= this.maxy;
    }

    /**
     * determine if given bounds overlaps current bounds
     * @param {Bounds} other - other bounds to evaluate
     */
    overlaps(other) {
        return Bounds.overlaps(this, other);
    }

    /**
     * Extend the current bounds to include the extend of given bounds
     * @param {*} other 
     */
    extend(other) {
        if (!other) return this;
        if (other.minx < this.minx) {
            let delta = this.minx - other.minx;
            this.width += delta;
            this.x = other.minx;
        }
        if (other.maxx > this.maxx) {
            let delta = other.maxx - this.maxx;
            this.width += delta;
        }
        if (other.miny < this.miny) {
            let delta = this.miny - other.miny;
            this.height += delta;
            this.y = other.minx;
        }
        if (other.maxy > this.maxy) {
            let delta = other.maxy - this.maxy;
            this.height += delta;
        }
        return this;
    }

    toString() {
        return Fmt.toString("Bounds", this.minx, this.miny, this.maxx, this.maxy, this.width, this.height);
    }
}
