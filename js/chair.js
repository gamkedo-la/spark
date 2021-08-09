export { Chair };

import { Model }            from './base/model.js';
import { Config }           from './base/config.js';
import { ModelState }       from './base/modelState.js';
import { Generator }        from './base/generator.js';
import { OpenAction }       from './base/action.js';
import { Direction } from './base/dir.js';
import { Condition } from './base/condition.js';
import { LevelNode } from './lvlGraph.js';

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
        console.log(`setting actor: ${actor} heading to : ${actor.heading} speed is: ${actor.speed}`);
        if (actor.depth <= this.depth) actor.depth = this.depth+1;
        actor.updated = true;
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
    }

}