export { SparkBase };

import { Condition }        from "./base/condition.js";
import { Config }           from "./base/config.js";
import { Fmt } from "./base/fmt.js";
import { Model }            from "./base/model.js";


class SparkBase extends Model {

    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.range = spec.range || Config.tileSize * 10;
        if (spec.powered) this.conditions.add(Condition.powered);
    }

}