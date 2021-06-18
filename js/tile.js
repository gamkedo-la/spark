export { Tile };

import { Model }            from "./base/model.js";
import { Stats }            from "./base/stats.js";

class Tile extends Model {

    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        // tiles are passive if they do not have a collider and are on the base layer
        if (!this.collider && this.layer === 0) this.passive = true;
        if (this.collider) console.log(`tile ${this} collider: ${this.collider}`);
    }

    iupdate(ctx) {
        Stats.count("tile.iupdate");
        return super.iupdate(ctx);
    }

}