export { PlayState };

import { State }            from "./base/state.js";
import { Base }             from "./base/base.js";
import { Keys }             from "./base/keys.js";
import { Util }             from "./base/util.js";
import { Fmt }              from "./base/fmt.js";
import { Config }           from "./base/config.js";
import { LevelNode }        from "./lvlGraph.js";
import { Mouse }            from "./base/mouse.js";
import { World }            from "./world.js";
import { GridView }         from "./base/gridView.js";
import { Area, AreaView }   from "./base/area.js";
import { ModelView }        from "./modelView.js";
import { Camera } from "./base/camera.js";

class PlayState extends State {
    cpre(spec) {
        super.cpre(spec);
        let xlvl = World.xlvl;
        const media = spec.media || Base.instance.media;
        // construct the UI elements
        spec.xvmgr = {
            cls: "LayeredViewMgr",
            worldWidth: xlvl.columns * Config.tileSize,
            worldHeight: xlvl.rows * Config.tileSize,
            dbg: true,
        };
        spec.xview = {};
        spec.xxview = {
            cls: "UxCanvas",
            cvsid: "canvas",
            tag: "cvs.0",
            xchildren: [
                /*
                {
                    tag: "daylight.filter",
                    cls: "UxDaylightFilter",
                },
                */
                {
                    cls: "UxPanel",
                    tag: "mainPanel",
                    xsketch: media.get("btnGoldTranS1"),
                }
            ],
        };
        spec.xmodel = World.xlvl;
    }


    cpost(spec) {
        super.cpost(spec);
        this.camera = spec.camera || Camera.main;
        //this.camera.dbg = true;

        Util.bind(this, "onKeyDown", "onClicked");
        Keys.evtKeyPressed.listen(this.onKeyDown);
        Mouse.evtClicked.listen(this.onClicked)
        let gridView = new GridView({depth: 10, grid: this.grid, xxform: {scalex: 2, scaley: 2}});

        // load level objects
        this.model.load();

        // lookup object references
        this.player = this.findFirst(v=>v.tag === "player");
        console.log(`PlayState player is ${this.player}`);
        // hook camera
        this.camera.trackTarget(this.player);
        this.camera.trackWorld(this.model);

    }

    get grid() {
        return this.model.grid;
    }

    onKeyDown(evt) {
        //console.log("onKeyDown: " + Fmt.ofmt(evt));
        if (evt.key === "2") {
            Config.dbg.viewColliders = !Config.dbg.viewColliders;
            this.viewMgr.renderall = true;
        }
        if (evt.key === "3") {
            Config.dbg.viewAreas = !Config.dbg.viewAreas;
            this.viewMgr.renderall = true;
        }
        if (evt.key === "4") {
            Config.dbg.viewGrid = !Config.dbg.viewGrid;
            this.viewMgr.renderall = true;
        }
        if (evt.key === "+") this.testiters += 100;
        if (evt.key === "-") this.testiters -= 100;
        if (evt.key === "#") this.testraw = !this.testraw;
        if (evt.key === "*") console.log(`player: ${this.player.miny},${this.player.maxy}`);
    }

    onClicked(evt) {
        console.log("onClicked: " + Fmt.ofmt(evt));
        let idx = this.grid.idxfromxy(evt.x, evt.y);
        console.log("idx is: " + idx);
        // FIXME: click is local, need world
        let target = new LevelNode(evt.x, evt.y, 0);

        console.log("target: " + target);
        this.player.wantPathTo = target;
    }

    onGizmoCreate(evt) {
        if (!this.active) return;
        super.onGizmoCreate(evt);
        let gzo = evt.actor;
        if (gzo.cat === "Model") {
            // add to level
            this.model.add(gzo);
            // add view
            this.addView(gzo);
        }
    }

    onGizmoDestroy(evt) {
        if (!this.active) return;
        super.onGizmoDestroy(evt);
        let gzo = evt.actor;
        if (gzo.cat === "Model") {
            this.model.remove(gzo);
        }
    }

    addView(obj) {
        let view;
        if (obj instanceof(Area)) {
            let xview = {
                area: obj,
            }
            view = new AreaView(xview);
        } else {
            let xview = {
                cls: "ModelView",
                xsketch: obj.xsketch,
                xxform: Object.assign({scalex:2, scaley:2}, obj.xxform),
                model: obj,
            };
            view = new ModelView(xview);
        }
        // rig model destroy to view destroy
        if (view) obj.evtDestroyed.listen((evt) => view.destroy());
    }

    *findOverlaps(bounds, filter=(v) => true) {
        yield *this.grid.findOverlaps(bounds, filter);
    }


}
