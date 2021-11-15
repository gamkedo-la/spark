export { Bouncer };

import { Direction }        from "./base/dir.js";
import { Generator } from "./base/generator.js";
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
        // -- sfx
        this.xturnSfx = spec.turnSfx || {cls: "Media", tag: "rune.rotate"};
    }

    dointeract(actor) {
        this.rotate(actor);
    }

    rotate(actor) {
        if (this.xturnSfx) {
            let audio = Generator.generate(this.xturnSfx);
            audio.play();
        }
        // update facing direction
        this.facing = Direction.nextInRotation(Direction.diagonals, this.facing, this.clockwise);
    }

}