export { InteractSystem };

import { System } from "./base/system.js";
import { Bounds } from "./base/bounds.js";
import { Vect } from "./base/vect.js";
import { Generator } from "./base/generator.js";
import { Base } from "./base/base.js";
import { Store } from "./base/store.js";
import { Condition } from "./base/condition.js";
import { Mathf } from "./base/math.js";

class InteractSystem extends System {
    // CONSTRUCTOR ---------------------------------------------------------
    cpre(spec) {
        super.cpre(spec);
        spec.iterateTTL = spec.iterateTTL || 0;
    }
    cpost(spec) {
        super.cpost(spec);
        this.findOverlaps = spec.findOverlaps || ((v) => {return [];});
        this.sparkSources = spec.sparkSources || new Store();
        this.assets = spec.assets || Base.instance.assets;
    }

    // PROPERTIES ----------------------------------------------------------

    // METHODS -------------------------------------------------------------
    dospark(ctx, e) {
        console.log("dospark");
        // check for actor spark condition
        if (e.conditions.has(Condition.sparked)) {
            console.log("already sparked");
            return;
        }

        // check for spark source
        let best = undefined;
        let bestRange = undefined;
        for (const src of this.sparkSources) {
            // check for powered
            if (!src.conditions.has(Condition.powered)) continue;
            // distance from source to actor
            let dist = Mathf.distance(e.x, e.y, src.x, src.y);
            // actor in range?
            if (dist > src.range) continue;
            if (!best || dist < bestRange) {
                best = src;
                bestRange = dist;
            }
        }
        if (!best) {
            console.log("not in range");
            return;
        }

        // spawn spark projectile at actor
        let xspark = Object.assign(
            this.assets.fromTag("spark"),
            {
                heading: e.heading,
                x: e.x,
                y: e.y,
                depth: e.depth,
                layer: e.layer,
                srcid: best.gid,
            }
        );
        let spark = Generator.generate(xspark);

        // apply condition to source
        // -- cleared when spark is destroyed
        best.conditions.add(Condition.sparked);
        spark.evtDestroyed.listen((evt) => best.conditions.delete(Condition.sparked));

        // apply condition to actor
        // -- cleared when spark is destroyed
        e.conditions.add(Condition.sparked);
        spark.evtDestroyed.listen((evt) => e.conditions.delete(Condition.sparked));

        console.log("spark: " + spark);
    }

    dointeract(ctx, e) {
        let ok = false;
        // FIXME: handle approaches
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
            console.log(`${e} interacts with: ${obj}`);
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