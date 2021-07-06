export { ViewMgr };

import { SortedStore }      from "./store.js";
import { Gizmo }            from "./gizmo.js";
import { MouseSystem }      from "./mouse.js";
import { Config }           from "./config.js";

class ViewMgr extends Gizmo {
    static dfltCvsId = "canvas";

    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        spec.cat = "Mgr";
        super(spec);
    }
    cpost(spec) {
        let cvsid = spec.cvsid || ViewMgr.dfltCvsId;
        this.canvas = spec.canvas || document.getElementById(cvsid);
        this.renderCtx = this.canvas.getContext("2d");
        this.maxDepth = spec.maxDepth || 100;
        this.yscale = spec.hasOwnProperty("yscale") ? spec.yscale : .25;
        this.sorted = new SortedStore({cmpFcn: (v1, v2) => v1.vidx - v2.vidx});
        this.dbg = spec.dbg;
        this.mouseSystem = new MouseSystem({ dbg: Config.dbg.MouseSystem });
    }

    // METHODS -------------------------------------------------------------
    vidx(obj) {
        let y = Math.round(obj.y*this.yscale);
        return (obj.depth * this.maxDepth) + y;
    }

    update(ctx) {
        // update mouse system
        this.mouseSystem.update(ctx);
        // update all managed views
        for(const view of this.sorted) {
            // check for mouse changes...
            this.mouseSystem.iterate(ctx, view);
            // check for change in rootness
            if (view.parent) {
                this.sorted.remove(view);
                continue;
            }
            // check for change in vidx
            if (view.vidx !== this.vidx(view)) {
                this.sorted.remove(view);
                view.vidx = this.vidx(view);
                this.sorted.add(view);
            }
            // trigger view update
            view.update(ctx);
        }
    }

    render() {
        // clear current context
        this.renderCtx.fillStyle = 'black';
        this.renderCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // render in layer/depth sorted order
        for (const view of this.sorted) {
            view.render(this.renderCtx);
        }
        // restore transform matrix (clears any xform apply/revert floating point deltas)
        this.renderCtx.resetTransform();
    }

    add(view) {
        // ignore views that are not roots
        if (!view || view.parent) return;
        if (this.dbg) console.log("adding view: " + view);
        // assign index
        let vidx = this.vidx(view);
        view.vidx = vidx;
        this.sorted.add(view);
    }

    remove(view) {
        if (this.dbg) console.log("removing view: " + view);
        this.sorted.remove(view);
    }

    clear() {
        this.sorted.clear();
    }

}
