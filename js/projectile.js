export { Projectile, SparkProjectile };

import { Model }            from "./base/model.js";
import { Config }           from "./base/config.js";
import { SparkFx }          from "./sparkFx.js";
import { Fmt } from "./base/fmt.js";
import { Generator } from "./base/generator.js";

class Projectile extends Model {
    static dfltSpeed = .2;

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

}

class SparkProjectile extends Projectile {
    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        let xfx = {
            cls: "SparkFx",
            getx: () => this.x,
            gety: () => this.y,
            xxform: {scalex: Config.renderScale, scaley: Config.renderScale}, 
            depth: this.depth,
        };
        this.fx = Generator.generate(xfx);
    }

    destroy() {
        super.destroy();
        this.fx.destroy();
    }
}