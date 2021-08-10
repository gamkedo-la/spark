export { Stock };

import { Model }            from "./base/model.js";
import { ModelState }       from "./base/modelState.js";
import { Direction }        from "./base/dir.js";
import { LevelNode }        from "./lvlGraph.js";
import { Condition }        from "./base/condition.js";
import { LeaveAction } from "./actions/leave.js";
import { WorkTimer } from "./dirtySystem.js";

class Stock extends Model {
    constructor(spec={}) {
        super(spec);
        // -- approachMask (direction mask)
        this.approachMask = spec.approachMask || Direction.cardinal;
        // -- conditions
        this.occupiedCondition = spec.occupiedCondition || Condition.occupied;
        this.actorCondition = spec.actorCondition || Condition.waiting;
        // -- interactable
        this.interactable = true;
        // -- actor id (who's currenty interacting)
        this.actorId = 0;
        // -- stock
        // FIXME: time
        this.restock = spec.restock || new WorkTimer({condition: Condition.restock, maxTTL: 10000});
    }

    get approaches() {
        if (this.approachMask) {
            return Direction.all.filter((v) => (v & this.approachMask)).map((v) => new LevelNode(Direction.applyToX(this.x, v), Direction.applyToY(this.y, v), this.layer));
        } else {
            return [new LevelNode(this.x, this.y, this.layer)];
        }
    }

    get isOccupied() {
        return this.actorId != 0;
    }

    dointeract(actor) {
        //console.log(this + " dointeract");
        if (this.conditions.has(this.occupiedCondition)) {
            actor.actions.push(new LeaveAction({target: this}));
            //this.leave(actor);
        } else {
            actor.actions.push(new OccupyAction({target: this}));
            //this.occupy(actor);
        }
    }

}