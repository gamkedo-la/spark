export { Stove };

import { Model }            from "./base/model.js";
import { Direction }        from "./base/dir.js";
import { LevelNode }        from "./lvlGraph.js";
import { Fmt } from "./base/fmt.js";

class Stove extends Model {
    constructor(spec={}) {
        super(spec);
        // -- approaches
        this.approachOffsets = spec.approachOffsets;
        // -- interactable
        this.interactable = true;
        this.dispenseTag = spec.dispenseTag || "Food";
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
        //console.log(`${this} occupy actor: ${actor}`);
        // update own state
        // FIXME: add timer or stock variable
        // update actor state
        actor.carryTag = this.dispenseTag;
        actor.updated = true;
    }

}