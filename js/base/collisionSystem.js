export { CollisionSystem };

import { System }       from "./system.js";
import { Model }        from "./model.js";
import { Bounds }       from "./bounds.js";

class CollisionSystem extends System {
    cpre(spec) {
        super.cpre(spec);
        spec.iterateTTL = spec.iterateTTL || 0;
        this.findOverlaps = spec.findOverlaps || ((v) => {return [];});
    }

    // METHODS -------------------------------------------------------------
    iterate(ctx, e) {
        // skip entities that are not seeking new position
        if (e.wantx === undefined || e.wanty === undefined) return;
        let resx = e.wantx;
        let resy = e.wanty;

        // check for collisions
        let activations = [];
        let collisions = [];
        if (e.collider) {
            let dx = resx - e.x;
            let dy = resy - e.y;
            // -- x axis
            if (dx) {
                let xbounds = new Bounds(e.collider.minx+dx, e.collider.miny, e.collider.width, e.collider.height);
                for (const other of this.findOverlaps(xbounds, (v) => (v !== e && (v.activator || v.collider) && v.layer === e.layer))) {
                    // check overlaps w/ any activators
                    let overlap = xbounds.overlaps(other.activator);
                    if (overlap) {
                        // trigger collision
                        if (other.doactivate && !activations.includes(other)) {
                            activations.push(other);
                            other.doactivate(e, overlap);
                        }
                    }
                    // check overlap w/ any colliders
                    overlap = xbounds.overlaps(other.collider);
                    if (overlap) {
                        // trigger collision
                        if (other.docollision && !collisions.includes(other)) {
                            collisions.push(other);
                            other.docollision(e, overlap);
                        }
                        // handle blocking collision
                        if (other.collider.blocking) {
                            // moving right
                            if (dx > 0) {
                                resx -= (xbounds.maxx - overlap.minx);
                            // moving left
                            } else {
                                resx += (overlap.maxx - xbounds.minx);
                            }
                        }
                    }
                }
            }
            // -- y axis
            if (dy) {
                let ybounds = new Bounds(e.collider.minx, e.collider.miny+dy, e.collider.width, e.collider.height);
                for (const other of this.findOverlaps(ybounds, (v) => (v !== e && (v.activator || v.collider) && v.layer === e.layer))) {
                    // check overlaps w/ any activators
                    let overlap = ybounds.overlaps(other.activator);
                    if (overlap) {
                        // trigger collision
                        if (other.doactivate && !activations.includes(other)) {
                            activations.push(other);
                            other.doactivate(e, overlap);
                        }
                    }
                    // check overlap w/ any colliders
                    overlap = ybounds.overlaps(other.collider);
                    if (overlap) {
                        // trigger collision
                        if (other.docollision && !collisions.includes(other)) {
                            collisions.push(other);
                            other.docollision(e, overlap);
                        }
                        // handle blocking collision
                        if (other.collider.blocking) {
                            // moving down
                            if (dy > 0) {
                                resy -= (ybounds.maxy - overlap.miny);
                            // moving up
                            } else {
                                resy += (overlap.maxy - ybounds.miny);
                            }
                        }
                    }
                }
            }


        }


        // resolve position
        e.resx = resx;
        e.resy = resy;
        e.wantx = undefined;
        e.wanty = undefined;

    }

}