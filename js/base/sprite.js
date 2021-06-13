export { Sprite };
import { Sketch } from "./sketch.js";

/** ========================================================================
 * A sprite is a sketch used to render a JS image.
 */
class Sprite extends Sketch {
    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec) {
        const img = (spec.hasOwnProperty("img")) ? spec.img : { width: 0, height: 0};
        spec.width = (spec.hasOwnProperty("width")) ? spec.width : img.width;
        spec.height = (spec.hasOwnProperty("height")) ? spec.height : img.height;
        super(spec);
        this.img = img;
    }

    // METHODS -------------------------------------------------------------
    /**
     * draw the sprite
     */
    _render(renderCtx, x=0, y=0) {
        // scale if necessary
        if ((this.width !== this.img.width) || (this.height !== this.img.height)) {
            if (this.img.width && this.img.height) {
                // src dims
                let sw = this.img.width;
                let sh = this.img.height;
                // dst dims
                let dw = this.width;
                let dh = this.height;
                //renderCtx.imageSmoothingEnabled = false;
                renderCtx.drawImage(this.img, 
                    0, 0, sw, sh, 
                    x, y, dw, dh);
            }
        } else {
            //renderCtx.imageSmoothingEnabled = false;
            renderCtx.drawImage(this.img, x, y);
        }
    }

}
