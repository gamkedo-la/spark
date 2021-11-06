export { Tile };

import { Fmt } from "./base/fmt.js";
import { Model }            from "./base/model.js";
import { Generator }        from './base/generator.js';


class Tile extends Model {

    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        // tiles are passive (i.e.: they don't move) 
        // -- the exception is dirty tiles
        if (!this.dirty) this.passive = true;
        // -- sounds
        if (spec.xsparkSfx) {
            //console.log("Discovered a Tile with a sparkSfx!"); // confirm data is good
            this.xsparkSfx = Generator.generate(spec.xsparkSfx);
        }
    }

}