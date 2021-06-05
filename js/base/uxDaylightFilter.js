export { UxDaylightFilter };

    import { Atts } from "./atts.js";
import { Color } from "./color.js";
import { Mathf } from "./math.js";
import { UxPanel } from "./uxPanel.js";

class UxDaylightFilter extends UxPanel {
    static dfltSketch = {
        cls: "Rect",
        color: new Color(0,0,0,0),
    };
    static minAlpha = 0;
    static maxAlpha = .75;

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
    update(ctx) {
        let updated = super.update(ctx);
        // update sketch color based on current light
        let light = this.getLight();
        if (light != this.lastLight) {
            this.lastLight = light;
            let alpha = Mathf.lerp(0, 1, this.maxAlpha, this.minAlpha, light);
            this.sketch.color.a = alpha;
        }
        if (this._sketch) updated |= this._sketch.update(ctx);
        return updated;
    }

}