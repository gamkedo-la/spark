export { AreaSystem };

import { Level }            from "../lvl.js";
import { Area }             from "./area.js";
import { System }           from "./system.js";


class AreaSystem extends System {

    constructor(spec={}) {
        super(spec);
        this.activeAreas = [];
        this.discoveredAreas = [];
    }

    iterate(ctx, e) {
        //console.log(this + "iterate on " + e);
        // handle area entities
        if (e.active && e instanceof(Area)) {
            // discover areas
            this.discoveredAreas.push(e);
            /*
            // check if area is active, and if so, check all entities bound by area to see if they are still contained within area
            if (this.activeAreas.includes(e)) {
                const contents = e.contents || [];
                for (const actorid of contents) {
                    const actor = this._gmgr.find(actorid);
                    if (!actor || !e.bounds.overlaps(actor.bounds)) {
                        this._feats.push(new AreaLeaveFeat(e, actor, this._gmgr.evtc));
                    }
                }
            }
            */
        }

        //console.log("e: " + e);

        // compare given entity to check for overlap with active areas
        // skip non-motile entities
        //if (!Filter.motile(e)) return;
        if (e.cat !== "Model") return;
        if (e instanceof(Area)) return;
        if (e instanceof(Level)) return;
        for(const area of this.activeAreas) {
            if (area.layer !== undefined && area.layer !== e.layer) continue;
            if ((area.overlaps(e) || area.contains(e)) && !area.includes(e.gid)) {
                //console.log(`${e} entered area: ${area}`);
                area.add(e);
            }
        }
    }

    postiterate(ctx) {
        // resolve active areas
        this.activeAreas = this.discoveredAreas;
        this.discoveredAreas = [];
        // resolve non-visible areas
        let nonvis = [];
        for (const area of this.activeAreas) {
            if (area.getCount("visible")) {
                for (const link of area.links) {
                    if (!nonvis.includes(link)) nonvis.push(link);
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
                }
            // area marked as invisible, but should be visible
            } else if (!nonvis.includes(area.tag) && !area.visible) {
                area.visible = true;
                for (const obj of area) {
                    obj.visible = true;
                }
            }
        }
        super.postiterate(ctx);
    }

}