export { ModelView };

import { Config }           from "./base/config.js";
import { UxPanel }          from "./base/uxPanel.js";
import { Model }            from "./base/model.js";
import { Direction }        from "./base/dir.js";
import { Util }             from "./base/util.js";
import { Fmt }              from "./base/fmt.js";
import { Stats } from "./base/stats.js";

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
        // bind event handlers
        Util.bind(this, "onModelUpdate");
        // register event handlers
        this.model.evtUpdated.listen(this.onModelUpdate);
    }

    // EVENT HANDLERS ------------------------------------------------------
    onModelUpdate(evt) {
        //if (this.model.tag !== "player") console.log(`${this} onModelUpdate`);
        this.updated = true;
    }

    get minx() {
        return this._xform.wminx + this.model.x;
    }
    get miny() {
        return this._xform.wminy + this.model.y;
    }

    get x() {
        return this._xform.wcenterx + this.model.x;
    }
    get y() {
        return this._xform.wcentery + this.model.y;
    }

    get maxx() {
        return this._xform.wmaxx + this.model.x;
    }
    get maxy() {
        return this._xform.wmaxy + this.model.y;
    }

    get depth() {
        return (this.model.layer * Config.depthMap.max) + this.model.depth;
    }
    get visible() {
        return this.model.visible;
    }

    iupdate(ctx) {
        Stats.count("modelView.iupdate");
        // update context w/ current model state
        ctx = Object.assign({ state: this.model.state }, ctx);
        if (this.model.hasOwnProperty("heading")) {
            ctx.facing = Direction.fromHeading(this.model.heading);
            //if (this.lastFacing !== ctx.facing) console.log("setting new facing: " + ctx.facing);
            //this.lastFacing = ctx.facing;
            //console.log(`facing: ${ctx.facing} heading: ${this.model.heading}`);
        }
        this.updated = super.iupdate(ctx);
        // align xform w/ sketch
        if (this.xform.width != this._sketch.width) {
            this.updated = true;
            //console.log(`@@@ setting view ${this} width: ${this._sketch.width}`);
            this.xform.width = this._sketch.width;
        }
        if (this.xform.height != this._sketch.height) {
            this.updated = true;
            this.xform.height = this._sketch.height;
            if (this._sketch.height > this.tileSize) {
                let off = Math.round((this._sketch.height - this.tileSize)*.5);
                this.xform._offy = -off;
            //console.log(`@@@ setting view ${this} height: ${this._sketch.height}`);
            }
        }
        return this.updated;
    }

    _render(ctx) {
        if (this._sketch) this._sketch.render(ctx, this._xform.minx + this.model.x, this._xform.miny + this.model.y);
        // FIXME: remove
        //console.log(`render ${this}: min: ${this._xform.minx + this.model.x},${this._xform.miny + this.model.y} dim: ${this._xform.width},${this._xform.height}`);
        //ctx.strokeStyle = "red";
        //ctx.strokeRect(this._xform.minx + this.model.x, this._xform.miny + this.model.y, this._xform.width, this._xform.height);
    }

    _frender(ctx) {
        if (this.model.collider && Config.dbgViewColliders) {
            this.model.collider.render(ctx);
        }
        if (this.model.activator && Config.dbgViewColliders) {
            this.model.activator.render(ctx);
        }
    }

    toString() {
        return Fmt.toString(this.constructor.name, this.gid, this.tag, this.model);
    }

}