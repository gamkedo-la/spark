export { Tile };

import { Fmt } from "./base/fmt.js";
import { Model }            from "./base/model.js";

class Tile extends Model {

    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        // tiles are passive if they do not have a collider
        if (!this.collider && !this.dirty) this.passive = true;
    }

}