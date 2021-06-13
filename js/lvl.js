export { Level, LevelCtrl };

import { Base }             from "./base/base.js";
import { Fmt }              from "./base/fmt.js";
import { Model }            from "./base/model.js";
import { UxCtrl }           from "./base/uxCtrl.js";
import { EvtChannel }       from "./base/event.js";
import { Util }             from "./base/util.js";
import { Grid }             from "./base/grid.js";
import { Area, AreaView }   from "./base/area.js";
import { Region }           from "./region.js";
import { ModelView }        from "./modelView.js";
import { Config }           from "./base/config.js";

class Level extends Model {
    cpost(spec) {
        this.name = spec.name || "lvl";
        this.width = spec.width || 16;
        this.height = spec.height || 12;
        this.nentries = this.width * this.height;
        this.layerMap = spec.layerMap || Config.layerMap;
        this.depthMap = spec.depthMap || Config.depthMap;

        // grid maintains list of all interactable objects based on location
        // -- an object may be assigned more than one grid slot if it overlaps multiple grid locations
        this.grid = new Grid(spec);
        this.sketchSize = spec.sketchSize || Config.tileSize;
        this.halfSize = Math.round(this.sketchSize * .5);
        this._maxx = this.sketchSize * this.width;
        this._maxy = this.sketchSize * this.height;
        this.dbg = spec.dbg;

        // -- events/handlers
        Util.bind(this, "onObjectDestroy");
        this.__evtAdded = new EvtChannel("added", {actor: this});
        this.__evtRemoved = new EvtChannel("removed", {actor: this});

        // load level areas
        this.assets = spec.assets || Base.instance.assets;
        this.generator = spec.generator || Base.instance.generator;
        let xregions = spec.xregions || [];
        for (const xregion of xregions) {
            let region = new Region(Object.assign({
                assets: this.assets, 
                generator: this.generator,
                layerMap: this.layerMap,
                depthMap: this.depthMap,
                sketchSize: this.sketchSize,
            }, xregion));
            for (const gzo of region.areas) this.add(gzo);
            for (const gzo of region.objs) this.add(gzo);
        }

    }

    // PROPERTIES ----------------------------------------------------------
    get minx() { return 0 };
    get maxx() { return this._maxx };
    get miny() { return 0 };
    get maxy() { return this._maxy };

    // EVENTS --------------------------------------------------------------
    get evtAdded() { return this.__evtAdded; }
    get evtRemoved() { return this.__evtRemoved; }

    // EVENT HANDLERS ------------------------------------------------------
    onObjectDestroy(evt) {
        this.remove(evt.actor);
    }

    assignGrid(obj) {
        if (Model.hasPos(obj)) {
            // get grid index
            let idx = this.idxfromxy(obj.x, obj.y);
            if (idx != obj.gidx) {
                this.clearGrid(obj);
                if (!this.grid[idx]) this.grid[idx] = [];
                this.grid[idx].push(obj);
                obj.gidx = idx;
            }
        }
    }

    clearGrid(obj) {
        if (!obj.hasOwnProperty("gidx")) return;
        if (Model.hasPos(obj)) {
            let garr = this.grid[obj.gidx];
            if (garr) {
                let idx = garr.indexOf(obj);
                if (idx !== -1) garr.splice(idx, 1);
            }
        }
    }

    idxfromxy(x,y) {
        let i = Math.floor(x/this.sketchSize);
        let j = Math.floor(y/this.sketchSize);
        if (i < 0) i = 0;
        if (j < 0) j = 0;
        if (i >= this.width) i = this.width-1;
        if (j >= this.height) j = this.height-1;
        return i + this.width*j;
    }

    add(obj) {
        // handle grid assignment...
        this.grid.add(obj);
        // handle parent/child assignmnt...
        this.adopt(obj);
        // handle object destroy
        obj.evtDestroyed.listen(this.onObjectDestroy);
        // trigger added
        if (this.evtAdded) this.evtAdded.trigger({target: obj});
    }

    remove(obj) {
        // remove grid assignment
        this.grid.remove(obj);
        // remove parent/child assignment
        this.orphan(obj);
        // remove listeners
        obj.evtDestroyed.ignore(this.onObjectDestroy);
        // trigger removed
        this.evtRemoved.trigger({target: obj});
    }

    update(ctx) {
        //console.log("lvl updated");
        return super.update(ctx);
    }

}

class LevelCtrl extends UxCtrl {
    cpre(spec) {
        spec.xview = {};
    }
    cpost(spec) {
        super.cpost(spec);
        this.viewMap = new Map();
        this.model = new Level(spec.xmodel);
        this.media = spec.media || Base.instance.media;
        // iterate through level objects
        for (const obj of this.model.children()) {
            this.addView(obj);
        }
        // -- events/handlers
        Util.bind(this, "onModelAdded", "onModelRemoved");
        this.model.evtAdded.listen(this.onModelAdded);
        this.model.evtRemoved.listen(this.onModelRemoved);
    }

    // EVENT HANDLERS ------------------------------------------------------
    onModelAdded(evt) {
        let obj = evt.actor;
        console.log("onModelAdded: " + obj);
        if (!obj) return;
        // add view
        this.addView(obj);
    }

    onModelRemoved(evt) {
        let obj = evt.actor;
        if (!obj) return;
        // remove view
        let view = this.viewMap.get(obj.gid);
        if (view) {
            view.Destroy();
            this.viewMap.delete(obj.gid);
        }
    }

    // METHODS -------------------------------------------------------------
    addView(obj) {
        if (obj instanceof(Area)) {
            let xview = {
                area: obj,
            }
            let view = new AreaView(xview);
            this.viewMap.set(obj.gid, view);
        } else {
            let xview = {
                cls: "ModelView",
                xsketch: obj.xsketch,
                xxform: Object.assign({scalex:2, scaley:2}, obj.xxform),
                //xxform: obj.xxform,
                model: obj,
                //xsketch: this.media.get(obj.tag),
                //xsketch: { cls: "Rect", color: "rgba(255,0,0,.5)", width:64, height:96},
                //getx: () => obj.x,
                //gety: () => obj.y,
                //getDepth: () => (obj.layer * maxDepth) + obj.depth,
                //getState: () => obj.state,
                //getVisible: () => obj.visible,
                //collider: obj.collider,
            };
            //console.log("xview: " + Fmt.ofmt(xview));
            let view = new ModelView(xview);
            this.viewMap.set(obj.gid, view);
        }
    }

}
