export { Projectile };

import { Model }            from "./base/model.js";
import { Config }           from "./base/config.js";

class Projectile extends Model {
    static dfltSpeed = .3;

    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.heading = spec.heading || 0;
        this.maxSpeed = spec.maxSpeed || Projectile.dfltSpeed;
        this.speed = 1;
        this.range = spec.range || Config.tileSize * 10;
        this.origx = this.x;
        this.origy = this.y;
        this.srcid = spec.srcid || 0;
    }

    /*
    docollision(other, overlap) {
        console.log("projectile docollision");
        this.destroy();
    }
    */

}