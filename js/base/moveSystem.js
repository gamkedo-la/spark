export { MoveSystem };

import { System }       from "./system.js";
import { Model }        from "./model.js";

class MoveSystem extends System {
    cpre(spec) {
        super.cpre(spec);
        spec.iterateTTL = spec.iterateTTL || 0;
        this.findOverlaps = spec.findOverlaps || ((v) => {return [];});
        spec.fixedPredicate = spec.fixedPredicate || ((e) => e.cat === "Model" && !e.passive);
    }

    // METHODS -------------------------------------------------------------
    iterate(ctx, e) {
        // skip non entities w/out position
        if (!Model.hasPos(e)) return;

        // does model have resolved position
        if (e.resx !== undefined && e.resy !== undefined) {
            //console.log(`==== ${e} has new pos: ${e.resx},${e.resy}`);
            e.x = e.resx;
            e.y = e.resy;
            e.resx = undefined;
            e.resy = undefined;
        }

        // determine movement speed... skip if not moving...
        let speed = (e.maxSpeed || 0) * (e.speed || 0);
        if (!speed) return;
        speed *= ctx.deltaTime;
        // determine desired position based on speed and heading
        let wantx = e.x + speed * Math.cos(e.heading);
        let wanty = e.y + speed * Math.sin(e.heading);
        if (wantx === e.x && wanty === e.y) {
            return;
        }
        // handle wanting new position
        e.wantx = wantx;
        e.wanty = wanty;
        //console.log(`==== ${e} from: ${e.x},${e.y} wants pos: ${e.wantx},${e.wanty} dt: ${ctx.deltaTime} speed: ${speed} heading: ${e.heading}`);

    }

}