export { Tile };

import { Model }            from "./base/model.js";
import { Stats }            from "./base/stats.js";

class Tile extends Model {

    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        //this.x = spec.x || 0;
        //this.y = spec.y || 0;
        // FIXME
        this.twice = 2;
    }

    iupdate(ctx) {
        // FIXME: remove
        if (this.twice > 0) {
            this.twice--;
            //console.trace("iupdate");
        }
        //console.error("here");
        Stats.count("tile.iupdate");
        return super.iupdate(ctx);
    }

}