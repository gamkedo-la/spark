export { Projectile, SparkProjectile };

import { Model }            from "./base/model.js";
import { Config }           from "./base/config.js";
import { SparkFx }          from "./sparkFx.js";
import { Fmt } from "./base/fmt.js";

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
        console.log(`Project orig: ${this.origx},${this.origy}`);
    }

    /*
    docollision(other, overlap) {
        console.log("projectile docollision");
        this.destroy();
    }
    */

}

class SparkProjectile extends Projectile {
    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.fx = new SparkFx({ 
            //xxform: { scalex: Config.renderScale, scaley: Config.renderScale },
            depth: 10,
            getx: (() => this.x * Config.renderScale), 
            gety: (() => this.y * Config.renderScale), 
            //getx: (() => this.x), 
            //gety: (() => this.y), 
            //getorigx: (() => this.origx), 
            //getorigy: (() => this.origy),
            getorigx: (() => this.origx * Config.renderScale), 
            getorigy: (() => this.origy * Config.renderScale),
        });
    }

    destroy() {
        super.destroy();
        this.fx.destroy();
    }
}