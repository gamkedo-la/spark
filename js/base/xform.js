export { XForm };
import { Fmt } from "./fmt.js";

/** =============================================================================
 * Provides rectangular bounds and tranformation context including scale, translation, rotation based on given values.
 */
class XForm {
    // STATIC METHODS ------------------------------------------------------
    static feq(v1, v2) {
        return Math.abs(v1 - v2) < .00001;
    }

    // STATIC PROPERTIES ---------------------------------------------------
    static get identity() {
        return new XForm();
    }

    // CONSTRUCTOR ---------------------------------------------------------
    /**
     * @param {*} spec 
     * - left, right, top, bottom, border - applies stretch effect to transform, using values as percent (0-1) or parent transform
     *   Use equal border (e.g.: border=.5) for no stretch
     * - oleft, oright, otop, obottom, offset - applies offset from border (above) in pixels
     * - origx, origy - the origin to use for transform in percent of width/height
     * - scalex, scaley - scale to apply to transform
     * - angle - rotation angle to apply to transform
     * - dx, dy - translation to apply to transform
     * - parent - parent tranform
     * - x,y (applicable if not stretched)
     * - width, height (applicable if not stretched)
     */
    constructor(spec={}) {
        // parent of transform, should point to another transform instance (if any)
        this.parent = spec.parent;
        // borders from parent transform, in percent (0-1)
        this.left = spec.left || 0;
        this.right = spec.right || 0;
        this.top = spec.top || 0;
        this.bottom = spec.bottom || 0;
        if (spec.border) {
            this.left = this.right = this.top = this.bottom = spec.border;
        }
        // origin of transform, in percent of parent's width (0-1)
        this._origx = (spec.hasOwnProperty("origx")) ? spec.origx : .5;
        this._origy = (spec.hasOwnProperty("origy")) ? spec.origy : .5;
        // offset from borders, in pixels
        let oleft = spec.oleft || 0;
        let oright = spec.oright || 0;
        let otop = spec.otop || 0;
        let obottom = spec.obottom || 0;
        if (spec.offset) {
            oleft = oright = otop = obottom = spec.offset;
        }
        // x/y offset (in pixels)
        this._offx = (this.stretchx) ? ((this._origx)*(oleft - oright)) : (spec.x || 0);
        this._offy = (this.stretchy) ? ((this._origy)*(otop - obottom)) : (spec.y || 0);
        // delta from parent width (in pixels)
        this._dwidth = -(oleft + oright);
        this._dheight = -(otop + obottom);
        // fixed height/width of transform, applies if one of these is true:
        // - parent is undefined
        // - stretch for dimension is false
        this._width = spec.width || 0;
        this._height = spec.height || 0;
        // scale to apply for this transform
        this.scalex = spec.scalex || 1;
        this.scaley = spec.scaley || 1;
        // angle to apply for this transform
        this.angle = spec.angle || 0;
        // translation to apply for this transform
        this.dx = spec.dx || 0;
        this.dy = spec.dy || 0;
    }

    // PROPERTIES ----------------------------------------------------------
    // delta from origin
    get dox() {
        let v = this._offx;
        if (this.parent) {
            v += this.parent.minx;
            v += (this.parent.width * this.left);
            v += ((this.stretchx) ? (this.width * this._origx) : 0);
            v += (-this._dwidth * (1-this._origx));
        }
        return v;
    }
    get doy() {
        let v = this._offy;
        if (this.parent) {
            v += this.parent.miny;
            v += (this.parent.height * this.top);
            v += ((this.stretchy) ? (this.height * this._origy) : 0);
            v += (-this._dheight * (1-this._origy));
        }
        return v;
    }

    // is transform stretched in given direction?
    get stretchx() {
        return this.parent && !XForm.feq(1 - this.right, this.left);
    }
    get stretchy() {
        return this.parent && !XForm.feq(1 - this.bottom, this.top);
    }

    // inverse scale of transform
    get iscalex() {
        return (this.scalex) ? 1/this.scalex : 0;
    }
    get iscaley() {
        return (this.scaley) ? 1/this.scaley : 0;
    }

    // get minimum x,y in local coords
    get minx() {
        return -(this._origx*this.width);
    }
    get miny() {
        return -(this._origy*this.height);
    }

    // get center x,y in local coords
    get centerx() {
        return (this.width*(.5-this._origx));
    }
    get centery() {
        return (this.height*(.5-this._origy));
    }

    // get maximum x,y in local coords
    get maxx() {
        return (1-this._origx)*this.width;
    }
    get maxy() {
        return (1-this._origy)*this.height;
    }

    get isIdentity() {
        return this.scalex === 1 &&
               this.scaley === 1 &&
               this.angle === 0 &&
               this.dx === 0 &&
               this.dy === 0;
    }

    // width is the width of my rectangle
    // - takes into account border/offset values
    // - does not take into account scaling
    get width() {
        let v = (this.stretchx) ? this.parent.width * (1-this.left-this.right) : this._width;
        v += this._dwidth;
        return v;
    }
    set width(v) {
        v -= this._dwidth;
        this._width = v;
    }

    // height of rectangle
    get height() {
        let v = (this.stretchy) ? this.parent.height * (1-this.top-this.bottom) : this._height;
        v += this._dheight;
        return v;
    }
    set height(v) {
        v -= this._dheight;
        this._height = v;
    }

    // METHODS -------------------------------------------------------------

    // apply local coords, then scale, rotation, translation
    apply(ctx, chain=true) {
        if (chain && this.parent) this.parent.apply(ctx);
        let dox = this.dox;
        let doy = this.doy;
        if (dox || doy) ctx.translate(dox, doy);
        if (this.angle) ctx.rotate(this.angle);
        if (this.scalex !== 1|| this.scaley !== 1) ctx.scale(this.scalex, this.scaley);
        if (this.dx || this.dy) ctx.translate(this.dx, this.dy);
    }

    // revert transform
    revert(ctx, chain=true) {
        // revert reverses order of operations
        if (this.dx || this.dy) ctx.translate(-this.dx, -this.dy);
        if (this.scalex !== 1|| this.scaley !== 1) ctx.scale(this.iscalex, this.iscaley);
        if (this.angle) ctx.rotate(-this.angle);
        let dox = this.dox;
        let doy = this.doy;
        if (dox || doy) ctx.translate(-dox, -doy);
        if (chain && this.parent) this.parent.revert(ctx);
    }

    toString() {
        return Fmt.toString(this.constructor.name, this.minx, this.miny, this.dx, this.dy, this.scalex, this.scaley, this.angle);
    }

    /**
     * translate world position to local position
     * @param {*} worldPos 
     */
    getLocal(worldPos) {
        let localPos;
        // apply parent transform (if any)
        if (this.parent) {
            localPos = this.parent.getLocal(worldPos);
        } else {
            localPos = worldPos.copy();
        }
        // perform world->local translation
        localPos.sub(this.dox, this.doy);
        // apply local transforms
        if (this.angle) localPos.rotate(-this.angle, true);
        if (this.scalex !== 1|| this.scaley !== 1) localPos.div(this.scalex, this.scaley);
        if (this.dx || this.dy) localPos.sub(this.dx, this.dy);
        return localPos;
    }

    /**
     * translate local position to world position
     * @param {*} localPos 
     */
    getWorld(localPos) {
        let worldPos = localPos.copy();
        // apply local transforms
        if (this.dx || this.dy) worldPos.add(this.dx, this.dy);
        if (this.scalex !== 1|| this.scaley !== 1) worldPos.mult(this.scalex, this.scaley);
        if (this.angle) worldPos.rotate(this.angle, true);
        // perform world->local translation
        worldPos.add(this.dox, this.doy);
        // apply parent transform (if any)
        if (this.parent) worldPos = this.parent.getWorld(worldPos);
        return worldPos;
    }

    render(ctx, color="rgba(255,255,0,.5") {
        // get to local coordinate space
        if (this.parent) this.parent.apply(ctx);
        let dox = this.dox;
        let doy = this.doy;
        if (dox || doy) ctx.translate(dox, doy);
        // bounding box before local transform
        ctx.strokeStyle = color;
        ctx.setLineDash([5,5]);
        ctx.lineWidth = 3;
        ctx.strokeRect(this.minx, this.miny, this.width, this.height);
        ctx.setLineDash([]);
        // apply local transform
        if (this.angle) ctx.rotate(this.angle);
        if (this.scalex !== 1|| this.scaley !== 1) ctx.scale(this.scalex, this.scaley);
        if (this.dx || this.dy) ctx.translate(this.dx, this.dy);
        // resulting bounding box...
        ctx.strokeRect(this.minx, this.miny, this.width, this.height);
        ctx.fillStyle = "red";
        ctx.fillRect(-4, -4, 8, 8);
        // revert transformation
        this.revert(ctx);
    }
}