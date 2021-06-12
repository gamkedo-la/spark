export { Tile };

import { Model }            from "./base/model.js";
import { Stats }            from "./base/stats.js";

class Tile extends Model {

    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.x = spec.x || 0;
        this.y = spec.y || 0;
    }

    iupdate(ctx) {
        Stats.count("tile.update");
        return super.iupdate(ctx);
    }

}