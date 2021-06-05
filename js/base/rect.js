export { Rect };
import { Sketch } from "./sketch.js";

/** ========================================================================
 * A rectangle is a sketch primitive.
 */
class Rect extends Sketch {

    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        super(spec);
        this.borderWidth = spec.borderWidth || 0;
        this.borderColor = spec.borderColor || "black";
        this.color = spec.color || "rgba(127,127,127,.75)";
    }

    // METHODS -------------------------------------------------------------
    _render(renderCtx, x=0, y=0) {
        renderCtx.fillStyle = this.color;
        renderCtx.fillRect(x, y, this.width, this.height);
        if (this.borderWidth) {
            renderCtx.lineWidth = this.borderWidth;
            renderCtx.strokeStyle = this.borderColor;
            renderCtx.strokeRect(x, y, this.width, this.height);
        }
    }

}