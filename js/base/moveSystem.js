export { MoveSystem, SetPosFeat };

import { System }       from "./system.js";
import { Feat }         from "./feat.js";
import { Model }        from "./model.js";
import { Bounds }       from "./bounds.js";
import { ModelState } from "./modelState.js";

class SetPosFeat extends Feat {
    constructor(target, x, y) {
        super();
        this.target = target;
        this.x = x;
        this.y = y;
    }
    execute() {
        if (this.target) {
            this.target.x = this.x;
            this.target.y = this.y;
        }
    }
}

class SetStateFeat extends Feat {
    constructor(target, state) {
        super();
        this.target = target;
        this.state = state;
    }
    execute() {
        if (this.target) this.target.state = this.state;
    }
}

class MoveSystem extends System {
    cpre(spec) {
        super.cpre(spec);
        spec.iterateTTL = spec.iterateTTL || 0;
        this.findOverlaps = spec.findOverlaps || ((v) => {return [];});
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
        let wantx = Math.round(e.x + speed * Math.cos(e.heading));
        let wanty = Math.round(e.y + speed * Math.sin(e.heading));
        if (wantx === e.x && wanty === e.y) {
            return;
        }
        // handle wanting new position
        e.wantx = wantx;
        e.wanty = wanty;
        //console.log(`==== ${e} wants pos: ${e.wantx},${e.wanty}`);
       

    }

}