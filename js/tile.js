export { Tile };

import { Generator }        from "./base/generator.js";
import { Model }            from "./base/model.js";

class Tile extends Model {

    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this.x = spec.x || 0;
        this.y = spec.y || 0;
        this.xsketch = spec.xsketch || {};
        if (spec.xcollider) {
            this.collider = Generator.generate(Object.assign({"cls": "Collider", x: this.x, y: this.y}, spec.xcollider));
        }
    }

}