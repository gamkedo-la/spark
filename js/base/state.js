export { State };

import { Gizmo }            from "./gizmo.js";
import { Store }            from "./store.js";
import { Generator }        from "./generator.js";
import { Util }             from "./util.js";
import { Bounds }           from "./bounds.js";
import { LayeredViewMgr }   from "./layeredViewMgr.js";
import { Config } from "./config.js";

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
            dbg: Config.dbg.ViewMgr,
        };
        let vmgrGen = spec.vmgrGen || ((spec) => new LayeredViewMgr(spec));
        this.viewMgr = vmgrGen(xvmgr);
        // -- entities - store of all models associated w/ non-passive state
        this.entities = new Store({getkey: (v) => v.gid});
        // -- passives - store of all models associated w/ passive state
        this.passives = new Store({getkey: (v) => v.gid});
        // -- ctrls - store of all controllers associated w/ state
        this.ctrls = new Store({getkey: (v) => v.gid});
        // top level game model
        this.model = Generator.generate(spec.xmodel);
        this.entities.add(this.model);
        // top level view
        this.view = Generator.generate(spec.xview);
        this.viewMgr.add(this.view);
        // -- events/handlers
        Util.bind(this, "onGizmoCreate", "onGizmoDestroy");
        // top level controller is this state
        Gizmo.evtCreated.listen(this.onGizmoCreate);
        Gizmo.evtDestroyed.listen(this.onGizmoDestroy);
    }

    // EVENT HANDLERS ------------------------------------------------------
    onGizmoCreate(evt) {
        if (!this.active) return;
        if (!evt || !evt.actor) return;
        let gzo = evt.actor;
        if (gzo.cat === "View") {
            this.viewMgr.add(gzo);
        } else if (gzo.cat === "Model") {
            if (gzo.passive) {
                this.passives.add(gzo);
            } else {
                this.entities.add(gzo);
            }
        } else if (gzo.cat === "Ctrl") {
            this.ctrls.add(gzo);
        }
    }

    onGizmoDestroy(evt) {
        if (!evt || !evt.actor) return;
        let gzo = evt.actor;
        if (gzo.cat === "View") {
            this.viewMgr.remove(gzo);
        } else if (gzo.cat === "Model") {
            if (gzo.passive) {
                this.passives.remove(gzo.gid);
            } else {
                this.entities.remove(gzo.gid);
            }
        } else if (gzo.cat === "Ctrl") {
            this.ctrls.remove(gzo.gid);
        }
    }

    // METHODS -------------------------------------------------------------
    iupdate(ctx) {
        // view updates managed through view manager
        this.viewMgr.update(ctx);
        // controller updates managed here...
        for (const e of this.ctrls) {
            e.update(ctx);
        }
        // model updates are managed through systems
        //for (const e of this.entities) { e.update(ctx); }
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
