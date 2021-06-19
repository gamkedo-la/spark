export { SparkBase };

import { Config }           from "./base/config.js";
import { Model }            from "./base/model.js";


class SparkBase extends Model {

    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.range = spec.range || Config.tileSize * 10;
    }

}