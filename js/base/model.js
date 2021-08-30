export { Model };

import { Gizmo }            from "./gizmo.js";
import { ModelState }       from "./modelState.js";
import { Stats }            from "./stats.js";
import { Generator }        from "./generator.js";

/** ========================================================================
 * The base game model for holding game data and state
 */
class Model extends Gizmo {

    // STATIC METHODS ------------------------------------------------------
    static hasPos(obj) {
        if (!obj) return false;
        return obj.hasOwnProperty("_x") && obj.hasOwnProperty("_y");
    }
    static hasCollider(obj) {
        return obj && obj.collider;
    }

    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        spec.cat = "Model";
        super(spec);
    }
    cpost(spec) {
        // -- ID represents unique asset ID
        this.id = spec.id || 0;
        // -- depth is relative draw depth (relative to layer)
        this.depth = spec.depth || 0;
        // -- layer is the terrain level associated with model.  used to handle upstair or cellar sections, etc.
        this._layer = spec.layer || 0;
        // -- position
        this._x = spec.x || 0;
        this._y = spec.y || 0;
        // -- view xform
        this.xxform = spec.xxform || undefined;
        // -- conditions
        this.conditions = new Set(spec.conditions);
        // -- dirty (can the object get dirty?)
        this.dirty = spec.dirty;
        // -- sketch
        this.xsketch = spec.xsketch || {};
        // -- xform
        this.xxform = spec.xxform || undefined;
        // -- state
        this.state = spec.state || ModelState.idle;
        this.dfltState = spec.dfltState || ModelState.idle;
        // -- state sound fxs
        this.xstateSfxs = spec.xstateSfxs || {};
        // FIXME: validate we want to put this here...
        // -- visible
        this._visible = spec.hasOwnProperty("visible") ? spec.visible : true;
        // -- collider
        if (spec.xcollider) {
            this.collider = Generator.generate(Object.assign({"cls": "Collider", x: this.x, y: this.y}, spec.xcollider));
        }
        // -- owner tag
        this.ownerTag = spec.ownerTag;
        //console.log(`model ${this} at: ${this._x},${this._y}`);
        // -- link logic
        this.linkSrcTag = spec.linkSrcTag;
        if (!this.linkSrcTag) this.linkDstTag = spec.linkDstTag;
        if (this.linkSrcTag) console.log(`created object ${this} w/ linkSrcTag: ${this.linkSrcTag}`);
        if (this.linkDstTag) console.log(`created object ${this} w/ linkDstTag: ${this.linkDstTag}`);
        // -- sparkable
        this.sparkable = spec.hasOwnProperty("sparkable") ? spec.sparkable : false;
    }

    // PROPERTIES ----------------------------------------------------------
    get x() {
        return this._x;
    }
    set x(v) {
        if (v !== this._x) {
            this._x = v;
            if (this.collider) this.collider.x = v;
            this.updated = true;
        }
    }

    get y() {
        return this._y;
    }
    set y(v) {
        if (v !== this._y) {
            this._y = v;
            if (this.collider) this.collider.y = v;
            this.updated = true;
        }
    }

    get minx() {
        if (this.collider) return this.collider.minx;
        return this._x;
    }
    get maxx() {
        if (this.collider) return this.collider.maxx;
        return this._x;
    }
    get miny() {
        if (this.collider) return this.collider.miny;
        return this._y;
    }
    get maxy() {
        if (this.collider) return this.collider.maxy;
        return this._y;
    }
    get layer() {
        return this._layer;
    }
    set layer(v) {
        if (v !== this._layer) {
            //console.log("setting layer: " + v);
            this._layer = v;
            this.updated = true;
        }
    }
    get visible() {
        return this._visible;
    }
    set visible(v) {
        if (v !== this._visible) {
            //console.log(`setting ${this}.visible: ${v}`);
            this._visible = v;
            this.updated = true;
        }
    }

    // METHODS -------------------------------------------------------------
    iupdate(ctx) {
        //console.log("model update");
        if (this.modified) {
            //if (this.tag !== "player") console.log(`${this} iupdate modified`);
            Stats.count("model.updated");
            this.updated = true;
            this.modified = false;
        }
        return this.updated;
    }

}
