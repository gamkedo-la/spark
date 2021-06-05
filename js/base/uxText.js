export { UxText };

import { Text }         from "./text.js";
import { UxView }       from "./uxView.js";

class UxText extends UxView {
    // STATIC VARIABLES ----------------------------------------------------
    static dfltText = {text: "default text", xfitter: {cls: "FitToParent"}};

    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.sketch = new Text( Object.assign({parent: this}, UxText.dfltText, spec.xtext));
    }

    // PROPERTIES ----------------------------------------------------------
    get text() {
        return this.sketch.text;
    }
    set text(v) {
        this.sketch.text = v;
        this.evtUpdated.trigger();
    }

    // METHODS -------------------------------------------------------------
    _render(ctx) {
        if (this.sketch) this.sketch.render(ctx, this.xform.minx, this.xform.miny);
    }

}
