export { SketchView };

import { Config }           from "./base/config.js";
import { UxPanel }          from "./base/uxPanel.js";
import { ModelState }       from "./base/modelState.js";

class SketchView extends UxPanel {

    // CONSTRUCTOR ---------------------------------------------------------
    cpre(spec) {
        super.cpre(spec);
        if (spec.xsketch && !spec.xsketch.xfitter) spec.xsketch.xfitter = {};
    }
    cpost(spec) {
        super.cpost(spec);
        this.getx = spec.getx || (() => 0);
        this.gety = spec.gety || (() => 0);
        this.getState = spec.getState || (() => ModelState.idle);
        this.getDepth = spec.getDepth || (() => 0);
        this.getVisible = spec.getVisible || (() => true);
        this.tileSize = spec.tileSize || Config.tileSize;
        this.collider = spec.collider;
    }

    get x() {
        return this._xform.centerx + this.getx();
    }
    get y() {
        return this._xform.centery + this.gety();
    }
    get depth() {
        return this.getDepth();
    }
    get visible() {
        return this.getVisible();
    }

    update(ctx) {
        // update context w/ current model state
        ctx = Object.assign({ state: this.getState() }, ctx);
        super.update(ctx);
        // align xform w/ sketch
        if (this.xform.width != this._sketch.width) this.xform.width = this._sketch.width;
        if (this.xform.height != this._sketch.height) {
            this.xform.height = this._sketch.height;
            if (this._sketch.height > this.tileSize) {
                let off = Math.round((this._sketch.height - this.tileSize)*.5);
                this.xform._offy = -off;
            }
        }
    }

    _render(ctx) {
        if (this._sketch) this._sketch.render(ctx, this.xform.minx + this.getx(), this.xform.miny + this.gety());
    }

    _frender(ctx) {
        if (this.collider && Config.dbgViewColliders) {
            this.collider.render(ctx);
        }
    }

}