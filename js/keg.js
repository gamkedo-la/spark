export { Keg };

import { Model }            from "./base/model.js";
import { LevelNode }        from "./lvlGraph.js";

class Keg extends Model {
    constructor(spec={}) {
        super(spec);
        // -- approaches
        this.approachOffsets = spec.approachOffsets;
        // -- interactable
        this.interactable = true;
        this.dispenseTag = spec.dispenseTag || "Beer";
        console.log(`keg: ${this} approaches: ${Array.from(this.approaches)}`);
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
    }

}