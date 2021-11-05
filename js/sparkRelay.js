export { SparkRelay };

import { Condition }        from "./base/condition.js";
import { Config }           from "./base/config.js";
import { Fmt } from "./base/fmt.js";
import { Model }            from "./base/model.js";

class SparkRelay extends Model {

    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.relay = true;
        this.range = spec.range || Config.tileSize * 10;
        this.srcid = 0;
        this.spinme = spec.spinme || false;
        if (spec.powered) this.conditions.add(Condition.powered);
        console.log(`relay: ${Fmt.ofmt(spec)} pos: ${this.x},${this.y}`);
    }

}