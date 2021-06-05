export { ModelView };

import { Config }           from "./base/config.js";
import { UxPanel }          from "./base/uxPanel.js";
import { ModelState }       from "./base/modelState.js";
import { Model }            from "./base/model.js";
import { Direction } from "./base/dir.js";

class ModelView extends UxPanel {

    // CONSTRUCTOR ---------------------------------------------------------
    cpre(spec) {
        super.cpre(spec);
        if (spec.xsketch && !spec.xsketch.xfitter) spec.xsketch.xfitter = {};
    }
    cpost(spec) {
        super.cpost(spec);
        this.model = spec.model || new Model();
        this.tileSize = spec.tileSize || Config.tileSize;
    }

    get x() {
        return this._xform.centerx + this.model.x;
    }
    get y() {
        return this._xform.centery + this.model.y;
    }
    get depth() {
        return (this.model.layer * Config.depthMap.max) + this.model.depth;
    }
    get visible() {
        return this.model.visible;
    }

    update(ctx) {
        // update context w/ current model state
        ctx = Object.assign({ state: this.model.state }, ctx);
        if (this.model.hasOwnProperty("heading")) {
            ctx.facing = Direction.fromHeading(this.model.heading);
            //if (this.lastFacing !== ctx.facing) console.log("setting new facing: " + ctx.facing);
            //this.lastFacing = ctx.facing;
            //console.log(`facing: ${ctx.facing} heading: ${this.model.heading}`);
        }
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
        if (this._sketch) this._sketch.render(ctx, this.xform.minx + this.model.x, this.xform.miny + this.model.y);
    }

    _frender(ctx) {
        if (this.model.collider && Config.dbgViewColliders) {
            this.model.collider.render(ctx);
        }
        if (this.model.activator && Config.dbgViewColliders) {
            this.model.activator.render(ctx);
        }
    }

}