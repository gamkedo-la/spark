export { InteractSystem };

import { System } from "./base/system.js";
import { Bounds } from "./base/bounds.js";
import { Vect } from "./base/vect.js";
import { Generator } from "./base/generator.js";
import { Base } from "./base/base.js";

class InteractSystem extends System {
    // CONSTRUCTOR ---------------------------------------------------------
    cpre(spec) {
        super.cpre(spec);
        spec.iterateTTL = spec.iterateTTL || 0;
    }
    cpost(spec) {
        super.cpost(spec);
        this.findOverlaps = spec.findOverlaps || ((v) => {return [];});
        this.assets = spec.assets || Base.instance.assets;
    }

    // PROPERTIES ----------------------------------------------------------

    // METHODS -------------------------------------------------------------
    dospark(ctx, e) {
        console.log("dospark");
        // spawn spark projectile at actor
        let xspark = Object.assign(
            this.assets.fromTag("spark"),
            {
                heading: e.heading,
                x: e.x,
                y: e.y,
                depth: e.depth,
                layer: e.layer,
            }
        );
        let spark = Generator.generate(xspark);
        console.log("spark: " + spark);
    }

    dointeract(ctx, e) {
        let ok = false;
        // check for objects within range...
        let bounds = new Bounds(e.x-e.interactRange, e.y-e.interactRange, e.interactRange+e.interactRange, e.interactRange+e.interactRange);
        //console.log(`${e} + checks: ${bounds} range: ${e.interactRange}`);
        //let objs = this.findOverlaps(bounds, (v) => (v.interactable && Vect.dist(e, v) <= e.interactRange));
        let objs = this.findOverlaps(bounds, (v) => {
            //console.log("consider: " + v);
            if (!v.interactable) return false;
            let d = Vect.dist(e, v);
            console.log("d: " + d);
            return (d <= e.interactRange);
        });
        for (const obj of objs) {
            // FIXME: add priority system to object interaction to drive which object gets interaction
            // FIXME: only attempt to interact w/ one object at a time
            console.log(`${e} interacts with: ${objs}`);
            obj.dointeract(e);
            ok = true;
        }
        return ok;
    }

    iterate(ctx, e) {
        // only match entities that are interacting...
        if (!e.interact) return;
        console.log("e.interact is true");
        e.interact = false;

        // attempt object interaction...
        if (this.dointeract(ctx, e)) return;

        // otherwise... attempt spark
        if (this.dospark(ctx, e)) return;


    }

}