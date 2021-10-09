export { UxFader };

import { UxView } from "./uxView.js";
import { Color } from "./color.js";
import { Generator } from "./generator.js";

class UxFader extends UxView {
    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec) {
        super(spec);
        // fadein => transparent to black
        // !fadein => black to transparent
        this.fadein = spec.fadein || false;
        this.maxFadeTTL = spec.fadeTTL || 1000;
        let color = spec.color || new Color(0,0,0);
        this.faded = false;
        this.sketch = Generator.generate({
            parent: this,
            cls: "Rect",
            parent: this,
            color: color,
            xfitter: { cls: "FitToParent" },
        });
        this.reset();
    }

    // METHODS -------------------------------------------------------------
    iupdate(ctx) {
        if (!this.active) return false;
        if (this.fadeTTL > 0) {
            this.fadeTTL -= ctx.deltaTime;
            if (this.fadein) {
                this.sketch.color.a += this.fadeRate*ctx.deltaTime;
                if (this.sketch.color.a > 1) this.sketch.color.a = 1;
            } else {
                this.sketch.color.a -= this.fadeRate*ctx.deltaTime;
                if (this.sketch.color.a < 0) this.sketch.color.a = 0;
            }
            this.updated = true;
        } else if (!this.faded) {
            if (this.fadein) {
                this.sketch.color.a = 1;
            } else {
                this.sketch.color.a = 0;
            }
            this.faded = true;
            this.updated = true;
        }
        if (this.sketch) this.updated |= this.sketch.update(ctx);
        return this.updated;
    }

    reset(activate=false) {
        this.fadeTTL = this.maxFadeTTL;
        this.fadeRate = 1/this.fadeTTL;
        this.sketch.color.a = (this.fadein) ? 0 : 1;
        this.updated = true;
        this.faded = false;
        if (activate) {
            this.visible = true;
            this.active = true;
        }
    }

    _render(ctx) {
        if (this.sketch) this.sketch.render(ctx, this.xform.minx, this.xform.miny);
    }

}