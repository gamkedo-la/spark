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
import { Camera }           from "./base/camera.js";
import { Generator } from "./base/generator.js";

class PlayState extends State {
    cpre(spec) {
        super.cpre(spec);
        let xlvl = World.xlvl;
        const media = spec.media || Base.instance.media;
        // construct the UI elements
        spec.xvmgr = {
            cls: "LayeredViewMgr",
            //cls: "ViewMgr",
            worldWidth: xlvl.columns * Config.tileSize,
            worldHeight: xlvl.rows * Config.tileSize,
            dbg: true,
        };
        //spec.xview = {};
        spec.xview = {
            cls: "UxCanvas",
            cvsid: "canvas",
            ui: true,
            tag: "cvs.0",
            //depth: 30,
            xchildren: [
                {
                    tag: "daylight.filter",
                    cls: "UxDaylightFilter",
                },
                {
                    cls: "UxPanel",
                    tag: "mainPanel",
                    xsketch: media.get("btnGoldTranS1"),
                    //xsketch: {},
                }
            ],
        };
        spec.xmodel = World.xlvl;
        //spec.xmodel = { cls: "Level" };
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
        if (this.player) this.camera.trackTarget(this.player);
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
        if (evt.key === "5") {
            let spec = Base.instance.media.get("doorClosing");
            let sound = Generator.generate(spec);
            console.log(`spec: ${Fmt.ofmt(spec)}`);
            console.log(`sound: ${Fmt.ofmt(sound)}`);
            sound.play();
        }
        if (evt.key === "+") this.testiters += 100;
        if (evt.key === "-") this.testiters -= 100;
        if (evt.key === "#") this.testraw = !this.testraw;
        if (evt.key === "*") console.log(`player: ${this.player.miny},${this.player.maxy}`);
    }

    onClicked(evt) {
        console.log("onClicked: " + Fmt.ofmt(evt));
        let x = evt.x/Config.renderScale;
        let y = evt.y/Config.renderScale;
        let idx = this.grid.idxfromxy(x, y);
        console.log("idx is: " + idx);
        let target = new LevelNode(x, y, 0);

        console.log("target: " + target);
        this.player.wantPathTo = target;
    }

    onGizmoCreate(evt) {
        if (!this.active) return;
        super.onGizmoCreate(evt);
        let gzo = evt.actor;
        if (gzo.cat === "Model") {
            if (this.model) {
                // add to level
                this.model.add(gzo);
                // add view
                this.addView(gzo);
            }
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
                xxform: Object.assign({scalex:Config.renderScale, scaley:Config.renderScale}, obj.xxform),
            }
            view = new AreaView(xview);
        } else {
            let xview = {
                cls: "ModelView",
                xsketch: obj.xsketch,
                xxform: Object.assign({scalex:Config.renderScale, scaley:Config.renderScale}, obj.xxform),
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

    destroy() {
        Keys.evtKeyPressed.ignore(this.onKeyDown);
        Mouse.evtClicked.ignore(this.onClicked);
        super.destroy();
    }


}
