
export { VarSprite };
import { Sprite } from "./sprite.js";
import { Prng } from "./prng.js";
import { Fmt } from "./fmt.js";

/** ========================================================================
 * A variable sprite is a sketch used to render a JS image.
 */
class VarSprite extends Sprite {
    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec) {
        // pick sprite from variations
        let choice = Prng.choose(spec.variations || [])
        //console.log("spec: " + Fmt.ofmt(spec));
        //console.log("choice: " + Fmt.ofmt(choice));
        if (choice) spec.img = choice.xsketch.img;
        //console.log("final spec: " + Fmt.ofmt(spec));
        super(spec);
    }
}