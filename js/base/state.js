export { State };

import { Gizmo }            from "./gizmo.js";
import { Store }            from "./store.js";
import { Generator }        from "./generator.js";
import { ViewMgr }          from "./viewMgr.js";
import { Util }             from "./util.js";
import { Bounds }           from "./bounds.js";
import { LayeredViewMgr }   from "./layeredViewMgr.js";

/** ========================================================================
 * Top level game state, controlling view/ctrl/model instances (e.g.: menu state, play state, etc).
 */
class State extends Gizmo {
    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        spec.cat = "State";
        super(spec);
    }
    cpost(spec) {
        // -- viewMgr - view manager for state, handling the render pipeline
        let xvmgr = {
            dbg: spec.dbgView,
        }
        //let vmgrGen = spec.vmgrGen || ((spec) => new ViewMgr(spec));
        let vmgrGen = spec.vmgrGen || ((spec) => new LayeredViewMgr(spec));
        this.viewMgr = vmgrGen(xvmgr);
        // -- events/handlers
        Util.bind(this, "onGizmoCreate", "onGizmoDestroy");
        Gizmo.evtCreated.listen(this.onGizmoCreate);
        Gizmo.evtDestroyed.listen(this.onGizmoDestroy);
        // -- entities - list of state-managed entities (model/ctrl)
        this.entities = new Store({getkey: (v) => v.gid});
        // initial game state
        this.model = Generator.generate(spec.xmodel);
        // initial UI state
        this.view = Generator.generate(spec.xview);
    }

    // EVENT HANDLERS ------------------------------------------------------
    onGizmoCreate(evt) {
        if (!this.active) return;
        if (!evt || !evt.actor) return;
        let gzo = evt.actor;
        if (gzo.cat === "View") {
            this.viewMgr.add(gzo);
        } else if (gzo.cat === "Model" || gzo.cat === "Ctrl") {
            this.entities.add(gzo);
        }
    }

    onGizmoDestroy(evt) {
        if (!evt || !evt.actor) return;
        let gzo = evt.actor;
        if (gzo.cat === "View") {
            this.viewMgr.remove(gzo);
        } else if (gzo.cat === "Model" || gzo.cat === "Ctrl") {
            this.entities.remove(gzo);
        }
    }

    // METHODS -------------------------------------------------------------
    update(ctx) {
        // update managers
        this.viewMgr.update(ctx);
        // update entities
        for (const e of this.entities) {
            if (e.update) e.update(ctx);
        }
    }

    render() {
        // render pipeline managed through view mgr
        this.viewMgr.render();
    }

    *find(filter=(v) => true) {
        yield *this.entities.find(filter);
    }

    findFirst(filter=(v) => true) {
        return this.entities.findFirst(filter);
    }

    *findContains(x, y, filter=(v) => true) {
        yield *this.entities.find((v) => filter(v) && Bounds.contains(v, x, y));
    }

    *findOverlaps(bounds, filter=(v) => true) {
        yield *this.entities.find((v) => filter(v) && Bounds.overlaps(v, bounds));
    }

}