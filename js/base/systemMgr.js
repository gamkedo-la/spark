export { SystemMgr };

import { Store } from "./store.js";
import { Gizmo } from "./gizmo.js";
import { Stats } from "./stats.js";
import { Atts } from "./atts.js";

class SystemMgr extends Gizmo {

    // CONSTRUCTOR ---------------------------------------------------------
    constructor( spec={} ) {
        spec.cat = "Mgr";
        super(spec);
    }
    cpost(spec) {
        this.getStore = spec.getStore;
        this._store = spec.store || new Store();
        this.atts = spec.atts || Atts;
    }

    // PROPERTIES ----------------------------------------------------------
    get length() {
        return this._items.length;
    }
    get store() {
        if (this.getStore) return this.getStore();
        return this._store;
    }

    // METHODS -------------------------------------------------------------
    update(ctx) {
        //console.log("smgr update");
        // update
        for (const sys of this.children()) {
            if (!sys.active) continue;
            sys.update(ctx);
        }
        // entity iterate
        for (const sys of this.children()) {
            // don't iterate entities for systems that can be paused (and game is paused)
            if (this.atts.paused && !sys.ignorePause) continue;
            if (!sys.active) continue;
            if (!sys.ready) continue;
            for(const e of this.store.find(sys.fixedPredicate)) {
                Stats.count("sys.iterate");
                sys.iterate(ctx, e);
            }
        }
        // postiterate
        for (const sys of this.children()) {
            if (this.atts.paused && !sys.ignorePause) continue;
            if (!sys.active) continue;
            if (!sys.ready) continue;
            sys.postiterate(ctx);
        }
    }

}
