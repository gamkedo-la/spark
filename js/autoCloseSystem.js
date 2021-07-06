export { AutoCloseSystem };

import { System }           from "./base/system.js";
import { Bounds }           from "./base/bounds.js";
import { Vect }             from "./base/vect.js";
import { ModelState }       from "./base/modelState.js";
import { Util }             from "./base/util.js";

class AutoCloseSystem extends System {
    // CONSTRUCTOR ---------------------------------------------------------
    cpre(spec) {
        super.cpre(spec);
        spec.iterateTTL = spec.iterateTTL || 100;
        spec.fixedPredicate = spec.fixedPredicate || ((e) => e.cat === "Model" && !e.passive);
    }
    cpost(spec) {
        super.cpost(spec);
        this.findOverlaps = spec.findOverlaps || ((v) => {return [];});
    }

    // PROPERTIES ----------------------------------------------------------

    // METHODS -------------------------------------------------------------
    iterate(ctx, e) {
        // only match entities that are autoclose and currently open
        if (!e.autoClose || !e.interactRange || e.state !== ModelState.open) return;
        //console.log("autoclose consider: " + e);
        let range = e.interactRange;
        // check for actors within range
        let bounds = new Bounds(e.x-range, e.y-range, range+range, range+range);
        let objs = this.findOverlaps(bounds, (v) => (v.actor && Vect.dist(e, v) <= e.interactRange));
        if (Util.empty(objs)) {
            e.close();
        }
    }

}