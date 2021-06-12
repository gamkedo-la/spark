export { Chair };

import { Model }            from './base/model.js';
import { Config }           from './base/config.js';
import { ModelState }       from './base/modelState.js';
import { Generator }        from './base/generator.js';
import { OpenAction }       from './base/action.js';
import { Direction } from './base/dir.js';
import { Condition } from './base/condition.js';

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
        // -- sketch
        this.xsketch = spec.xsketch || {};
        // -- approachMask (direction mask)
        this.approachMask = spec.approachMask || Direction.cardinal;
        // -- seated offset
        this.seatedOffX = spec.seatedOffX || 0;
        this.seatedOffY = spec.seatedOffY || 0;
        // -- seated direction
        this.seatedDir = spec.seatedDir || Direction.north;
        // -- conditions
        this.occupiedCondition = spec.occupiedCondition || Condition.occupied;
        this.seatedCondition = spec.seatedCondition || Condition.seated;
        // -- xform
        this.xxform = spec.xxform || undefined;
        // -- interactable
        this.interactable = true;
        // -- collider
        if (spec.xcollider) {
            this.collider = Generator.generate(Object.assign({"cls": "Collider", x: this.x, y: this.y}, spec.xcollider));
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
        // update actor state
        actor.conditions.add(this.seatedCondition);
        console.log("actor.conditions: " + Array.from(actor.conditions.values()));
        actor.x = this.x + this.seatedOffX;
        actor.y = this.y + this.seatedOffY;
        actor.heading = Direction.asHeading(this.seatedDir);
        if (actor.depth <= this.depth) actor.depth = this.depth+1;
        actor.updated = true;
    }

    leave(actor) {
        console.log(`${this} leave actor: ${actor}`);
        // update chair state
        this.conditions.delete(this.occupiedCondition);
        this.offx = this.emptyX;
        this.offy = this.emptyY;
        // update actor state
        actor.conditions.delete(this.seatedCondition)
        console.log("actor.conditions: " + Array.from(actor.conditions.values()));
        actor.x = this.actorSavedX;
        actor.y = this.actorSavedY;
        actor.depth = this.actorSavedDepth;
        actor.updated = true;
    }

    bypassAction() {
        return new OpenAction({target: this});
    }

}