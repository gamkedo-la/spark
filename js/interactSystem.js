export { InteractSystem };

import { System } from "./base/system.js";
import { Bounds } from "./base/bounds.js";
import { Vect } from "./base/vect.js";
import { Generator } from "./base/generator.js";
import { Base } from "./base/base.js";
import { Store } from "./base/store.js";
import { Condition } from "./base/condition.js";
import { Mathf } from "./base/math.js";
import { SparkAction } from "./base/action.js";
import { WaitAction } from "./actions/wait.js";
import { Atts } from "./base/atts.js";
import { SparkDialog } from "./sparkDialog.js";
import { Dialog } from "./base/dialog.js";
import { Event } from "./base/event.js";

class InteractSystem extends System {
    // CONSTRUCTOR ---------------------------------------------------------
    cpre(spec) {
        super.cpre(spec);
        spec.iterateTTL = spec.iterateTTL || 0;
        spec.fixedPredicate = spec.fixedPredicate || ((e) => e.cat === "Model" && e.ctrlId);
    }
    cpost(spec) {
        super.cpost(spec);
        this.findOverlaps = spec.findOverlaps || ((v) => {return [];});
        this.sparkSources = spec.sparkSources || new Store();
        this.assets = spec.assets || Base.instance.assets;
        this.getentities = spec.getentities || (() => Base.instance.entities);
        this.interactPriorities = [
            "leave",
            "talk",
            "open",
            "push",
            "occupy",
            "spark",
        ];
        this.eventQ = spec.eventQ || Atts.gameEventQ;
        this.interactAction = "none";
        this.interactTarget = undefined;
        this.sparkTarget = undefined;
        this.lastx = {};
        this.lasty = {};
        this.recheck = true;
    }

    // PROPERTIES ----------------------------------------------------------
    get entities() {
        return this.getentities();
    }

    get interactAction() {
        return Atts.interactAction;
    }

    set interactAction(v) {
        Atts.interactAction = v;
    }

    // METHODS -------------------------------------------------------------
    dospark(ctx, e) {
        // check for actor spark condition
        if (e.conditions.has(Condition.sparked)) {
            //console.log("already sparked");
            return;
        }
        // spark will be executed as an actor action...
        e.conditions.add(Condition.cast);
        let actions = [];
        // -- wait for animation to complete
        actions.push(new WaitAction({ttl: 400}));
        // -- cast the spark
        actions.push(new SparkAction({src: this.sparkTarget}));
        e.actions = actions;

    }

    // check for possible interactions between player (e) and nearby objects
    checkinteract(ctx, e) {
        // check if entity is currently occupying target
        if (e.occupyId) {
            if (this.interactAction !== "leave") {
                this.interactAction = "leave";
                this.interactTarget = this.entities.get(e.occupyId);
                //console.log(`set interactAction: ${this.interactAction} target: ${this.interactTarget}`);
            }
            return;
        }

        // reset interact action/target
        let action = "none";
        let target = undefined;

        // check for interactable objects within range...
        let bounds = new Bounds(e.x-e.interactRange, e.y-e.interactRange, e.interactRange+e.interactRange, e.interactRange+e.interactRange);
        let objs = this.findOverlaps(bounds, (v) => {
            if (!v.interactTag) return false;
            let d = Vect.dist(e, v);
            return (d <= e.interactRange);
        });
        // find best target based on interact priority
        let bestPriority = this.interactPriorities.length;
        let bestRange = e.interactRange;
        for (const obj of objs) {
            let pri = this.interactPriorities.indexOf(obj.interactTag);
            if (pri === -1) {
                console.error(`unknown interact tag: ${obj.interactTag} on object: ${obj}, skipping`);
                continue;
            }
            // check against current priority
            if (pri < bestPriority) {
                bestPriority = pri;
                bestRange = Vect.dist(e, obj);
                action = obj.interactTag;
                target = obj;
            // for equal priority, check range
            } else if (pri === bestPriority) {
                let range = Vect.dist(e, obj);
                if (range < bestRange) {
                    bestPriority = pri;
                    bestRange = Vect.dist(e, obj);
                    action = obj.interactTag;
                    target = obj;
                }
            }
        }

        if (action !== this.interactAction || target !== this.interactTarget) {
            this.interactTarget = target;
            this.interactAction = action;
            //console.log(`set interactAction: ${this.interactAction} target: ${this.interactTarget}`);
        }
    }

    // check if player (e) is within range of active spark base or relay
    checkspark(ctx, e) {
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
            // ensure player has enlightened condition
            if (e.conditions.has(Condition.enlightened)) {
                //console.log(`actor ${e} lost enlightened condition`);
                e.conditions.delete(Condition.enlightened);
            }
            return;
        }

        // otherwise, player is within range
        this.sparkTarget = best;
        // is action assigned?
        if (this.interactAction === "none") this.interactAction = "spark";

        // ensure player has enlightened condition
        if (!e.conditions.has(Condition.enlightened)) {
            //console.log(`actor ${e} gained enlightened condition`);
            e.conditions.add(Condition.enlightened);
        }

    }

    dointeract(ctx, e) {
        switch (this.interactAction) {
            case "none":
                break;
            case "spark":
                if (this.sparkTarget) {
                    this.dospark(ctx, e);
                }
                break;
            case "talk":
                if (this.interactTarget) {
                    let xdialog = undefined;
                    for (const dinfo of this.interactTarget.xdialogs) {
                        if (dinfo.predicate(e, this.interactTarget)) {
                            xdialog = { 
                                dialogs: dinfo.dialogs,
                                actor: e,
                                npc: this.interactTarget,
                                dfltTitle: this.interactTarget.name,
                            }
                            this.eventQ.push(new Event("npc.dialog", {actor: e, target: this.interactTarget, dialog: new Dialog(xdialog)}));
                            break;
                        }
                    }
                }
                break;
            default:
                if (this.interactTarget) {
                    this.interactTarget.dointeract(e);
                }
        }
        this.recheck = true;
    }

    iterate(ctx, e) {
        // check for changes to actor state
        //if (this.recheck || this.lastx[e.gid] !== e.x || this.lasty[e.gid] !== e.y) {
            //this.recheck = false;
            //this.lastx[e.gid] = e.x;
            //this.lasty[e.gid] = e.y;
            this.checkinteract(ctx, e);
            this.checkspark(ctx, e);
        //}

        // handle actor wanting to interact
        if (!e.interact) return;
        e.interact = false;

        // attempt interaction based on set interactAction and interactTarget/sparkTarget
        this.dointeract(ctx, e);

    }

}