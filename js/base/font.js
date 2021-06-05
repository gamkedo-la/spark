export { Font };
import { Util } from "./util.js";

class Font {
    static dfltFamily = "sans-serif";

    // STATIC PROPERTIES ---------------------------------------------------
    static get dflt() {
        return new Font();
    }

    constructor(spec={}) {
        this.style = Util.objKeyValue(spec, "style", "normal");
        this.variant = Util.objKeyValue(spec, "variant", "normal");
        this.weight = Util.objKeyValue(spec, "weight", "normal");
        this.size = Util.objKeyValue(spec, "size", 12);
        this.family = Util.objKeyValue(spec, "family", Font.dfltFamily);
    }

    copy(overrides={}) {
        return new Font(Object.assign({
            style: this.style,
            variant: this.variant,
            weight: this.weight,
            size: this.size,
            family: this.family,
        }, overrides));
    }

    toString() {
        return [this.style, this.variant, this.weight, (this.size.toString() + "px"), this.family].join(" ");
    }
}