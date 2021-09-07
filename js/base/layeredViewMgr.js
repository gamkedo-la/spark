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
        this.slicedSorted = new SortedStore({cmpFcn: (v1, v2) => v1.vidx - v2.vidx});
        this.viewSize = spec.viewSize || (Config.tileSize*Config.renderScale);
        this.worldWidth = spec.worldWidth || this.camera.width;
        this.worldHeight = spec.worldHeight || this.camera.height;
        this.grid = new Grid({
            columns: Math.floor(this.worldWidth*Config.renderScale/this.viewSize),
            rows: Math.floor(this.worldHeight*Config.renderScale/this.viewSize),
            tileSize: this.viewSize,
            //dbg: true,
        })
        this.uiViews = [];
        this.dbg = spec.dbg;
        this.sliceCanvas = document.createElement('canvas');
        this.sliceCanvas.width = this.worldWidth * Config.renderScale;
        this.sliceCanvas.height = this.worldHeight * Config.renderScale;
        this.sliceCtx = this.sliceCanvas.getContext('2d');
        let uicvsid = spec.uicvsid || Config.dfltUiCanvasId;
        this.uiCanvas = spec.uiCanvas || document.getElementById(uicvsid);
        this.uiCtx = this.uiCanvas.getContext('2d');
        this.uiUpdated = false;
        this.sliceReady = false;
        this.sliceIdxs = {};
        this.updatedViews = [];
        this.renderall = true;
        this.modelViewUpdates = [];
        // bind event handlers
        Util.bind(this, "onViewUpdate", "onModelUpdate");
    }

    // EVENT HANDLERS ------------------------------------------------------
    onViewUpdate(evt) {
        Stats.count("view.update");
        let view = evt.actor;
        // check for change in vidx
        if (view.vidx !== this.vidx(view)) {
            view.vidx = this.vidx(view);
        }
        if (this.camera.overlaps(view)) {
            //console.log(`==================== on view update: ${view} view.min: ${view.minx},${view.miny} view.width: ${view.width}, view xform: ${view.xform} parent: ${view.xform.parent}`);
            this.updatedViews.push(evt.actor);
        }
    }

    onModelUpdate(evt) {
        let model = evt.actor;
        if (model.view) {
            this.modelViewUpdates.push(model.view);
            /*
            let view = model.view;
            // check for change in vidx
            if (view.vidx !== this.vidx(view)) {
                console.log(`onModelUpdate: ${model} view: ${model.view} last vidx: ${view.vidx} new: ${this.vidx(view)}`);
                view.vidx = this.vidx(view);
            }
            if (this.camera.overlaps(view)) {
                console.log(`==================== on model update: ${view} view.min: ${view.minx},${view.miny} view.width: ${view.width}, view xform: ${view.xform} parent: ${view.xform.parent}`);
                this.updatedViews.push(view);
            }
            */
        }
    }

    // METHODS -------------------------------------------------------------

    // view index
    vidx(obj) {
        let y = Math.round(obj.maxy*this.yscale);
        return (obj.depth * this.maxDepth) + y;
    }

    *getOnscreenViews() {
        let mini = this.grid.ifromx(this.camera.minx);
        let minj = this.grid.jfromy(this.camera.miny);
        let maxi = this.grid.ifromx(this.camera.maxx);
        let maxj = this.grid.jfromy(this.camera.maxy);
        let seen = new Set();
        for (let j=minj; j<=maxj; j++) {
            for (let i=mini; i<=maxi; i++) {
                for (const view of this.grid.getij(i,j)) {
                    if (!seen.has(view.gid)) {
                        seen.add(view.gid);
                        yield view;
                    }
                }
            }
        }
    }

    iupdate(ctx) {
        // update managed views that are on screen
        let seen = new Set();
        for (const view of this.getOnscreenViews()) {
            seen.add(view.gid);
            view.update(ctx);
            Stats.count("vmgr.onscreenview.update");
        }
        // update views from model updates
        for (const view of this.modelViewUpdates) {
            if (!seen.has(view.gid)) {
                seen.add(view.gid);
                view.update(ctx);
                Stats.count("vmgr.model.update");
            }
        }
        this.modelViewUpdates = [];
        // update ui views
        for (const view of this.uiViews) {
            if (!seen.has(view.gid)) {
                seen.add(view.gid);
                this.uiUpdated |= view.update(ctx);
                Stats.count("vmgr.ui.update");
            }
        }
        // prepare sliced view
        if (!this.sliceReady) {
            this.sliceIdxs = {};
            // resolve updated views into grid indices
            for (const view of this.updatedViews) {
                //let minx = view.minx - this.camera.minx;
                let minx = view.minx;
                let rminx = minx;
                //let miny = view.miny - this.camera.miny;
                let miny = view.miny;
                let rminy = miny;
                //let maxx = view.maxx - this.camera.minx;
                let maxx = view.maxx;
                let rmaxx = maxx;
                //let maxy = view.maxy - this.camera.miny;
                let maxy = view.maxy;
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
                //if (view.model.tag === "player") {
                    //console.log(`handle updated view: ${view} min: ${minx},${miny}, max: ${maxx},${maxy} coords min: ${this.grid.ifromx(rminx)},${this.grid.jfromy(rminy)}, max: ${maxi},${maxj}`);
                    //console.log(`model pos: ${view.model.x},${view.model.y} view model wpos: ${view.wmodelX},${view.wmodelY}`);
                //}
                for (let i=this.grid.ifromx(rminx); i<=maxi; i++) {
                    for (let j=this.grid.jfromy(rminy); j<=maxj; j++) {
                        this.sliceReady = true;
                        // compute grid index
                        this.sliceIdxs[this.grid.idxfromij(i, j)] = true;
                    }
                }
                //console.log("idxs are: " + Object.keys(this.sliceIdxs));
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
                        this.viewSize,
                        this.viewSize,
                    );
                    //console.log(`gidx: ${gidx} gives bounds: ${bounds}`);
                    for (const view of this.grid.findOverlaps(bounds, (v) => v.cat === "View")) {
                        //console.log(`+++ ${gidx} check ${view}`);
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
        if (this.camera.minx || this.camera.miny) {
            this.renderCtx.translate(-this.camera.minx, -this.camera.miny);
        }
        if (this.camera.minx !== this.lastCameraX || this.camera.miny !== this.lastCameraY) {
            this.lastCameraX = this.camera.minx;
            this.lastCameraY = this.camera.miny;
            this.renderall = true;
        }
        // handle rendering of all views
        if (this.renderall) {
            // clear current context
            this.renderCtx.fillStyle = 'black';
            this.renderCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.slicedSorted.clear(false);
            // render in layer/depth sorted order
            for (const view of this.getOnscreenViews()) {
                view.render(this.renderCtx);
                this.slicedSorted.add(view);
            }
            for (const view of this.slicedSorted) {
                //console.log("==== render view: " + view);
                view.render(this.renderCtx);
            }
            this.renderall = false;
        // handle rendering of sliced views only
        } else if (this.sliceReady) {
            this.sliceReady = false;
            // sliced views get rendered to the slice context
            for (const view of this.slicedSorted) {
                //console.log("==== render view: " + view);
                view.render(this.sliceCtx);
            }
            this.sliceCtx.resetTransform();
            // finally, copy the canvas for each slice index to the main rendering context
            for (const gidx of Object.keys(this.sliceIdxs)) {
                let minx = this.grid.xfromidx(gidx, false);
                let miny = this.grid.yfromidx(gidx, false);
                this.renderCtx.drawImage(this.sliceCanvas, 
                    minx, miny, this.viewSize, this.viewSize, 
                    minx, miny, this.viewSize, this.viewSize);
            }
        }
        // restore transform matrix (clears any xform apply/revert floating point deltas)
        this.renderCtx.resetTransform();
        // render ui views
        if (this.uiUpdated) {
            this.uiUpdated = false;
            //this.uiCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.uiCtx.clearRect(0, 0, this.uiCanvas.width, this.uiCanvas.height);
            //console.log("ui updated");
            for (const view of this.uiViews) {
                view.render(this.uiCtx);
                //console.log(`render ui view: ${view}`);
            }
        }
    }

    add(view) {
        // ignore views that are not roots
        if (!view || view.parent) return;
        //if (view.cls !== "ModelView") console.log(`adding view: ${view}`);
        if (view.ui) {
            this.uiViews.push(view);
            this.uiUpdated = true;
        } else {
            //if (this.dbg) console.log(`adding view ${view} w/ vidx: ${view.vidx}`);
            // listen for view updates
            view.evtUpdated.listen(this.onViewUpdate)
            if (view.model) view.model.evtUpdated.listen(this.onModelUpdate);
            // assign index
            let vidx = this.vidx(view);
            view.vidx = vidx;
            //console.log(`add view ${view} with vidx: ${view.vidx} y: ${view.y}`);
            //this.sorted.add(view);
            this.grid.add(view);
        }
    }

    remove(view) {
        //if (this.dbg) console.log("removing view: " + view);
        if (view.ui) {
            let idx = this.uiViews.indexOf(view);
            if (idx !== -1) this.uiViews.splice(idx, 1);
        } else {
            this.grid.remove(view);
            //this.sorted.remove(view);
            // remove from view updates
            if (view.model) view.model.evtUpdated.ignore(this.onModelUpdate);
            view.evtUpdated.ignore(this.onViewUpdate)
            this.updatedViews.push(view);
        }
    }

    clear() {
        //this.sorted.clear();
        // FIXME: handle grid clear
    }


}
