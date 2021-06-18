export { Tile };

import { Model }            from "./base/model.js";
import { Stats }            from "./base/stats.js";

class Tile extends Model {

    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        // tiles are passive if they do not have a collider
        if (!this.collider) this.passive = true;
    }

    iupdate(ctx) {
        Stats.count("tile.iupdate");
        return super.iupdate(ctx);
    }

}