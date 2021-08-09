export { Stove };

import { Model }            from "./base/model.js";
import { Direction }        from "./base/dir.js";
import { LevelNode }        from "./lvlGraph.js";
import { Fmt } from "./base/fmt.js";

class Stove extends Model {
    constructor(spec={}) {
        super(spec);
        // -- approachMask (direction mask)
        this.approachMask = spec.approachMask || Direction.cardinal;
        // -- interactable
        this.interactable = true;
        this.dispenseTag = spec.dispenseTag || "Food";
        console.log(`stove: ${Fmt.ofmt(this)}`);
    }

    get approaches() {
        if (this.approachMask) {
            return Direction.all.filter((v) => (v & this.approachMask)).map((v) => new LevelNode(Direction.applyToX(this.x, v), Direction.applyToY(this.y, v), this.layer));
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