export { Collider, ColliderSet };

import { Config }           from "./config.js";
import { Fmt }              from "./fmt.js";
import { Bounds }           from "./bounds.js";
import { Generator } from "./generator.js";

/**
 * A collider provides a means to determine interaction between objects.  
 * -- This is a base class that uses a simple rectangle to determine collisions.
 */
class Collider {

    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        this._x = spec.x || 0;
        this._y = spec.y || 0;
        this.getx = spec.getx || (() => this._x);
        this.gety = spec.gety || (() => this._y);
        this.offx = spec.offx || 0;
        this.offy = spec.offy || 0;
        // -- allowPathMask is a bitmask of directions allowed for pathfinding w/ this collider
        this.allowPathMask = spec.allowPathMask || 0;
        this.width = (spec.hasOwnProperty("width")) ? spec.width : Config.tileSize;
        this.height = (spec.hasOwnProperty("height")) ? spec.height : Config.tileSize;
        this.color = spec.color || "rgba(127,0,0,.4)";
        this.nbcolor = spec.nbcolor || "rgba(0,127,0,.4)";
        this._blocking = (spec.hasOwnProperty("blocking")) ? spec.blocking : true;
        this._active = (spec.hasOwnProperty("active")) ? spec.active : true;
        this.getactive = spec.getactive || (() => this._active);
    }

    // PROPERTIES ----------------------------------------------------------
    get x() {
        return this.getx();
    }
    set x(v) {
        this._x = v;
    }
    get y() {
        return this.gety();
    }
    set y(v) {
        this._y = v;
    }
    get minx() {
        return this.x + this.offx - (this.width * .5);
    }
    get maxx() {
        return this.x + this.offx + (this.width * .5);
    }
    get miny() {
        return this.y + this.offy - (this.height * .5);
    }
    get maxy() {
        return this.y + this.offy + (this.height * .5);
    }
    get blocking() {
        return this._blocking && this.active;
    }
    get active() {
        return this.getactive();
    }
    set active(v) {
        return this._active = v;
    }

    // METHODS -------------------------------------------------------------
    *[Symbol.iterator]() {
        yield this;
    }

    overlaps(other) {
        return Bounds.overlaps(this, other);
    }

    contains(other) {
        return Bounds.contains(this, other);
    }

    containsXY(x, y) {
        return Bounds.containsXY(this, x, y);
    }

    render(renderCtx) {
        renderCtx.fillStyle = (this.blocking) ? this.color : this.nbcolor;
        renderCtx.fillRect(this.minx, this.miny, this.width, this.height);
    }

    toString() {
        return Fmt.toString(this.constructor.name, this.minx, this.miny, this.width, this.height);
    }

}

class ColliderSet {

    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        this._x = spec.x || 0;
        this._y = spec.y || 0;
        this.getx = spec.getx || (() => this._x);
        this.gety = spec.gety || (() => this._y);
        this.offx = undefined;
        this.offy = undefined;
        this.width = 0;
        this.height = 0;
        // -- allowPathMask is a bitmask of directions allowed for pathfinding w/ this collider
        this.allowPathMask = spec.allowPathMask || 0;
        this.color = spec.color || "rgba(127,0,0,.4)";
        this.nbcolor = spec.nbcolor || "rgba(0,127,0,.4)";
        this._blocking = (spec.hasOwnProperty("blocking")) ? spec.blocking : true;
        this._active = (spec.hasOwnProperty("active")) ? spec.active : true;
        this.getactive = spec.getactive || (() => this._active);
        this.items = [];
        //console.log("collider set: " + Fmt.ofmt(spec));
        for (const xcollider of spec.xitems || []) {
            let collider = Generator.generate(Object.assign({
                "cls": "Collider", 
                getx: this.getx, 
                gety: this.gety, 
                blocking: this._blocking, 
                getactive: () => this.active}, xcollider));
            //console.log("collider add: " + collider);
            if (collider) {
                this.items.push(collider);
                if (this.offx === undefined || collider.offx<this.offx) this.offx = collider.offx;
                if (this.offy === undefined || collider.offy<this.offy) this.offy = collider.offy;
                if (collider.width>this.width) this.width = collider.width;
                if (collider.height>this.height) this.height = collider.height;
            }
        }
    }

    // PROPERTIES ----------------------------------------------------------
    get x() {
        return this.getx();
    }
    get y() {
        return this.gety();
    }
    get minx() {
        return this.x + this.offx - (this.width * .5);
    }
    get maxx() {
        return this.x + this.offx + (this.width * .5);
    }
    get miny() {
        return this.y + this.offy - (this.height * .5);
    }
    get maxy() {
        return this.y + this.offy + (this.height * .5);
    }
    get blocking() {
        return this._blocking && this.active;
    }
    get active() {
        return this.getactive();
    }
    set active(v) {
        return this._active = v;
    }

    // METHODS -------------------------------------------------------------
    *[Symbol.iterator]() {
        yield *this.items;
    }

    overlaps(other) {
        let overlap;
        for (const collider of this) {
            overlap = Bounds.newOrExtend(overlap, Bounds.overlaps(collider, other));
            //console.log("overlap: " + overlap);
        }
        return overlap;
    }

    contains(other) {
        for (const collider of this) {
            if (Bounds.contains(collider, other)) return true;
        }
        return false;
    }

    containsXY(x, y) {
        for (const collider of this) {
            if (Bounds.containsXY(collider, x, y)) return true;
        }
        return false;
    }

    render(renderCtx) {
        for (const collider of this) {
            collider.render(renderCtx);
        }
    }

    toString() {
        return Fmt.toString(this.constructor.name, this.minx, this.miny, this.width, this.height);
    }

}