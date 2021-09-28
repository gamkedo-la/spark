export { Workstation };

import { Direction }        from "./base/dir.js";
import { Model }            from "./base/model.js";
import { Condition }        from "./base/condition.js";
import { LevelNode }        from "./lvlGraph.js";
import { Fmt } from "./base/fmt.js";

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
        this.actorCondition = spec.actorCondition || Condition.working;
        // -- interactable
        this.interactable = true;
        // -- owner tag
        this.ownerTag = spec.ownerTag;
        // -- actor id (actor who's currently occupying)
        this.actorId = 0;
        // shop variables
        this.closedCondition = spec.closedCondition || Condition.closed;
        // defaults to closed condition
        this.conditions.add(this.closedCondition);
        //console.log(`workstation spec: ${Fmt.ofmt(spec)}`);
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
        if (this.conditions.has(this.occupiedCondition)) {
            if (actor.gid === this.actorId) this.leave(actor);
        } else {
            this.occupy(actor);
        }
    }

    occupy(actor) {
        // update chair state
        this.conditions.add(this.occupiedCondition);
        this.offx = this.occupiedX;
        this.offy = this.occupiedY;
        this.actorSavedX = actor.x;
        this.actorSavedY = actor.y;
        this.actorId = actor.gid;
        // update actor state
        actor.conditions.add(this.actorCondition);
        actor.x = this.x + this.occupiedOffX;
        actor.y = this.y + this.occupiedOffY;
        actor.heading = Direction.asHeading(this.occupiedDir);
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
        actor.updated = true;
        actor.occupyId = 0;
    }

}