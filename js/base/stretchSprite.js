export { StretchSprite };
import { Sketch } from "./sketch.js";

/** ========================================================================
 * A stretch sprite is a sketch used to render a JS image that can be sliced/stretched
 * to maintain corners/sides but still be expandable.
 */
class StretchSprite extends Sketch {
    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec) {
        const img = (spec.hasOwnProperty("img")) ? spec.img : { width: 0, height: 0};
        spec.width = (spec.hasOwnProperty("width")) ? spec.width : img.width;
        spec.height = (spec.hasOwnProperty("height")) ? spec.height : img.height;
        super(spec);
        this.img = img;
        // border attributes, specified in pixels
        this.top = spec.top || 0;
        this.bottom = spec.bottom || 0;
        this.left = spec.left || 0;
        this.right = spec.right || 0;
        if (spec.border) this.top = this.bottom = this.left = this.right = spec.border;
    }

    // METHODS -------------------------------------------------------------
    /**
     * draw the sprite
     * @param {int} x - x position to draw at
     * @param {int} y - y position to draw at
     */
    _render(renderCtx, x=0, y=0) {
        // scale if necessary
        if ((this.width !== this.img.width) || (this.height !== this.img.height)) {
            let sw = this.img.width;
            let sh = this.img.height;
            let dw = this.width;
            let dh = this.height;
            // render corners w/out scale
            // img, sx, sy, swidth, sheight, dx, dy, dwidth, dheight
            if (this.top && this.left) {  // upper left
                renderCtx.drawImage(this.img, 
                    0, 0, this.left, this.top, 
                    x, y, this.left, this.top);
            }
            if (this.top && this.right) { // upper right
                renderCtx.drawImage(this.img, 
                    sw-this.right, 0, this.right, this.top, 
                    x+(dw-this.right), y, this.right, this.top);
            }
            if (this.bottom && this.left) { // lower left
                renderCtx.drawImage(this.img, 
                    0, sh-this.bottom, this.left, this.bottom, 
                    x, y+(dh-this.bottom), this.left, this.bottom);
            }
            if (this.bottom && this.right) { // lower right
                renderCtx.drawImage(this.img, 
                    sw-this.right, sh-this.bottom, this.right, this.bottom, 
                    x+(dw-this.right), y+(dh-this.bottom), this.right, this.bottom);
            }
            // render scaled slices
            let lr = this.left + this.right;
            let tb = this.top + this.bottom;
            if (this.top && lr < sw) { // top middle
                renderCtx.drawImage(this.img, 
                    this.left, 0, sw-lr, this.top, 
                    x+this.left, y, dw-lr, this.top);
            }
            if (this.bottom && lr < sw) { // bottom middle
                renderCtx.drawImage(this.img, 
                    this.left, sh-this.bottom, sw-lr, this.bottom, 
                    x+this.left, y+dh-this.bottom, dw-lr, this.bottom);
            }
            if (this.left && tb < sh) { // left middle
                renderCtx.drawImage(this.img, 
                    0, this.top, this.left, sh-tb,
                    x, y+this.top, this.left, dh-tb);
            }
            if (this.right && tb < sh) { // right middle
                renderCtx.drawImage(this.img, 
                    sw-this.right, this.top, this.right, sh-tb,
                    x+dw-this.right, y+this.top, this.right, dh-tb);
            }
            if (lr < sw && tb < sh) { // middle middle
                renderCtx.drawImage(this.img, 
                    this.left, this.top, sw-lr, sh-tb,
                    x+this.left, y+this.top, dw-lr, dh-tb);
            }

        } else {
            renderCtx.drawImage(this.img, x, y);
        }
    }

}
