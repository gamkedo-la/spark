export { Bed };

import { Model }            from "./base/model.js";
import { ModelState }       from "./base/modelState.js";
import { Fmt }              from "./base/fmt.js";
import { Direction }        from "./base/dir.js";
import { LevelNode }        from "./lvlGraph.js";
import { Condition }        from "./base/condition.js";
import { LeaveAction } from "./actions/leave.js";
import { OccupyAction } from "./actions/occupy.js";

class Bed extends Model {
    constructor(spec={}) {
        super(spec);
        // -- position
        this.x = spec.x || 0;
        this.y = spec.y || 0;
        this.actorSavedX = 0;
        this.actorSavedY = 0;
        // -- approaches
        this.approachOffsets = spec.approachOffsets;
        // -- occupied offset
        this.occupiedOffX = spec.occupiedOffX || 0;
        this.occupiedOffY = spec.occupiedOffY || 0;
        this.occupiedOffD = spec.occupiedOffD || 0;
        // -- occupied direction
        this.occupiedDir = spec.occupiedDir || Direction.south;
        // -- conditions
        this.occupiedCondition = spec.occupiedCondition || Condition.occupied;
        this.actorCondition = spec.actorCondition || Condition.asleep;
        // -- interactable
        this.interactTag = "occupy";
        // -- actor id (who's in the bed)
        this.actorId = 0;
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