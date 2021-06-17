export { SparkSystem };

import { System }           from "./base/system.js";
import { Mathf }            from "./base/math.js";

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
    /*
    cpost(spec) {
        super.cpost(spec);
    }
    */

    // PROPERTIES ----------------------------------------------------------

    // METHODS -------------------------------------------------------------
    iterateProjectile(ctx, e) {
        //console.log(`iterate projectile pos: ${e.x},${e.y}`);
        // check range
        let crange = Mathf.distance(e.x, e.y, e.origx, e.origy);
        console.log(`max range: ${e.range} current range: ${crange} orig: ${e.origx},${e.origy}`);
        if (crange >= e.range) {
            console.log("at max range...");
            // at max distance, destroy
            e.destroy();
        }
    }


    iterate(ctx, e) {
        // handle
        if (e.tag === "spark") this.iterateProjectile(ctx, e);
    }

}