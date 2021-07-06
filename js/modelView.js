export { ModelView };

import { Config }           from "./base/config.js";
import { UxPanel }          from "./base/uxPanel.js";
import { Model }            from "./base/model.js";
import { Direction }        from "./base/dir.js";
import { Util }             from "./base/util.js";
import { Fmt }              from "./base/fmt.js";
import { Stats } from "./base/stats.js";
import { Vect } from "./base/vect.js";

class ModelView extends UxPanel {

    // CONSTRUCTOR ---------------------------------------------------------
    cpre(spec) {
        super.cpre(spec);
        spec.wantMouse = spec.hasOwnProperty("wantMouse") ? spec.wantMouse : false;
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

    get wmodelX() {
        if (this.model.x === this.lastModelX) {
            return this._wmodelX;
        } else {
            this.lastModelX = this.model.x;
            this._wmodelX = this._xform.getWorld(new Vect(this.model.x-this._xform.dx, this.model.y-this._xform.dy)).x + this._xform.dox;
            //this._wmodelX = this._xform.getWorld(new Vect(this.model.x+this._xform.minx, this.model.y+this._xform.miny)).x;
            //console.log(`#-#-# compute new world x ${this.wmodelX} w/ xform: ${this._xform}, dox: ${this.xform.dox} pos: ${this.model.x},${this.model.y}`);
            return this._wmodelX;
        }
    }

    get wmodelY() {
        if (this.model.y === this.lastModelY) {
            return this._wmodelY;
        } else {
            this.lastModelY = this.model.y;
            //this._wmodelY = this._xform.getWorld(new Vect(this.model.x+this._xform.minx, this.model.y+this._xform.miny)).y;
            this._wmodelY = this._xform.getWorld(new Vect(this.model.x-this._xform.dx, this.model.y-this._xform.dy)).y - this._xform.doy;
            //console.log(`#-#-# compute new world y ${this.wmodelY} w/ xform: ${this._xform}, doy: ${this.xform.doy} pos: ${this.model.x},${this.model.y}`);

            /*
            if (true) {
                if (this._xform.dx || this._xform.dy) worldPos.add(this.dx, this.dy);
                if (this._xform.scalex !== 1|| this._xform.scaley !== 1) worldPos.mult(this.scalex, this.scaley);
                if (this._xform.angle) worldPos.rotate(this._xform.angle, true);
                // perform world->local translation
                worldPos.add(this._xform.dox, this._xform.doy);
            }
            */

            return this._wmodelY;
        }
    }

    get minx() {
        return this._xform.wminx + this.wmodelX;
    }
    get miny() {
        return this._xform.wminy + this.wmodelY;
    }

    get x() {
        return this._xform.wcenterx + this.wmodelX;
    }
    get y() {
        return this._xform.wcentery + this.wmodelY;
    }

    get maxx() {
        return this._xform.wmaxx + this.wmodelX;
    }
    get maxy() {
        return this._xform.wmaxy + this.wmodelY;
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
        //if (this.updated) console.log(`ModelView for ${this} super updated`);
        // align xform w/ sketch
        if (this.xform.width != this._sketch.width) {
            this.updated = true;
            //console.log(`@@@ setting view ${this} width: ${this._sketch.width}`);
            this.xform.width = this._sketch.width;
            //this._wmodelX = this._xform.getWorld(new Vect(this.model.x, this.model.y)).x;
            this.lastModelX = undefined;
            this.wmodelX;
            //console.log(`#-#-# compute new world x ${this.wmodelX} w/ xform: ${this._xform}, pos: ${this.model.x},${this.model.y}`);
            //this._wmodelX = this._xform.getWorld(new Vect(this.model.x-this._xform.minx, this.model.y-this._xform.miny)).x;
            //console.log(`#-#-# xform min: ${this._xform.minx},${this._xform.miny}`);
        }
        if (this.xform.height != this._sketch.height) {
            this.updated = true;
            this.xform.height = this._sketch.height;
            /*
            if (this._sketch.height > this.tileSize) {
                //let off = Math.round((this._sketch.height - this.tileSize)*.5);
                let off = Math.round((this._sketch.height - this.tileSize));
                this.xform._offy = -off;
                //this.xform.dy = -off;
                //console.log(`@@@ setting view ${this} height: ${this._sketch.height} off: ${off}`);
            }
            */
            //this._wmodelY = this._xform.getWorld(new Vect(this.model.x, this.model.y)).y;
            this.lastModelY = undefined;
            this.wmodelY;
            //this._wmodelY = this._xform.getWorld(new Vect(this.model.x-this._xform.minx, this.model.y-this._xform.miny)).y;
            //console.log(`#-#-# compute new world y ${this.wmodelY} w/ xform: ${this._xform}, pos: ${this.model.x},${this.model.y}`);
            //console.log(`#-#-# xform min: ${this._xform.minx},${this._xform.miny}`);

            // FIXME remove
            //console.log(`xform d: ${this._xform.dx},${this._xform.dy}, scale: ${this._xform.scalex},${this._xform.scaley}, do: ${this._xform.dox},${this._xform.doy}}`);
            //if (this.dx || this.dy) worldPos.add(this.dx, this.dy);
            //if (this.scalex !== 1|| this.scaley !== 1) worldPos.mult(this.scalex, this.scaley);
            //if (this.angle) worldPos.rotate(this.angle, true);
            // perform world->local translation
            //worldPos.add(this.dox, this.doy);
            // apply parent transform (if any)

        }
        return this.updated;
    }

    _render(ctx) {
        if (this._sketch) this._sketch.render(ctx, this._xform.minx + this.model.x, this._xform.miny + this.model.y);
        // FIXME: remove
        //console.log(`render ${this}: min: ${this._xform.minx + this.model.x},${this._xform.miny + this.model.y} dim: ${this._xform.width},${this._xform.height}`);
        /*
        if (this.model.tag !== "grass.j") {
            ctx.strokeStyle = "red";
            ctx.strokeRect(this._xform.minx + this.model.x, this._xform.miny + this.model.y, this._xform.width, this._xform.height);
        }
        */
    }

    _frender(ctx) {
        if (Config.dbg.viewColliders) {
            if (this.model.collider) this.model.collider.render(ctx);
            if (this.model.activator) this.model.activator.render(ctx);
            if (this.model.approaches) {
                for (const approach of this.model.approaches) {
                    ctx.fillStyle = "rgba(127,0,127,.5)";
                    ctx.fillRect(approach.x-Config.halfSize, approach.y-Config.halfSize, Config.tileSize, Config.tileSize);
                }
            }
        }
    }

    toString() {
        return Fmt.toString(this.constructor.name, this.gid, this.tag, this.model);
    }

}