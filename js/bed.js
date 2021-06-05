export { Bed };

import { Model }            from "./base/model.js";
import { ModelState }       from "./base/modelState.js";
import { Generator }        from "./base/generator.js";
import { Config }           from "./base/config.js";
import { Fmt }              from "./base/fmt.js";
import { Direction }        from "./base/dir.js";
import { LevelNode }        from "./lvlGraph.js";

class Bed extends Model {
    constructor(spec={}) {
        super(spec);
        // -- position
        this.x = spec.x || 0;
        this.y = spec.y || 0;
        // -- sketch
        this.xsketch = spec.xsketch || {};
        // -- portmask (direction mask)
        this.portmask = spec.portmask || 0;
        console.log("bed portmask: " + this.portmask);
        // -- state
        this.state = spec.state || ModelState.idle;
        // -- interactRange
        this.interactRange = spec.interactRange || Config.tileSize;
        // -- interactable
        this.interactable = true;
        // -- collider
        if (spec.xcollider) {
            this.collider = Generator.generate(Object.assign({"cls": "Collider", x: this.x, y: this.y}, spec.xcollider));
        }
        // -- bed tag
        this.bedTag = spec.hasOwnProperty("bedTag") ? spec.bedTag : undefined;
        // -- user id (who's in the bed)
        this.userId = 0;
    }

    get ports() {
        if (this.portmask) {
            return Direction.all.filter((v) => (v & this.portmask)).map((v) => new LevelNode(Direction.applyToX(this.x, v), Direction.applyToY(this.y, v), this.layer));
        } else {
            return [new LevelNode(this.x, this.y, this.layer)];
        }
    }

    /*
    dointeract(actor) {
        console.log(this + " dointeract");
        if (this.state !== ModelState.open) {
            this.open();
        }
    }
    */

    enter(actor) {
        this.state = ModelState.occupied;
        this.userId = actor.gid;
    }

    exit() {
        this.state = ModelState.idle;
        this.userId = 0;
    }

}