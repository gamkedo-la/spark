export { UxDaylightFilter };

import { Atts }             from "./atts.js";
import { Color }            from "./color.js";
import { Config } from "./config.js";
import { Mathf }            from "./math.js";
import { UxPanel }          from "./uxPanel.js";

class UxDaylightFilter extends UxPanel {
    static dfltSketch = {
        cls: "Rect",
        color: new Color(0,0,0,0),
    };
    static minAlpha = 0;
    static maxAlpha = .55;

    // CONSTRUCTOR ---------------------------------------------------------
    cpre(spec={}) {
        super.cpre(spec);
        spec.xsketch = UxDaylightFilter.dfltSketch;
    }
    cpost(spec={}) {
        super.cpost(spec);
        this.getLight = spec.getLight || Atts.getter("light", 1);
        this.minAlpha = spec.minAlpha || UxDaylightFilter.minAlpha;
        this.maxAlpha = spec.maxAlpha || UxDaylightFilter.maxAlpha;
    }

    // METHODS -------------------------------------------------------------
    iupdate(ctx) {
        // update sketch color based on current light
        let light = (Config.dbg.hideNight) ? 1 : this.getLight();
        if (light != this.lastLight) {
            this.lastLight = light;
            let alpha = Mathf.lerp(0, 1, this.maxAlpha, this.minAlpha, light);
            this.sketch.color.a = alpha;
            this.updated = true;
        }
        if (this._sketch) this.updated |= this._sketch.update(ctx);
        return this.updated;
    }

}