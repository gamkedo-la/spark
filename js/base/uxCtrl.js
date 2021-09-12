
export { UxCtrl };

import { Gizmo }            from "./gizmo.js";
import { Base }             from "./base.js";
import { Generator }        from "./generator.js";

/** ========================================================================
 * Base Control class in modified MCV pattern
 * Ctrl -> Model
 *      -> View
 */
class UxCtrl extends Gizmo {
    static dfltView = {
        cls: "UxCanvas",
    }

    // CONSTRUCTOR ---------------------------------------------------------
    cpre(spec) {
        this.base = spec.base || Base.instance;
    }
    constructor(spec={}) {
        spec.cat = "Ctrl";
        super(spec);
    }
    cpost(spec) {
        //this.view = Generator.generate(spec.xview || UxCtrl.dfltView);
    }

    // METHODS -------------------------------------------------------------
    destroy() {
        console.log("destroy ctrl");
        if (this.view) this.view.destroy();
        super.destroy();
    }


}