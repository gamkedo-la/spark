export { InteractSystem };

import { System } from "./base/system.js";
import { Bounds } from "./base/bounds.js";
import { Vect } from "./base/vect.js";

class InteractSystem extends System {
    // CONSTRUCTOR ---------------------------------------------------------
    cpre(spec) {
        super.cpre(spec);
        spec.iterateTTL = spec.iterateTTL || 0;
    }
    cpost(spec) {
        super.cpost(spec);
        this.findOverlaps = spec.findOverlaps || ((v) => {return [];});
    }

    // PROPERTIES ----------------------------------------------------------

    // METHODS -------------------------------------------------------------
    iterate(ctx, e) {
        // only match entities that are interacting...
        if (!e.interact) return;
        console.log("e.interact is true");
        e.interact = false;
        // check for objects within range...
        let bounds = new Bounds(e.x-e.interactRange, e.y-e.interactRange, e.interactRange+e.interactRange, e.interactRange+e.interactRange);
        //console.log(`${e} + checks: ${bounds} range: ${e.interactRange}`);
        let objs = this.findOverlaps(bounds, (v) => (v.interactable && Vect.dist(e, v) <= e.interactRange));
        /*
        let objs = this.findOverlaps(bounds, (v) => {
            if (!v.interactable) return false;
            let d = Vect.dist(e, v);
            console.log("d: " + d);
            return (d <= e.interactRange);
        });
        */
        for (const obj of objs) {
            console.log(`${e} interacts with: ${objs}`);
            obj.dointeract(e);
        }
    }

}