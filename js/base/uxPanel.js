export { UxPanel };

    import { Fmt } from "./fmt.js";
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
        //if (this._sketch) this._sketch.evtUpdated.listen(this.onSketchUpdate);
        this.closeOnSketchDone = spec.hasOwnProperty("closeOnSketchDone") ? spec.closeOnSketchDone : false;
    }

    // PROPERTIES ----------------------------------------------------------
    get sketch() {
        return this._sketch;
    }

    set sketch(v) {
        if (v !== this._sketch) {
            //if (this._sketch) this._sketch.evtUpdated.ignore(this.onSketchUpdate);
            if (this._sketch && this._sketch.parent) this._sketch.parent = undefined;
            this._sketch = v;
            if (v) v.parent = this;
            //if (this._sketch) this._sketch.evtUpdated.listen(this.onSketchUpdate);
            this.updated = true;
            //this.evtUpdated.trigger();
        }
    }

    // EVENT HANDLERS ------------------------------------------------------
    onSketchUpdate(evt) {
        // propagate update
        this.evtUpdated.trigger();
    }

    // METHODS -------------------------------------------------------------
    iupdate(ctx) {
        if (this._sketch && this._sketch.update) this.updated |= this._sketch.update(ctx);
        if (this.closeOnSketchDone && this.sketch.done) {
            console.log(`closing view due to sketch done`);
            this.destroy();
        }
        //if (this.model && this.model.tag === "player") console.log("panel updated: " + this.updated)
        return this.updated;
    }

    _render(ctx) {
        if (this._sketch && this._sketch.render) this._sketch.render(ctx, this.xform.minx, this.xform.miny);
    }

}