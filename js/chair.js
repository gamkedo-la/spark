export { Chair };

import { Model }            from './base/model.js';
import { ModelState }       from './base/modelState.js';
import { Generator }        from './base/generator.js';
import { Direction } from './base/dir.js';
import { Condition } from './base/condition.js';
import { LevelNode } from './lvlGraph.js';
import { LeaveAction } from './actions/leave.js';
import { OccupyAction } from './actions/occupy.js';

class Chair extends Model {

    cpre(spec) {
        if (!spec.hasOwnProperty("state")) spec.state = ModelState.idle;
    }
    constructor(spec={}) {
        super(spec);
        // -- empty position
        this.emptyX = spec.emptyX || 0;
        this.emptyY = spec.emptyY || 0;
        // -- occupied position
        this.occupiedX = spec.occupiedX || 0;
        this.occupiedY = spec.occupiedY || 0;
        // -- position
        this.x = spec.x || 0;
        this.y = spec.y || 0;
        this.offx = this.emptyX;
        this.offy = this.emptyY;
        this.actorSavedX = 0;
        this.actorSavedY = 0;
        // -- approachMask (direction mask)
        this.approachMask = spec.approachMask || Direction.cardinal;
        // -- occupied offset
        this.occupiedOffX = spec.occupiedOffX || 0;
        this.occupiedOffY = spec.occupiedOffY || 0;
        // -- occupied direction
        this.occupiedDir = spec.occupiedDir || Direction.north;
        // -- conditions
        this.occupiedCondition = spec.occupiedCondition || Condition.occupied;
        this.actorCondition = spec.actorCondition || Condition.seated;
        // -- interactable
        this.interactable = true;
        // -- collider
        if (spec.xcollider) {
            this.collider = Generator.generate(Object.assign({"cls": "Collider", x: this.x, y: this.y}, spec.xcollider));
        }
        // -- actor id (who's in the bed)
        this.actorId = 0;
    }

    get approaches() {
        if (this.approachMask) {
            return Direction.all.filter((v) => (v & this.approachMask)).map((v) => new LevelNode(Direction.applyToX(this.x, v), Direction.applyToY(this.y, v), this.layer));
        } else {
            return [new LevelNode(this.x, this.y, this.layer)];
        }
    }

    dointeract(actor) {
        console.log(this + " dointeract");
        if (this.conditions.has(this.occupiedCondition)) {
            actor.actions.push(new LeaveAction({target: this}));
            //this.leave(actor);
        } else {
            actor.actions.push(new OccupyAction({target: this}));
            //this.occupy(actor);
        }
    }

}