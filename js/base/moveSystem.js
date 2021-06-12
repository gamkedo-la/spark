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
            //if (e.state === ModelState.walk) e.state = ModelState.idle;
            return;
        }
        // handle model state
        //if (e.state !== ModelState.walk) {
            //console.log("setting state to walk");
            //e.state = ModelState.walk;
        //}
        e.wantx = wantx;
        e.wanty = wanty;

        /*
        // check for collisions
        if (e.collider) {
            let dx = wantx - e.x;
            let dy = wanty - e.y;
            // -- x axis
            if (dx) {
                let xbounds = new Bounds(e.collider.minx+dx, e.collider.miny, e.collider.width, e.collider.height);
                for (const other of this.findOverlaps(xbounds, (v) => (v !== e && v.collider && v.collider.blocking))) {
                    // determine overlap...
                    let overlap = xbounds.overlaps(other.collider);
                    if (overlap) {
                        // moving right
                        if (dx > 0) {
                            wantx -= (xbounds.maxx - overlap.minx);
                        // moving left
                        } else {
                            wantx += (overlap.maxx - xbounds.minx);
                        }
                    }
                }
            }
            // -- y axis
            if (dy) {
                let ybounds = new Bounds(e.collider.minx, e.collider.miny+dy, e.collider.width, e.collider.height);
                for (const other of this.findOverlaps(ybounds, (v) => (v !== e && v.collider && v.collider.blocking))) {
                    // determine overlap...
                    let overlap = ybounds.overlaps(other.collider);
                    //console.log(`dy: ${dy} e.c: ${e.collider.miny},${e.collider.maxy}, ybounds: ${ybounds.miny},${ybounds.maxy} other: ${other.miny},${other.maxy} overlap: ${overlap.miny},${overlap.maxy}`);
                    //console.log("other: " + other);
                    if (overlap) {
                        // moving down
                        if (dy > 0) {
                            wanty -= (ybounds.maxy - overlap.miny);
                        // moving up
                        } else {
                            wanty += (overlap.maxy - ybounds.miny);
                        }
                    }
                }
            }


        }

        // handle change of position
        this.feats.push(new SetPosFeat(e, wantx, wanty));
        */
        /*
        // state management
        const state = e.state;
        if (state) {
            let isMoving = ctrl.xaxis || ctrl.yaxis;
            let wantState = "dflt";
            if (isMoving) {
                if (ctrl.xaxis > 0 && ctrl.xaxis >= Math.abs(ctrl.yaxis)) {
                    wantState = "walkEast";
                } else if (ctrl.xaxis < 0 && -ctrl.xaxis >= Math.abs(ctrl.yaxis)) {
                    wantState = "walkWest";
                } else if (ctrl.yaxis > 0) {
                    wantState = "walkSouth";
                } else {
                    wantState = "walkNorth";
                }
            }
            if (wantState !== state.value) {
                //console.log("wantState: " + wantState);
                this._feats.push(new SetStateFeat(e, wantState));
            }
        }
        */
       

    }

}