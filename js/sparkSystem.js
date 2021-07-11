export { SparkSystem };

import { System }           from "./base/system.js";
import { Mathf }            from "./base/math.js";
import { Store }            from "./base/store.js";
import { Fmt }              from "./base/fmt.js";
import { Base } from "./base/base.js";
import { Condition } from "./base/condition.js";

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
        spec.fixedPredicate = spec.fixedPredicate || ((e) => e.cat === "Model" && !e.passive);
    }
    cpost(spec) {
        super.cpost(spec);
        this.sparkSources = spec.sparkSources || new Store();
        this.getentities = spec.getentities || (() => Base.instance.entities);
    }

    // PROPERTIES ----------------------------------------------------------
    get entities() {
        return this.getentities();
    }

    // EVENT HANDLERS ------------------------------------------------------

    // METHODS -------------------------------------------------------------
    breakSparkChain(spark) {
        // look up src
        let srcid = spark.srcid;
        while (srcid) {
            let src = this.entities.get(srcid);
            if (!src) break;
            // if source was a relay... power it down
            if (src.relay) {
                console.log(`powering down relay: ${src}`);
                src.conditions.delete(Condition.powered);
                srcid = src.srcid;
            // source not a relay, we are done...
            } else {
                break;
            }
        }
    }

    iterateProjectile(ctx, e) {
        // check range
        let crange = Mathf.distance(e.x, e.y, e.origx, e.origy);
        if (crange >= e.range) {
            // we didn't hit anything... break spark chain
            this.breakSparkChain(e);
            // at max distance, destroy
            e.destroy();
        }
        // check for collisions
        if (e.collision) {
            // what did we hit?
            let hitRelay = false;
            for (const id of (e.collisionIds || [])) {
                let obj = this.entities.get(id);
                if (!obj) continue;
                // -- relay
                if (obj.relay) {
                    obj.conditions.add(Condition.powered);
                    console.log(`powering up relay`);
                    obj.srcid = e.srcid;
                    hitRelay = true;
                }
                // -- sparkable
                if (obj.sparkable) {
                    obj.conditions.add(Condition.sparked);
                }
                console.log(`spark collided w: ${id}:${obj}`);
            }
            // if we did not hit a relay, spark chain is broken
            if (!hitRelay) this.breakSparkChain(e);
            e.destroy();
        }
    }

    iterateSource(ctx, e) {
        // discovery
        if (!this.sparkSources.contains(e)) {
            if (this.dbg) console.log(`spark system discovered base: ${e}`);
            this.sparkSources.add(e);
        }
    }

    iterate(ctx, e) {
        // handle
        if (e.tag === "spark") this.iterateProjectile(ctx, e);
        if (e.cls === "SparkBase" || e.relay) this.iterateSource(ctx, e);
    }

}