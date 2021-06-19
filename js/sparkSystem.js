export { SparkSystem };

import { System }           from "./base/system.js";
import { Mathf }            from "./base/math.js";
import { Store }            from "./base/store.js";

/*
import { Bounds }           from "./base/bounds.js";
import { Vect }             from "./base/vect.js";
import { ModelState }       from "./base/modelState.js";
import { Util }             from "./base/util.js";
*/

class SparkSystem extends System {
    // CONSTRUCTOR ---------------------------------------------------------
    cpre(spec) {
        super.cpre(spec);
        spec.iterateTTL = spec.iterateTTL || 0;
    }
    cpost(spec) {
        super.cpost(spec);
        this.sparkBases = spec.sparkBases || new Store();
    }

    // PROPERTIES ----------------------------------------------------------

    // EVENT HANDLERS ------------------------------------------------------

    // METHODS -------------------------------------------------------------
    iterateProjectile(ctx, e) {
        // check range
        let crange = Mathf.distance(e.x, e.y, e.origx, e.origy);
        if (crange >= e.range) {
            // at max distance, destroy
            e.destroy();
        }
    }

    iterateBase(ctx, e) {
        // discovery
        if (!this.sparkBases.contains(e)) {
            if (this.dbg) console.log(`spark system discovered base: ${e}`);
            this.sparkBases.add(e);
        }
    }

    iterate(ctx, e) {
        // handle
        if (e.tag === "spark") this.iterateProjectile(ctx, e);
        if (e.cls === "SparkBase") this.iterateBase(ctx, e);
    }

}