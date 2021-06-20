export { CollisionSystem };

import { System }       from "./system.js";
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
        let actorWantsActivation = (e.doactivate !== undefined);
        let actorWantsCollision = (e.docollision !== undefined);
        let actorActivation = undefined;
        let actorCollision = undefined;

        if (e.collider) {
            let dx = resx - e.x;
            let dy = resy - e.y;
            let corx = 0;
            let cory = 0;
            // -- x axis
            if (dx) {
                let xbounds = new Bounds(e.collider.minx+dx, e.collider.miny, e.collider.width, e.collider.height);
                //console.log(`dx: ${dx} xbounds: ${xbounds} vs collider: ${e.collider}`);
                for (const other of this.findOverlaps(xbounds, (v) => (v !== e && (v.activator || v.collider) && v.layer === e.layer))) {
                    // check overlaps w/ any activators
                    let overlap = xbounds.overlaps(other.activator);
                    if (overlap) {
                        // trigger activation
                        if (other.doactivate && !activations.includes(other)) other.doactivate(e, overlap);
                        if (other.doactivate || actorWantsActivation) activations.push(other);
                        // store actor activation state
                        if (actorWantsActivation) actorActivation = Bounds.newOrExtend(actorActivation, overlap);
                    }
                    // check overlap w/ any colliders
                    if (other.collider.blocking & e.collider.blocking) {
                        overlap = xbounds.overlaps(other.collider);
                        if (overlap) {
                            // trigger collision
                            if (!collisions.includes(other)) {
                                if (other.docollision) other.docollision(e, overlap);
                                collisions.push(other);
                            }
                            // handle blocking collision
                            // -- moving right
                            if (dx > 0) {
                                corx = Math.min(corx, overlap.minx-xbounds.maxx);
                                //resx -= (xbounds.maxx - overlap.minx);
                            // -- moving left
                            } else {
                                corx = Math.max(corx, overlap.maxx-xbounds.minx);
                                //resx += (overlap.maxx - xbounds.minx);
                            }
                            //console.log(`xbounds: ${xbounds} overlaps w: ${other.collider} overlap: ${overlap} resx: ${resx}`);
                            // store actor collision state
                            actorCollision = Bounds.newOrExtend(actorCollision, overlap);
                        }
                    }
                }
                resx += corx;
            }
            // -- y axis
            if (dy) {
                let ybounds = new Bounds(e.collider.minx, e.collider.miny+dy, e.collider.width, e.collider.height);
                for (const other of this.findOverlaps(ybounds, (v) => (v !== e && (v.activator || v.collider) && v.layer === e.layer))) {
                    // check overlaps w/ any activators
                    let overlap = ybounds.overlaps(other.activator);
                    if (overlap) {
                        // trigger activation
                        if (other.doactivate && !activations.includes(other)) other.doactivate(e, overlap);
                        if (other.doactivate || actorWantsActivation) activations.push(other);
                        // store actor activation state
                        if (actorWantsActivation) actorActivation = Bounds.newOrExtend(actorActivation, overlap);
                    }
                    // check overlap w/ any colliders
                    if (other.collider.blocking & e.collider.blocking) {
                        overlap = ybounds.overlaps(other.collider);
                        if (overlap) {
                            // trigger collision
                            if (!collisions.includes(other)) {
                                if (other.docollision) other.docollision(e, overlap);
                                collisions.push(other);
                            }
                            // handle movement restriction
                            // -- moving down
                            if (dy > 0) {
                                cory = Math.min(cory, overlap.miny-ybounds.maxy);
                                //resx -= (xbounds.maxx - overlap.minx);
                                //resy -= (ybounds.maxy - overlap.miny);
                            // -- moving up
                            } else {
                                cory = Math.max(cory, overlap.maxy-ybounds.miny);
                                //resx += (overlap.maxx - xbounds.minx);
                                //resy += (overlap.maxy - ybounds.miny);
                            }
                            // store actor collision state
                            actorCollision = Bounds.newOrExtend(actorCollision, overlap);
                        }
                    }
                }
                resy += cory;
            }

            // collision/activation logic for moving object
            if (actorWantsActivation && activations.length) {
                for (const other in activations) {
                    e.doactivate(other, actorActivation);
                }
            }
            if (actorWantsCollision && collisions.length) {
                for (const other in collisions) {
                    e.docollision(other, actorCollision);
                }
            }
            e.collision = actorCollision;
            if (collisions.length) {
                e.collisionIds = collisions.map(v => v.gid);
            }

        }


        // resolve position
        e.resx = resx;
        e.resy = resy;
        e.wantx = undefined;
        e.wanty = undefined;

    }

}