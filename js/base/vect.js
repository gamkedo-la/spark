export{ Vect };
import { Fmt } from "./fmt.js";

// =========================================================================
class Vect {
    // CONSTRUCTOR ---------------------------------------------------------
    constructor(xorv, y) {
        if (typeof xorv === "number") {
            this.x = xorv || 0;
            this.y = y || 0;
        } else {
            this.x = xorv.x || 0;
            this.y = xorv.y || 0;
        }
    }

    // STATIC PROPERTIES ---------------------------------------------------
    static get zero() {
        return new Vect(0,0);
    }

    static get maxValue() {
        return new Vect(Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER);
    }

    // PROPERTIES ----------------------------------------------------------
    get mag() {
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }
    set mag(v) {
        this.normalize().mult(v);
    }
    get sqmag() {
        return this.x*this.x + this.y*this.y;
    }

    // STATIC METHODS ------------------------------------------------------
    static add(v1, v2) {
        let r = v1.copy();
        return r.add(v2);
    }

    static sub(v1, v2) {
        let r = v1.copy();
        return r.sub(v2);
    }

    static mult(v1, n) {
        let r = v1.copy();
        return r.mult(n);
    }

    static div(v1, n) {
        let r = v1.copy();
        return r.div(n);
    }

    static dot(v1, v2) {
        return v1.dot(v2);
    }

    static dist(v1, v2) {
        let r = new Vect(v1);
        return r.dist(v2);
    }

    static min(v1, v2) {
        let r = v1.copy();
        return r.min(v2);
    }

    static max(v1, v2) {
        let r = v1.copy();
        return r.max(v2);
    }

    static equals(v1, v2) {
        if (!v1 && !v2) return true;
        if (v1 && !v1 || !v1 && v2) return false;
        let r = new Vect(v1);
        return r.equals(v2);
    }

    // METHODS -------------------------------------------------------------
    copy() {
        return new Vect(this.x, this.y);
    }

    set(xorv, y) {
        if (typeof xorv === "number") {
            this.x = xorv;
            this.y = (typeof y === "number") ? y : xorv;
        } else {
            this.x = xorv.x || 0;
            this.y = xorv.y || 0;
        }
        return this;
    }

    add(xorv, y) {
        if (typeof xorv === "number") {
            this.x += xorv;
            this.y += (typeof y === "number") ? y : xorv;
        } else {
            this.x += xorv.x || 0;
            this.y += xorv.y || 0;
        }
        return this;
    }

    sub(xorv, y) {
        if (typeof xorv === "number") {
            this.x -= xorv;
            this.y -= (typeof y === "number") ? y : xorv;
        } else {
            this.x -= xorv.x || 0;
            this.y -= xorv.y || 0;
        }
        return this;
    }

    mult(xorv, y) {
        if (typeof xorv === "number") {
            this.x *= xorv;
            this.y *= (typeof y === "number") ? y : xorv;
        } else {
            this.x *= xorv.x || 0;
            this.y *= xorv.y || 0;
        }
        return this;
    }

    div(xorv, y) {
        if (typeof xorv === "number") {
            this.x /= xorv;
            this.y /= (typeof y === "number") ? y : xorv;
        } else {
            this.x /= xorv.x || 0;
            this.y /= xorv.y || 0;
        }
        return this;
    }

    dot(xorv, y) {
        if (typeof xorv === "number") {
            return this.x * (xorv || 0) + this.y * (y || 0);
        } else {
            return this.x * (xorv.x || 0) + this.y * (xorv.y || 0);
        }
    }

    dist(xorv, y) {
        let dx, dy;
        if (typeof xorv === "number") {
            dx = (xorv||0)-this.x;
            dy = (y||0)-this.y;
        } else {
            dx = (xorv.x||0)-this.x;
            dy = (xorv.y||0)-this.y;
        }
        return Math.sqrt(dx*dx + dy*dy);
    }

    normalize() {
        let m = this.mag;
        if (m != 0) this.div(m);
        return this;
    }

    heading(rad=false) {
        let a = Math.atan2(this.y, this.x);
        if (rad) return a;
        return a*180/Math.PI;
    }

    rotate(angle, rad=false) {
        let ra = (rad) ? angle : angle*Math.PI/180;
        ra += this.heading(true);
        let m = this.mag;
        this.x = Math.cos(ra) * m;
        this.y = Math.sin(ra) * m;
        return this;
    }

    angle(xorv, y, rad=false) {
        let x2, y2;
        if (typeof xorv === "number") {
            x2 = (xorv||0);
            y2 = (y||0);
        } else {
            x2 = xorv.x || 0;
            y2 = xorv.y || 0;
        }
        let a1 = Math.atan2(this.y, this.x);
        let a2 = Math.atan2(y2, x2);
        let angle = a2-a1;
        // handle angles > 180
        if (Math.abs(angle) > Math.PI) {
            angle = (angle>0) ? -(angle-Math.PI) : -(angle+Math.PI);
        }
        if (rad) return angle;
        return angle*180/Math.PI;
    }

    equals(xorv,y) {
        if (typeof xorv === "number") {
            return this.x == xorv && this.y == y;
        }
        return this.x == xorv.x && this.y == xorv.y;
    }

    limit(max) {
        if (this.sqmag > max*max) {
            this.mag = max;
        }
        return this;
    }

    min(xorv, y) {
        if (typeof xorv === "number") {
            this.x = Math.min(this.x, xorv);
            this.y = Math.min(this.y, (typeof y === "number") ? y : xorv);
        } else {
            this.x = Math.min(this.x, xorv.x);
            this.y = Math.min(this.y, xorv.y);
        }
        return this;
    }

    max(xorv, y) {
        if (typeof xorv === "number") {
            this.x = Math.max(this.x, xorv);
            this.y = Math.max(this.y, (typeof y === "number") ? y : xorv);
        } else {
            this.x = Math.max(this.x, xorv.x);
            this.y = Math.max(this.y, xorv.y);
        }
        return this;
    }

    toString() {
        return Fmt.toString("Vect", this.x, this.y);
    }

}