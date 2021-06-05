export { LayeredViewMgr };

import { SortedStore }      from "./store.js";
import { Gizmo }            from "./gizmo.js";
import { Stats }            from "./stats.js";
import { Config }           from "./config.js";
import { Util }             from "./util.js";
import { Fmt }              from "./fmt.js";
import { Camera }           from "./camera.js";
import { Grid }             from "./grid.js";
import { Bounds }           from "./bounds.js";
import { Base }             from "./base.js";
import { Vect } from "./vect.js";

class Slice {
    constructor(canvas) {
        this.canvas = document.createElement('canvas');
        this.canvas.width = canvas.width;
        this.canvas.height = canvas.height;
        this.ctx = this.canvas.getContext('2d');
    }
}

class LayeredViewMgr extends Gizmo {
    static dfltGridX = 32;
    static dfltGridY = 24;

    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        spec.cat = "Mgr";
        super(spec);
    }
    cpost(spec) {
        let cvsid = spec.cvsid || Config.dfltCanvasId;
        this.camera = spec.camera || Camera.main;
        this.canvas = spec.canvas || document.getElementById(cvsid);
        this.renderCtx = this.canvas.getContext("2d");
        this.maxDepth = spec.maxDepth || 100;
        this.yscale = spec.hasOwnProperty("yscale") ? spec.yscale : .25;
        this.sorted = new SortedStore({cmpFcn: (v1, v2) => v1.vidx - v2.vidx});
        this.slicedSorted = new SortedStore({cmpFcn: (v1, v2) => v1.vidx - v2.vidx});

        this.tileSize = spec.tileSize || Config.tileSize;
        this.grid = new Grid({
            width: Math.floor(this.camera.width/this.tileSize),
            height: Math.floor(this.camera.height/this.tileSize),
            tileSize: this.tileSize,
        })
        this.dbg = spec.dbg;
        this.sliceCanvas = document.createElement('canvas');
        this.sliceCanvas.width = this.canvas.width;
        this.sliceCanvas.height = this.canvas.height;
        this.sliceCtx = this.sliceCanvas.getContext('2d');
        this.sliceReady = false;
        this.sliceIdxs = {};
        this.updatedViews = [];
        this.renderall = true;
        // bind event handlers
        Util.bind(this, "onViewUpdate");
    }

    // EVENT HANDLERS ------------------------------------------------------
    onViewUpdate(evt) {
        Stats.count("view.update");
        let view = evt.actor;
        //console.log("view: " + view);
        if (this.camera.overlaps(view)) {
            this.updatedViews.push(evt.actor);
        }
    }

    // METHODS -------------------------------------------------------------

    // view index
    vidx(obj) {
        let y = Math.round(obj.y*this.yscale);
        return (obj.depth * this.maxDepth) + y;
    }

    update(ctx) {
        // update all managed views
        for(const view of this.sorted) {
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

        // prepare sliced view
        if (!this.sliceReady) {
            this.sliceIdxs = {};

            // resolve updated views into grid indices
            for (const view of this.updatedViews) {
                let minx = view.minx - this.camera.minx;
                let rminx = minx;
                let miny = view.miny - this.camera.miny;
                let rminy = miny;
                let maxx = view.maxx - this.camera.minx;
                let rmaxx = maxx;
                let maxy = view.maxy - this.camera.miny;
                let rmaxy = maxy;
                if (view.hasOwnProperty("lastMinX")) {
                    rminx = Math.min(view.lastMinX, minx);
                    rminy = Math.min(view.lastMinY, miny);
                    rmaxx = Math.max(view.lastMaxX, maxx);
                    rmaxy = Math.max(view.lastMaxY, maxy);
                }
                view.lastMinX = minx;
                view.lastMinY = miny;
                view.lastMaxX = maxx;
                view.lastMaxY = maxy;
                let maxi = this.grid.ifromx(rmaxx);
                let maxj = this.grid.jfromy(rmaxy);
                for (let i=this.grid.ifromx(rminx); i<=maxi; i++) {
                    for (let j=this.grid.jfromy(rminy); j<=maxj; j++) {
                        this.sliceReady = true;
                        // compute grid index
                        this.sliceIdxs[this.grid.idxfromij(i, j)] = true;
                    }
                }
            }
            this.updatedViews = [];

            // resolve views to render
            if (this.sliceReady) {
                // -- all views that overlap with the resolved grid indices must be rerendered
                //console.log("-------------------------------------------------------------------------------");
                this.slicedSorted.clear(false);
                for (const gidx of Object.keys(this.sliceIdxs)) {
                    const bounds = new Bounds(
                        this.grid.xfromidx(gidx, false), 
                        this.grid.yfromidx(gidx, false), 
                        this.tileSize,
                        this.tileSize,
                    );
                    for (const view of this.grid.findOverlaps(bounds, (v) => v.cat === "View")) {
                        //console.log(`${gidx} check ${view}`);
                        if (!this.slicedSorted.contains(view)) {
                            this.slicedSorted.add(view);
                            //console.log(`+++ ${gidx} add ${view}`);
                        }
                    }
                }
            }

        }

    }

    render() {
        // handle rendering of all views
        if (this.renderall) {
            // clear current context
            this.renderCtx.fillStyle = 'black';
            this.renderCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            // render in layer/depth sorted order
            for (const view of this.sorted) {
                view.render(this.renderCtx);
            }
            this.renderall = false;

        // handle rendering of sliced views only
        } else if (this.sliceReady) {
            this.sliceReady = false;
            // sliced views get rendered to the slice context
            for (const view of this.slicedSorted) {
                //console.log("view: " + view);
                view.render(this.sliceCtx);
            }
            this.sliceCtx.resetTransform();
            // finally, copy the canvas for each slice index to the main rendering context
            for (const gidx of Object.keys(this.sliceIdxs)) {
                let minx = this.grid.xfromidx(gidx, false);
                let miny = this.grid.yfromidx(gidx, false);
                this.renderCtx.drawImage(this.sliceCanvas, 
                    minx, miny, this.tileSize, this.tileSize, 
                    minx, miny, this.tileSize, this.tileSize);
            }
        }
        // restore transform matrix (clears any xform apply/revert floating point deltas)
        this.renderCtx.resetTransform();
    }

    add(view) {
        // ignore views that are not roots
        if (!view || view.parent) return;
        if (this.dbg) console.log("adding view: " + view);
        // listen for view updates
        view.evtUpdated.listen(this.onViewUpdate)
        // assign index
        let vidx = this.vidx(view);
        view.vidx = vidx;
        this.sorted.add(view);
        this.grid.add(view);
    }

    remove(view) {
        if (this.dbg) console.log("removing view: " + view);
        this.grid.remove(view);
        this.sorted.remove(view);
        // remove from view updates
        view.evtUpdated.ignore(this.onViewUpdate)
    }

    clear() {
        this.sorted.clear();
    }


}