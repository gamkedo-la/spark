export { State };

import { Gizmo }            from "./gizmo.js";
import { CachingFindStore, Store }            from "./store.js";
import { Generator }        from "./generator.js";
import { Util }             from "./util.js";
import { Bounds }           from "./bounds.js";
import { Config }           from "./config.js";
import { Fmt }              from "./fmt.js";
import { Base }             from "./base.js";

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
        // -- stateMgr - state manager responsible for managing all states
        this.stateMgr = spec.stateMgr || Base.instance.stateMgr;
        // -- viewMgr - view manager for state, handling the render pipeline
        let xvmgr = spec.xvmgr || { cls: "ViewMgr", dbg: Config.dbg.ViewMgr };
        this.viewMgr = Generator.generate(xvmgr);
        // -- entities - store of all models/ctrls associated w/ state
        this.entities = new CachingFindStore({getkey: (v) => v.gid});
        // -- events/handlers
        Util.bind(this, "onGizmoCreate", "onGizmoDestroy");
        // top level controller is this state
        Gizmo.evtCreated.listen(this.onGizmoCreate);
        Gizmo.evtDestroyed.listen(this.onGizmoDestroy);
        // top level game model
        this.model = Generator.generate(spec.xmodel);
        // top level view
        this.view = Generator.generate(spec.xview);
        // -- visible
        this._visible = spec.hasOwnProperty("visible") ? spec.visible : true;
    }

    // PROPETIES -----------------------------------------------------------
    get visible() {
        return this._visible;
    }
    set visible(v) {
        if (v !== this._visible) {
            this._visible = v;
            this.updated = true;
        }
    }

    // EVENT HANDLERS ------------------------------------------------------
    onGizmoCreate(evt) {
        if (!this.active) return;
        if (!evt || !evt.actor) return;
        let gzo = evt.actor;
        if (gzo.cat === "View") {
            this.viewMgr.add(gzo);
            // FIXME: may need to reassess how entities/views are split
            //if (gzo.ui) {
                this.entities.add(gzo);
            //}
        } else if (gzo.cat === "Model" || gzo.cat === "Ctrl") {
            this.entities.add(gzo);
        }
    }

    onGizmoDestroy(evt) {
        if (!evt || !evt.actor) return;
        let gzo = evt.actor;
        if (gzo.cat === "View") {
            this.viewMgr.remove(gzo);
            //if (gzo.ui) {
                this.entities.remove(gzo.gid);
            //}
        } else if (gzo.cat === "Model" || gzo.cat === "Ctrl") {
            this.entities.remove(gzo.gid);
        }
    }

    // METHODS -------------------------------------------------------------
    iupdate(ctx) {
        // view updates managed through view manager
        this.viewMgr.update(ctx);
        // controller updates managed here...
        for (const e of this.entities.find((v) => v.cat === "Ctrl")) {
            e.update(ctx);
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

    destroy() {
        Gizmo.evtCreated.ignore(this.onGizmoCreate);
        Gizmo.evtDestroyed.ignore(this.onGizmoDestroy);
        if (this.view) this.view.destroy()
        super.destroy();
    }

}
