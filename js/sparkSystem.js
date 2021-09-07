export { SparkSystem };

import { System }           from "./base/system.js";
import { Mathf }            from "./base/math.js";
import { Store }            from "./base/store.js";
import { Fmt }              from "./base/fmt.js";
import { Base } from "./base/base.js";
import { Condition } from "./base/condition.js";

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
                console.log(`powering down relay: ${src} w/ id: ${srcid} from id: ${src.srcid}`);
                src.conditions.delete(Condition.powered);
                srcid = src.srcid;
                src.srcid = 0;
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
                    // relays can't power themselves...
                    if (obj.gid === e.srcid) {
                        continue;
                    }
                    obj.conditions.add(Condition.powered);
                    console.log(`powering up relay`);
                    obj.srcid = e.srcid;
                    hitRelay = true;
                }
                // -- sparkable
                if (obj.sparkable) {
                    obj.conditions.add(Condition.sparked);
                    if (obj.maxSparkTTL) obj.sparkTTL = obj.maxSparkTTL;
                    if (obj.morale) {
                        obj.morale.events.push("spark");
                    }
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
        // handle sparked objects
        if (e.conditions && e.conditions.has(Condition.sparked)) {
            // if spark has a timer...
            if (e.sparkTTL) {
                e.sparkTTL -= ctx.deltaTime;
                if (e.sparkTTL <= 0) {
                    e.sparkTTL = 0;
                    e.conditions.delete(Condition.sparked);
                }
            }
        }
    }

}