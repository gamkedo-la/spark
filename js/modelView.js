export { ModelView, CharacterView };

import { Config }           from "./base/config.js";
import { UxPanel }          from "./base/uxPanel.js";
import { Model }            from "./base/model.js";
import { Direction }        from "./base/dir.js";
import { Util }             from "./base/util.js";
import { Fmt }              from "./base/fmt.js";
import { Stats }            from "./base/stats.js";
import { Vect }             from "./base/vect.js";
import { Color }            from "./base/color.js";
import { Camera }           from "./base/camera.js";
import { Mouse }            from "./base/mouse.js";
import { Event }            from "./base/event.js";
import { Atts }             from "./base/atts.js";

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
        if (this.wantMouse) {
            this.hoverDelay = spec.hoverDelay || 600;
            this.hoverTimer = 0;
        }
        // bind event handlers
        Util.bind(this, "onModelUpdate");
        // register event handlers
        this.model.evtUpdated.listen(this.onModelUpdate);
    }

    // EVENT HANDLERS ------------------------------------------------------
    onModelUpdate(evt) {
        this.updated = true;
    }

    get wmodelX() {
        if (this.model.x === this.lastModelX) {
            return this._wmodelX;
        } else {
            this.lastModelX = this.model.x;
            this._wmodelX = this._xform.getWorld(new Vect(this.model.x-this._xform.dx, this.model.y-this._xform.dy)).x + this._xform.dox;
            return this._wmodelX;
        }
    }

    get wmodelY() {
        if (this.model.y === this.lastModelY) {
            return this._wmodelY;
        } else {
            this.lastModelY = this.model.y;
            this._wmodelY = this._xform.getWorld(new Vect(this.model.x-this._xform.dx, this.model.y-this._xform.dy)).y - this._xform.doy;
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

    // target is model view being hovered over
    genHoverView(target) {
        let dx = target.x*Config.renderScale - Camera.main.minx;
        let dy = target.y*Config.renderScale - Camera.main.miny;
        let xview = {
            cls: "UxHoverView",
            ui: true,
            xsketch: { cls: "Rect", color: "rgba(255,255,255,.25)", width: 50, height: 30},
            getx: () => target.x*Config.renderScale - Camera.main.minx,
            gety: () => target.y*Config.renderScale - Camera.main.miny,
            xxform: { dy: -35, x: dx, y: dy, scalex: Config.renderScale, scaley: Config.renderScale, width: 50, height: 20 },
            xchildren: [
                {
                    cls: "UxText",
                    xtext: { xfitter: {cls: "FitToParent", top: .2, bottom: .1, left: .05, right: .05}, color: new Color(0,255,0,.75), text: target.name },
                },
            ]
        };
        return new UxHoverView(xview);
    }

    updateHover(ctx) {
        if (this.mouseOver) {
            if (!this.hoverView) {
                this.hoverTimer += ctx.deltaTime;
                if (this.hoverTimer >= this.hoverDelay) {
                    this.hoverView = this.genHoverView(this.model)
                }
            }
        } else {
            this.hoverTimer = 0;
            if (this.hoverView) {
                this.hoverView.destroy();
            }
            this.hoverView = false;
        }

        return false;
    }

    iupdate(ctx) {
        Stats.count("modelView.iupdate");
        // update context w/ current model state
        ctx = Object.assign({ state: this.model.state }, ctx);
        if (this.model.hasOwnProperty("facing")) {
            ctx.facing = this.model.facing;
        } else if (this.model.hasOwnProperty("heading")) {
            ctx.facing = Direction.fromHeading(this.model.heading);
        }
        this.updated = super.iupdate(ctx);
        // align xform w/ sketch
        if (this.xform.width != this._sketch.width) {
            this.updated = true;
            this.xform.width = this._sketch.width;
            this.lastModelX = undefined;
            this.wmodelX;
        }
        if (this.xform.height != this._sketch.height) {
            this.updated = true;
            this.xform.height = this._sketch.height;
            this.lastModelY = undefined;
            this.wmodelY;
        }
        // update hover for any views that want mouse interaction
        if (this.wantMouse) {
            this.updated |= this.updateHover(ctx);
        }
        return this.updated;
    }

    _render(ctx) {
        if (this._sketch && this._sketch.render) this._sketch.render(ctx, this._xform.minx + this.model.x, this._xform.miny + this.model.y);
    }

    _frender(ctx) {
        if (Config.dbg.viewColliders) {
            // colliders "render" in world coords
            this.xform.revert(ctx, false);
            if (this.xform.scalex !== 1|| this.xform.scaley !== 1) ctx.scale(this.xform.scalex, this.xform.scaley);
            if (this.model.collider) this.model.collider.render(ctx);
            if (this.model.activator) this.model.activator.render(ctx);
            if (this.model.approaches) {
                for (const approach of this.model.approaches) {
                    ctx.fillStyle = "rgba(127,0,127,.5)";
                    ctx.fillRect(approach.x-Config.halfSize, approach.y-Config.halfSize, Config.tileSize, Config.tileSize);
                }
            }
            // restore transform
            if (this.xform.scalex !== 1|| this.xform.scaley !== 1) ctx.scale(this.xform.iscalex, this.xform.iscaley);
            this.xform.apply(ctx, false);
        }
    }

    toString() {
        return Fmt.toString(this.constructor.name, this.gid, this.tag, this.model);
    }

}

class UxHoverView extends UxPanel {

    // CONSTRUCTOR ---------------------------------------------------------
    cpre(spec) {
        super.cpre(spec);
    }
    cpost(spec={}) {
        super.cpost(spec);
        this.getx = spec.getx || (() => 0);
        this.gety = spec.gety || (() => 0);
    }

    iupdate(ctx) {
        this.updated |= super.iupdate(ctx);
        let lastx = this.xform._offx;
        let lasty = this.xform._offy;
        this.xform._offx = this.getx();
        this.xform._offy = this.gety();
        if (lastx !== this.xform._offx || lasty != this.xform._offy) this.updated = true;
        return this.updated;
    }
}

class CharacterView extends ModelView {
    cpost(spec) {
        super.cpost(spec);
        this.eventQ = spec.eventQ || Atts.gameEventQ;
        Util.bind(this, "onMouseClick");
        Mouse.evtClicked.listen(this.onMouseClick);
    }

    onMouseClick(evt) {
        if (!this.active) return;
        if (this.mouseOver) {
            this.eventQ.push(new Event("npc.click", {actor: this.model}));
        }
    }

    destroy() {
        Mouse.evtClicked.ignore(this.onMouseClick);
        super.destroy();
    }
}