export { UxGloom };

import { Color }            from "./base/color.js";
import { Config }           from "./base/config.js";
import { UxPanel }          from "./base/uxPanel.js";

class UxGloom extends UxPanel {
    static dfltSketch = {
        cls: "Rect",
        color: new Color(0,0,0,.9),
    };

    // CONSTRUCTOR ---------------------------------------------------------
    cpre(spec={}) {
        super.cpre(spec);
        spec.xsketch = UxGloom.dfltSketch;
    }
    cpost(spec={}) {
        super.cpost(spec);
    }

    // METHODS -------------------------------------------------------------
    _render(ctx) {
        if (Config.dbg.hideGloom) return;
        ctx.globalCompositeOperation = 'saturation';
        if (this._sketch) this._sketch.render(ctx, this.xform.minx, this.xform.miny);
        ctx.globalCompositeOperation = 'source-over';
    }

}