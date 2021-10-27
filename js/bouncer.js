export { Bouncer };

import { Direction }        from "./base/dir.js";
import { Model }            from "./base/model.js";

class Bouncer extends Model {
    constructor(spec={}) {
        super(spec);
        // -- interactable
        this.interactTag = "open";
        // -- mark as a bouncer
        this.bouncer = true;
        // -- direction handling
        this.facing = spec.facing || Direction.northEast;
        this.clockwise = spec.hasOwnProperty("clockwise") ? spec.clockwise : true;
    }

    dointeract(actor) {
        this.rotate(actor);
    }

    rotate(actor) {
        // update facing direction
        this.facing = Direction.nextInRotation(Direction.diagonals, this.facing, this.clockwise);
    }

}