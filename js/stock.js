export { Stock };

import { Model }            from "./base/model.js";
import { LevelNode }        from "./lvlGraph.js";
import { Condition }        from "./base/condition.js";
import { LeaveAction }      from "./actions/leave.js";
import { OccupyAction }     from "./actions/occupy.js";
import { WorkTimer }        from "./dirtySystem.js";

class Stock extends Model {
    constructor(spec={}) {
        super(spec);
        // -- approaches
        this.approachOffsets = spec.approachOffsets;
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
        if (this.approachOffsets) {
            return this.approachOffsets.map((v) => new LevelNode(this.x+v.x, this.y+v.y, this.layer));
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