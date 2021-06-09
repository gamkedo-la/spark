export { System }
import { Gizmo } from "./gizmo.js";

class System extends Gizmo {
    static dfltIterateTTL = 200;
    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        spec.cat = "System";
        super(spec);
    }
    cpost(spec) {
        this.iterateTTL = spec.hasOwnProperty("iterateTTL") ? spec.iterateTTL : System.dfltIterateTTL;
        this.nextTTL = this.iterateTTL;
        this.deltaTime = 0;
        this.deltaTime = 0;
        this.ready = false;
        this.feats = [];
        this.dbg = spec.hasOwnProperty("dbg") ? spec.dbg : false;
    }

    // METHODS -------------------------------------------------------------
    iupdate(ctx) {
        this.nextTTL -= ctx.deltaTime;
        this.deltaTime += ctx.deltaTime;
        if (this.nextTTL <= 0) {
            this.ready = true;
            this.nextTTL = this.iterateTTL;
            this.prepare(ctx);
            return true;
        }
        return false;
    }

    prepare(ctx) {
    }

    iterate(ctx, e) {
    }

    finalize(ctx) {
    }

    postiterate(ctx) {
        // iterate through any post feats
        if (this.ready) {
            for (const feat of this.feats) {
                feat.execute();
            }
            this.feats = [];
            this.deltaTime = 0;
            this.finalize(ctx);
        }
        this.ready = false;
    }

}
