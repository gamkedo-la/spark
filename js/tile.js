export { Tile };

import { Model }            from "./base/model.js";

class Tile extends Model {

    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        // tiles are passive if they do not have a collider
        if (!this.collider) this.passive = true;
        this.sparkable = spec.hasOwnProperty("sparkable") ? spec.sparkable : false;
    }

}