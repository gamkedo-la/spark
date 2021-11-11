export { Dispenser };

import { Direction }        from "./base/dir.js";
import { Model }            from "./base/model.js";
import { LevelNode }        from "./lvlGraph.js";

class Dispenser extends Model {
    constructor(spec={}) {
        super(spec);
        // -- approaches
        this.approachOffsets = spec.approachOffsets;
        // -- interactable
        this.interactable = true;
        this.dispenseTag = spec.dispenseTag || "Water";
        // offset for actor location when gathering
        this.gatherOffX = spec.gatherOffX;
        this.gatherOffY = spec.gatherOffY;
        this.gatherDir = spec.gatherDir || Direction.north;
        // -- morale event to trigger upon gathering (if any)
        this.moraleEvent = spec.moraleEvent;
    }

    get approaches() {
        if (this.approachOffsets) {
            return this.approachOffsets.map((v) => new LevelNode(this.x+v.x, this.y+v.y, this.layer));
        } else {
            return [new LevelNode(this.x, this.y, this.layer)];
        }
    }

    dointeract(actor) {
        this.gather(actor);
    }

    gather(actor) {
        // update actor state
        actor.carryTag = this.dispenseTag;
        actor.updated = true;
        // trigger any morale events
        if (this.moraleEvent) actor.morale.events.push(this.moraleEvent);
    }

}