export { Model };

import { Gizmo }            from "./gizmo.js";
import { ModelState }       from "./modelState.js";
import { Stats } from "./stats.js";

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
        // -- ID represents unique asset ID
        this.id = spec.id || 0;
        // -- depth is relative draw depth (relative to layer)
        this.depth = spec.depth || 0;
        // -- layer is the terrain level associated with model.  used to handle upstair or cellar sections, etc.
        this._layer = spec.layer || 0;
        // -- state
        this.state = spec.state || ModelState.idle;
        // FIXME: validate we want to put this here...
        // -- visible
        this._visible = spec.hasOwnProperty("visible") ? spec.visible : true;
    }

    // PROPERTIES ----------------------------------------------------------
    get minx() {
        if (this.collider) return this.collider.minx;
        return undefined;
    }
    get maxx() {
        if (this.collider) return this.collider.maxx;
        return undefined;
    }
    get miny() {
        if (this.collider) return this.collider.miny;
        return undefined;
    }
    get maxy() {
        if (this.collider) return this.collider.maxy;
        return undefined;
    }
    get layer() {
        return this._layer;
    }
    set layer(v) {
        if (v !== this._layer) {
            //console.log("setting layer: " + v);
            this._layer = v;
            this.modified = true;
        }
    }
    get visible() {
        return this._visible;
    }
    set visible(v) {
        if (v !== this._visible) {
            //console.log(`setting ${this}.visible: ${v}`);
            this._visible = v;
            this.modified = true;
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
