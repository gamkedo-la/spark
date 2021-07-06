export { AreaSystem };

import { Level }            from "../lvl.js";
import { Area }             from "./area.js";
import { Base } from "./base.js";
import { System }           from "./system.js";

class AreaSystem extends System {

    cpre(spec) {
        super.cpre(spec);
        spec.fixedPredicate = spec.fixedPredicate || ((e) => e.cat === "Model" && !e.passive);
    }
    cpost(spec) {
        super.cpost(spec);
        this.activeAreas = [];
        this.discoveredAreas = [];
        this.first = true;
        this.getEntities = spec.getEntities || (() => Base.instance.entities);
    }

    get entities() {
        return this.getEntities();
    }

    iterate(ctx, e) {
        //console.log(this + "iterate on " + e);
        // handle area entities
        if (e.active && e instanceof(Area)) {
            // discover areas
            this.discoveredAreas.push(e);
        }

        // compare given entity to check for overlap with active areas
        if (e.cat !== "Model") return;
        if (e instanceof(Area)) return;
        if (e instanceof(Level)) return;
        for(const area of this.activeAreas) {
            if (area.layer !== undefined && area.layer !== e.layer) continue;
            if ((area.overlaps(e) || area.contains(e)) && !area.includes(e.gid)) {
                if (this.dbg && !this.first) console.log(`${e} entered area: ${area}`);
                area.add(e);
            }
        }

    }

    postiterate(ctx) {
        // first iteration... 
        let first = this.first;
        if (this.activeAreas.length > 0) this.first = false;
        // resolve active areas
        this.activeAreas = this.discoveredAreas;
        this.discoveredAreas = [];
        // resolve non-visible areas and passive object inclusion
        let nonvis = [];
        for (const area of this.activeAreas) {
            // check for always-"visible" actors
            if (area.getCount("visible")) {
                for (const link of area.links) {
                    if (!nonvis.includes(link)) nonvis.push(link);
                }
            }
            // first time only... check for passive tiles
            if (first) {
                for (const e of this.entities.find((v) => v.cat === "Model" && v.passive, false)) {
                    if (area.layer !== undefined && area.layer !== e.layer) continue;
                    if ((area.overlaps(e) || area.contains(e)) && !area.includes(e.gid)) {
                        if (this.dbg && !this.first) console.log(`${e} entered area: ${area}`);
                        area.add(e);
                    }
                }
            }
        }
        // trigger visibility for all areas
        for (const area of this.activeAreas) {
            // area marked as visible, but should be invisible
            if (nonvis.includes(area.tag) && area.visible) {
                area.visible = false;
                for (const obj of area) {
                    obj.visible = false;
                    if (obj.passive) {
                        obj.evtUpdated.trigger();
                        //console.log("triggering update");
                    }
                }
            // area marked as invisible, but should be visible
            } else if (!nonvis.includes(area.tag) && !area.visible) {
                area.visible = true;
                for (const obj of area) {
                    obj.visible = true;
                    if (obj.passive) obj.evtUpdated.trigger();
                }
            }
        }
        super.postiterate(ctx);
    }

}