export { Workstation };

import { Model }            from "./base/model.js";
import { LevelNode } from "./lvlGraph.js";

class Workstation extends Model {

    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this._offsets = [];
        if (spec.approachOffsets) {
            this.approachOffsets = spec.approachOffsets;
        } else if (spec.approachMask) {
            this.approachMask = spec.approachMask;
        }
        // actor state
        this.actorSavedX = 0;
        this.actorSavedY = 0;
        // -- occupied offset
        this.occupiedOffX = spec.occupiedOffX || 0;
        this.occupiedOffY = spec.occupiedOffY || 0;
        // -- occupied direction
        this.occupiedDir = spec.occupiedDir || Direction.south;
        // -- conditions
        this.occupiedCondition = spec.occupiedCondition || Condition.occupied;
        this.actorCondition = spec.actorCondition || Condition.asleep;
        // -- interactable
        this.interactable = true;
        // -- reservation tag
        this.reserveTag = spec.reserveTag;
        // -- actor id (actor who's currently occupying)
        this.actorId = 0;
    }

    get approaches() {
        if (this.approachOffsets) {
            return this.approachOffsets.map((v) => new LevelNode(this.x+v.x, this.y+v.y, this.layer));
        } else if (this.approachMask) {
            return Direction.all.filter((v) => (v & this.approachMask)).map((v) => new LevelNode(Direction.applyToX(this.x, v), Direction.applyToY(this.y, v), this.layer));
        } else {
            return [new LevelNode(this.x, this.y, this.layer)];
        }
    }

    dointeract(actor) {
        console.log(this + " dointeract");
        if (this.conditions.has(this.occupiedCondition)) {
            this.leave(actor);
        } else {
            this.occupy(actor);
        }
    }

    occupy(actor) {
        console.log(`${this} occupy actor: ${actor}`);
        // update chair state
        this.conditions.add(this.occupiedCondition);
        this.offx = this.occupiedX;
        this.offy = this.occupiedY;
        this.actorSavedX = actor.x;
        this.actorSavedY = actor.y;
        this.actorSavedDepth = actor.depth;
        this.actorId = actor.gid;
        // update actor state
        actor.conditions.add(this.actorCondition);
        actor.x = this.x + this.occupiedOffX;
        actor.y = this.y + this.occupiedOffY;
        actor.heading = Direction.asHeading(this.occupiedDir);
        if (actor.depth <= this.depth) actor.depth = this.depth+1;
        actor.updated = true;
        actor.occupyId = this.gid;
    }

    leave(actor) {
        console.log(`${this} leave actor: ${actor}`);
        // update chair state
        this.conditions.delete(this.occupiedCondition);
        this.offx = this.emptyX;
        this.offy = this.emptyY;
        this.actorId = 0;
        // update actor state
        actor.conditions.delete(this.actorCondition)
        actor.x = this.actorSavedX;
        actor.y = this.actorSavedY;
        actor.depth = this.actorSavedDepth;
        actor.updated = true;
        actor.occupyId = 0;
    }

}