export { UxPanel };

import { Generator }        from "./generator.js";
import { Util }             from "./util.js";
import { UxView }           from "./uxView.js";

class UxPanel extends UxView {
    // STATIC VARIABLES ----------------------------------------------------
    static dfltSketch = {
        cls: "Rect",
        color: "rgba(255,255,255,.25)",
    };

    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec={}) {
        super.cpost(spec);
        this._sketch = Generator.generate(Object.assign({parent: this, xfitter: { cls: "FitToParent" }}, spec.xsketch || UxPanel.dfltSketch));
        // bind event handlers
        Util.bind(this, "onSketchUpdate");
        if (this._sketch) this._sketch.evtUpdated.listen(this.onSketchUpdate);
    }

    // PROPERTIES ----------------------------------------------------------
    get sketch() {
        return this._sketch;
    }

    set sketch(v) {
        if (v !== this._sketch) {
            if (this._sketch) this._sketch.evtUpdated.ignore(this.onSketchUpdate);
            if (this._sketch.parent) this._sketch.parent = undefined;
            this._sketch = v;
            v.parent = this;
            if (this._sketch) this._sketch.evtUpdated.listen(this.onSketchUpdate);
            this.evtUpdated.trigger();
        }
    }

    // EVENT HANDLERS ------------------------------------------------------
    onSketchUpdate(evt) {
        // propagate update
        this.evtUpdated.trigger();
    }

    // METHODS -------------------------------------------------------------
    iupdate(ctx) {
        if (this._sketch) this.updated |= this._sketch.update(ctx);
        return this.updated;
    }

    _render(ctx) {
        if (this._sketch) this._sketch.render(ctx, this.xform.minx, this.xform.miny);
    }

}