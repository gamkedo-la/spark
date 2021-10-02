export { MealService };

import { Model }            from './base/model.js';
import { ModelState }       from './base/modelState.js';
import { Generator }        from './base/generator.js';
import { Direction }        from './base/dir.js';
import { Condition }        from './base/condition.js';
import { LevelNode }        from './lvlGraph.js';
import { LeaveAction }      from './actions/leave.js';
import { OccupyAction }     from './actions/occupy.js';
import { Fmt } from './base/fmt.js';

class MealService extends Model {

    cpre(spec) {
        if (!spec.hasOwnProperty("state")) spec.state = ModelState.idle;
    }
    cpost(spec) {
        super.cpost(spec);
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
        // -- meal service
        this.mealService = true;
        this.serviceApproachOffsets = spec.serviceApproachOffsets;
        this.beerId = 0;
        this.foodId = 0;
        // offset for service item location
        this.beerOffX = spec.beerOffX || 0;
        this.beerOffY = spec.beerOffY || 0;
        this.foodOffX = spec.foodOffX || 0;
        this.foodOffY = spec.foodOffY || 0;
        // offset for actor location when serving
        this.serveOffX = spec.serveOffX;
        this.serveOffY = spec.serveOffY;
        this.serveDir = spec.serveDir || Direction.south;
        // -- approaches
        this.approachOffsets = spec.approachOffsets;
        // -- occupied offset
        this.occupiedOffX = spec.occupiedOffX || 0;
        this.occupiedOffY = spec.occupiedOffY || 0;
        this.occupiedOffD = spec.occupiedOffD || 0;
        // -- occupied direction
        this.occupiedDir = spec.occupiedDir || Direction.north;
        // -- conditions
        this.occupiedCondition = spec.occupiedCondition || Condition.occupied;
        this.actorCondition = spec.actorCondition || Condition.seated;
        // -- interactable
        this.interactTag = "occupy";
        // -- collider
        if (spec.xcollider) {
            this.collider = Generator.generate(Object.assign({"cls": "Collider", x: this.x, y: this.y}, spec.xcollider));
        }
        // -- actor id (who's on object)
        this.actorId = 0;
    }

    get approaches() {
        if (this.conditions.has(this.occupiedCondition)) {
            if (this.serviceApproachOffsets) {
                return this.serviceApproachOffsets.map((v) => new LevelNode(this.x+v.x, this.y+v.y, this.layer));
            } else {
                return [new LevelNode(this.x, this.y, this.layer)];
            }
        } else {
            if (this.approachOffsets) {
                return this.approachOffsets.map((v) => new LevelNode(this.x+v.x, this.y+v.y, this.layer));
            } else {
                return [new LevelNode(this.x, this.y, this.layer)];
            }
        }
    }

    dointeract(actor) {
        if (this.conditions.has(this.occupiedCondition)) {
            actor.actions.push(new LeaveAction({target: this}));
            //this.leave(actor);
        } else {
            actor.actions.push(new OccupyAction({target: this}));
            //this.occupy(actor);
        }
    }

}