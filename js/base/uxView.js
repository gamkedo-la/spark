export { UxView };

import { Fmt }              from "./fmt.js";
import { Bounds }           from "./bounds.js";
import { Gizmo }            from "./gizmo.js";
import { EvtChannel }       from "./event.js";
import { XForm }            from "./xform.js";

/** ========================================================================
 * The base user experience primitive.
 */
class UxView extends Gizmo {

    // CONSTRUCTOR ---------------------------------------------------------
    cpre(spec={}) {
        this._xform = (spec.xxform) ? new XForm(spec.xxform) : XForm.identity;
    }
    constructor(spec={}) {
        spec.cat = "View";
        super(spec);
    }
    cpost(spec={}) {
        this._visible = spec.hasOwnProperty("visible") ? spec.visible : true;
        this._depth = spec.hasOwnProperty("depth") ? spec.depth : ((spec.hasOwnProperty("dfltDepth")) ? spec.dfltDepth : 0);
        this.layer = spec.hasOwnProperty("layer") ? spec.layer : ((spec.hasOwnProperty("dfltLayer")) ? spec.dfltLayer : 0);
        this.ui = spec.ui || false;
        this.mouseOver = false;
        this.mouseDown = false;
        this.dbg = spec.dbg;
        // event channels
        this.__evtAppeared = new EvtChannel("appeared", {actor: this});
        this.__evtDisappeared = new EvtChannel("disappeared", {actor: this});
        this.__evtMouseEntered = new EvtChannel("mouseEntered", {actor: this});
        this.__evtMouseLeft = new EvtChannel("mouseLeft", {actor: this});
        // event handlers
        if (spec.mouseEnteredSound) {
            let sound = spec.mouseEnteredSound;
            this.evtMouseEntered.listen((e) => sound.play());
        }
        if (spec.mouseLeftSound) {
            let sound = spec.mouseLeftSound;
            this.evtMouseLeft.listen((e) => sound.play());
        }
    }

    // PROPERTIES ----------------------------------------------------------
    get xform() {
        return this._xform;
    }

    // retrieve view min coords in world position
    get minx() {
        return this._xform.wminx;
    }
    get miny() {
        return this._xform.wminy;
    }

    get x() {
        return this._xform.wcenterx;
    }
    get y() {
        return this._xform.wcentery;
    }

    get maxx() {
        return this._xform.wmaxx;
    }
    get maxy() {
        return this._xform.wmaxy;
    }

    get depth() {
        return this._depth;
    }
    set depth(v) {
        return this._depth = v;
    }

    get width() {
        return this._xform.wmaxx-this._xform.wminx;
    }

    get height() {
        return this._xform.wmaxy-this._xform.wminy;
    }

    get bounds() {
        return new Bounds(this.minx, this.miny, this.width, this.height);
    }

    get visible() {
        if (!this._visible) return false;
        if (this.parent) return this.parent.visible;
        return true;
    }
    set visible(v) {
        v = (v) ? true : false;
        if (v != this._visible) {
            this.updated = true;
            this._visible = v;
            if (v) {
                this.evtAppeared.trigger();
            } else {
                this.evtDisappeared.trigger();
            }
        }
    }

    // EVENTS --------------------------------------------------------------
    get evtAppeared() { return this.__evtAppeared; }
    get evtDisappeared() { return this.__evtDisappeared; }
    get evtMouseEntered() { return this.__evtMouseEntered; }
    get evtMouseLeft() { return this.__evtMouseLeft; }

    // METHODS -------------------------------------------------------------
    _render(ctx) {
    }
    _frender(ctx) {
    }

    render(ctx) {
        // don't render if not visible
        if (!this.visible) return;
        // apply transform
        this.xform.apply(ctx, false);
        // private render, specific to subclass
        this._render(ctx);
        // child render
        for (const child of this.__children) {
            child.render(ctx);
        }
        // FIXME
        this.xform.revert(ctx, false);
        if (this.xform.scalex !== 1|| this.xform.scaley !== 1) ctx.scale(this.xform.scalex, this.xform.scaley);
        // final render, specific to subclass
        this._frender(ctx);
        // revert transform
        if (this.xform.scalex !== 1|| this.xform.scaley !== 1) ctx.scale(this.xform.iscalex, this.xform.iscaley);
        //this.xform.revert(ctx, false);
    }

    adopt(child) {
        super.adopt(child);
        child.xform.parent = this.xform;
    }

    orphan() {
        this.xform.parent = undefined;
        super.orphan();
    }

    toString() {
        return Fmt.toString(this.constructor.name, this.gid, this.tag, this.pos);
    }

}