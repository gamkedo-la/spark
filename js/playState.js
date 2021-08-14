export { PlayState };

import { State }            from "./base/state.js";
import { Base }             from "./base/base.js";
import { Keys }             from "./base/keys.js";
import { Util }             from "./base/util.js";
import { Fmt }              from "./base/fmt.js";
import { Config }           from "./base/config.js";
import { LevelNode }        from "./lvlGraph.js";
import { Mouse }            from "./base/mouse.js";
import { Color }            from "./base/color.js";
import { World }            from "./world.js";
import { GridView }         from "./base/gridView.js";
import { Area, AreaView }   from "./base/area.js";
import { ModelView }        from "./modelView.js";
import { Camera }           from "./base/camera.js";
import { Generator } from "./base/generator.js";
import { UxGloom } from "./uxGloom.js";
import { Templates } from "./templates.js";

class PlayState extends State {

    static actionSketches = {
        "none":         {cls: "Text", text: "X", xfitter: { cls: "FitToParent"}, color: new Color(225,0,0,.75)},
        "interact":     {cls: "Text", text: "i", xfitter: { cls: "FitToParent"}, color: new Color(225,0,0,.75)},
        "spark":        {cls: "Text", text: "#", xfitter: { cls: "FitToParent"}, color: new Color(225,0,0,.75)},
    };

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
                    xchildren: [
                        {
                            cls: "UxPanel",
                            tag: "zPanel",
                            xxform: {oleft: 40, otop: 40, right: .91, bottom: .885},
                            xtext: {},
                            xsketch: { cls: 'Rect', color: new Color(50,50,50,1), borderWidth: 5, borderColor: new Color(0,0,0,1) },
                        },
                        Templates.playIconButton("menu", { cls: "Text", text: "*" }, { xxform: {oright: 40, otop: 40, left: .91, bottom: .885}}),
                        Templates.playIconButton("morale", { cls: "Text", text: "8>" }, { xxform: {otop: 40, right: .09, left: .86, bottom: .885}}),

                    ],
                },
                Templates.panel("dbgPanel", {xxform: { left: .8, right: .025, top: .125, bottom: .6 }, xchildren: [
                    Templates.dbgText(null, "1 - hide debug", { xxform: { top: 0/6, bottom: 1-1/6 }}),
                    Templates.dbgText(null, "2 - show colliders", { xxform: { top: 1/6, bottom: 1-2/6 }}),
                    Templates.dbgText(null, "3 - show areas", { xxform: { top: 2/6, bottom: 1-3/6 }}),
                    Templates.dbgText(null, "4 - show grid", { xxform: { top: 3/6, bottom: 1-4/6 }}),
                    Templates.dbgText(null, "5 - hide night", { xxform: { top: 4/6, bottom: 1-5/6 }}),
                    Templates.dbgText(null, "6 - hide gloom", { xxform: { top: 5/6, bottom: 1-6/6 }}),
                ]}),
            ],
        };
        spec.xmodel = World.xlvl;
        //spec.xmodel = { cls: "Level" };
    }


    cpost(spec) {
        super.cpost(spec);
        this.camera = spec.camera || Camera.main;
        //this.camera.dbg = true;

        Util.bind(this, "onKeyDown", "onClicked", "onMenu", "onMorale");
        Keys.evtKeyPressed.listen(this.onKeyDown);
        Mouse.evtClicked.listen(this.onClicked);
        let gridView = new GridView({depth: 10, grid: this.grid, xxform: {scalex: Config.renderScale, scaley: Config.renderScale}});
        let gloomView = new UxGloom({
            tag: "gloom", 
            depth: 10, 
            xxform: {
                dx: 16*0, 
                dy: 16*0, 
                origx: 0, 
                origy: 0, 
                border: .5, 
                width: 16*this.model.columns, 
                height: 16*this.model.rows, 
                scalex: Config.renderScale, 
                scaley: Config.renderScale
            },
        });

        // load level objects
        this.model.load();

        // lookup object references
        this.player = this.findFirst(v=>v.tag === "player");
        this.dbgPanel = this.findFirst(v=>v.tag === "dbgPanel");
        this.menuButton = this.findFirst(v=>v.tag === "menu");
        console.log(`menuButton: ${this.menuButton}`);
        this.menuButton.evtClicked.listen(this.onMenu);
        this.moraleButton = this.findFirst(v=>v.tag === "morale");
        console.log(`moraleButton: ${this.moraleButton}`);
        this.moraleButton.evtClicked.listen(this.onMorale);
        this.zPanel = this.findFirst(v=>v.tag === "zPanel");
        console.log(`zPanel: ${this.zPanel}`);
        //console.log(`PlayState player is ${this.player}`);
        // hook camera
        if (this.player) this.camera.trackTarget(this.player);
        this.camera.trackWorld(this.model);

    }

    get grid() {
        return this.model.grid;
    }

    onKeyDown(evt) {
        //console.log("onKeyDown: " + Fmt.ofmt(evt));
        if (evt.key === "1") {
            this.dbgPanel.visible = !this.dbgPanel.visible;
        }
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
            Config.dbg.hideNight = !Config.dbg.hideNight;
            this.viewMgr.renderall = true;
        }
        if (evt.key === "6") {
            Config.dbg.hideGloom = !Config.dbg.hideGloom;
            this.viewMgr.renderall = true;
        }
        if (evt.key === "+") this.testiters += 100;
        if (evt.key === "-") this.testiters -= 100;
        if (evt.key === "#") this.testraw = !this.testraw;
        if (evt.key === "*") console.log(`player: ${this.player.miny},${this.player.maxy}`);
    }

    onClicked(evt) {
        // ignore if within button
        if (this.moraleButton.mouseOver || this.menuButton.mouseOver) return;
        //let localMousePos = this.editorPanel.xform.getLocal(new Vect(evt.x, evt.y))
        console.log("onClicked: " + Fmt.ofmt(evt));
        let x = evt.x + this.camera.minx;
        let y = evt.y + this.camera.miny;
        x = x/Config.renderScale;
        y = y/Config.renderScale;
        let idx = this.grid.idxfromxy(x, y);
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

    onMorale(evt) {
        console.log("onMorale clicked");
    }

    onMenu(evt) {
        console.log("onMenu clicked");
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
        if (this.music) this.music.stop();
        Keys.evtKeyPressed.ignore(this.onKeyDown);
        Mouse.evtClicked.ignore(this.onClicked);
        super.destroy();
    }


    updateZPanel(ctx) {
        // determine current action
        // FIXME
        let action = "spark";
        if (this.lastAction !== action) {
            // update z panel w/ new icon for given action
            let sketch = Generator.generate(PlayState.actionSketches[action]);
            console.log(`assigning zpanel sketch: ${sketch}`);
            this.zPanel.sketch = sketch;
            this.lastAction = action;
            return true;
        }
        return false;
    }

    firstUpdate(ctx) {
        this.music = Generator.generate(Base.instance.media.get("gameplayMusic"));
        console.log(`this.music: ${this.music}`);
        this.music.play();
    }

    iupdate(ctx) {
        if (!this.firstUpdated) {
            this.firstUpdated = true;
            this.firstUpdate(ctx);
        }
        this.updated = super.iupdate(ctx);
        this.udpated |= this.updateZPanel(ctx);
        return this.updated;
    }

}
