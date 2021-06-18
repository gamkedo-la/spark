export { Projectile };

import { Model }            from "./base/model.js";
import { Config }           from "./base/config.js";
import { Fmt } from "./base/fmt.js";

class Projectile extends Model {
    static dfltSpeed = .3;

    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec) {
        console.log(`Projectile spec: ${Fmt.ofmt(spec)}`);
        super.cpost(spec);
        console.log(`Projectile spec after super cpost: ${Fmt.ofmt(spec)}`);
        console.log(`position set to: ${this.x},${this.y}`);
        this.heading = spec.heading || 0;
        this.maxSpeed = spec.maxSpeed || Projectile.dfltSpeed;
        this.speed = 1;
        this.range = spec.range || Config.tileSize * 10;
        console.log("range set to: " + this.range);
        this.origx = this.x;
        this.origy = this.y;
        console.log(`orig set to: ${this.origx},${this.origy} from ${this.x},${this.y}`);
        console.log(`projectile xsketch: ${Fmt.ofmt(this.xsketch)}`);
    }

    docollision(other, overlap) {
        console.log("projectile docollision");
        this.destroy();
    }

    /*
    iupdate(ctx) {
        // check for range
        if (Mathf.distance(this.x, this.y, this.origx, this.y) >= this.range) {
        }
        // FIXME: remove
        //console.error("here");
        return super.iupdate(ctx);
    }
    */

}