export { EditorState };

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
import { Color } from "./base/color.js";
import { Templates } from "./templates.js";
import { Hierarchy } from "./base/hierarchy.js";

class EditorState extends State {
    cpre(spec) {
        super.cpre(spec);
        let xlvl = World.xlvl;
        const media = spec.media || Base.instance.media;
        // construct the UI elements
        spec.xvmgr = {
            //cls: "LayeredViewMgr",
            cls: "ViewMgr",
            worldWidth: xlvl.columns * Config.tileSize,
            worldHeight: xlvl.rows * Config.tileSize,
            dbg: true,
        };
        spec.xview = {
            cls: "UxCanvas",
            cvsid: "canvas",
            resize: true,
            ui: true,
            xchildren: [
                Templates.editorPanel("gridPanel", { xxform: { right: .3, bottom: .3 }, xchildren: [
                ]}),
                Templates.editorPanel("widgetPanel", { xxform: { left: .7, bottom: .3 }, xchildren: [
                    Templates.editorTitle("title", "Spark Editor", { xxform: { offset: 10, bottom: .9 }}),
                    Templates.emptyPanel("mainButtons", { xxform: { offset: 15, top: .1, bottom: .8 }, xchildren: [
                        Templates.editorButton("newButton", "new", { xxform: { right: .75 }}),
                        Templates.editorButton("loadButton", "load", { xxform: { left: .25, right: .5 }}),
                        Templates.editorButton("editButton", "edit", { xxform: { left: .5, right: .25 }}),
                        Templates.editorButton("saveButton", "save", { xxform: { left: .75 }}),
                    ]}),
                    Templates.editorTitle("layerTitle", "Selected Layer/Depth", { xxform: { offset: 10, bottom: .7, top: .2 }}),
                    Templates.emptyPanel("layerButtons", { xxform: { top: .3, left: .15, right: .15, bottom: .025 }, xchildren: [
                        Templates.editorButton("l1.bgButton", "layer1 background", { xxform: { top: 0/12, bottom: 1-1/12 }}),
                        Templates.editorButton("l1.bgoButton", "layer1 bg overlay", { xxform: { top: 1/12, bottom: 1-2/12 }}),
                        Templates.editorButton("l1.fgButton", "layer1 foreground", { xxform: { top: 2/12, bottom: 1-3/12 }}),
                        Templates.editorButton("l1.fgoButton", "layer1 fg overlay", { xxform: { top: 3/12, bottom: 1-4/12 }}),

                        Templates.editorButton("l2.bgButton", "layer2 background", { xxform: { top: 4/12, bottom: 1-5/12 }}),
                        Templates.editorButton("l2.bgoButton", "layer2 bg overlay", { xxform: { top: 5/12, bottom: 1-6/12 }}),
                        Templates.editorButton("l2.fgButton", "layer2 foreground", { xxform: { top: 6/12, bottom: 1-7/12 }}),
                        Templates.editorButton("l2.fgoButton", "layer2 fg overlay", { xxform: { top: 7/12, bottom: 1-8/12 }}),

                        Templates.editorButton("l3.bgButton", "layer3 background", { xxform: { top: 8/12, bottom: 1-9/12 }}),
                        Templates.editorButton("l3.bgoButton", "layer3 bg overlay", { xxform: { top: 9/12, bottom: 1-10/12 }}),
                        Templates.editorButton("l3.fgButton", "layer3 foreground", { xxform: { top: 10/12, bottom: 1-11/12 }}),
                        Templates.editorButton("l3.fgoButton", "layer3 fg overlay", { xxform: { top: 11/12, bottom: 1-12/12 }}),
                    ]}),
                ]}),
                Templates.editorPanel("tilePanel", { xxform: { top: .7 }, xchildren: [

                    Templates.emptyPanel("toolButtons", { xxform: { offset: 15, right: .85 }, xchildren: [
                        Templates.editorSelectButton("paint", "paint", { xxform: { bottom: .8 }}),
                        Templates.editorSelectButton("fill", "fill", { xxform: { top:.2, bottom: .6 }}),
                        Templates.editorSelectButton("get", "get", { xxform: { top:.4, bottom: .4 }}),
                        Templates.editorSelectButton("delete", "delete", { xxform: { top:.6, bottom: .2 }}),
                        Templates.editorButton("filter", "filter", { xxform: { top: .8 }}),
                    ]}),

                    Templates.emptyPanel("selectTileButtons", { xxform: { offset: 15, left: .15, right: .8 }, xchildren: [
                        Templates.editorSelectButton("currentTile", "1", { xxform: { bottom: .8 }}),
                        Templates.editorSelectButton("helpTile.1", "2", { xxform: { top: .2, bottom: .6 }}),
                        Templates.editorSelectButton("helpTile.2", "3", { xxform: { top: .4, bottom: .4 }}),
                        Templates.editorSelectButton("helpTile.3", "4", { xxform: { top: .6, bottom: .2 }}),
                        Templates.editorSelectButton("helpTile.4", "5", { xxform: { top: .8 }}),
                    ]}),

                    Templates.emptyPanel("availableTileButtons", { xxform: { offset: 15, left: .25 }, xchildren: [
                    ]}),

                ]}),
            ],
        };
        //spec.xmodel = World.xlvl;
        //spec.xmodel = { cls: "Level" };
    }


    cpost(spec) {
        super.cpost(spec);
        this.camera = spec.camera || Camera.main;

        console.log(`main view: ${this.view} xform: ${this.view.xform} min: ${this.view.minx},${this.view.miny} max: ${this.view.maxx},${this.view.maxy}`);

        Util.bind(this, "onKeyDown", "onClicked");
        Keys.evtKeyPressed.listen(this.onKeyDown);
        Mouse.evtClicked.listen(this.onClicked)

        // load level objects
        //this.model.load();
        // setup state
        this.toolMode = "paint";

        // lookup object references
        this.gridPanel = Hierarchy.find(this.view, v=>v.tag === "gridPanel");
        for (const tool of ["paint", "fill", "get", "delete"]) {
            this[`${tool}Select`] = Hierarchy.find(this.view, v=>v.tag === `${tool}.select`);
            this[`${tool}Button`] = Hierarchy.find(this.view, v=>v.tag === `${tool}.button`);
            this[`${tool}Button`].evtClicked.listen((evt) => this.toolMode = tool);
            console.log(`tool: ${tool}`);
        }
        this.paintSelect = Hierarchy.find(this.view, v=>v.tag === "paint.select");
        this.paintButton = Hierarchy.find(this.view, v=>v.tag === "paint.button");
        this.fillSelect = Hierarchy.find(this.view, v=>v.tag === "fill.select");
        this.fillButton = Hierarchy.find(this.view, v=>v.tag === "fill.button");

        // wire callbacks
        //this.paintButton.evtClicked.listen((evt) => this.toolMode = "paint");
        //this.fillButton.evtClicked.listen((evt) => this.toolMode = "fill" );
        //this.paintSelect = this.findFirst(v=>v.tag === "paint.select");
        //this.paintButton = this.findFirst(v=>v.tag === "paint.button");
        //this.fillSelect = this.findFirst(v=>v.tag === "fill.select");
        //this.fillButton = this.findFirst(v=>v.tag === "fill.button");
        console.log(`grid panel: ${this.gridPanel}`);
        console.log(`paint select: ${this.paintSelect}`);
        console.log(`paint button: ${this.paintButton}`);
        // hook camera
        //if (this.player) this.camera.trackTarget(this.player);
        //this.camera.trackWorld(this.model);

        console.log(`view is ${this.view}`);

    }

    /*
    get grid() {
        return this.model.grid;
    }
    */

    onKeyDown(evt) {
        console.log("onKeyDown: " + Fmt.ofmt(evt));
        /*
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
        */
    }

    onClicked(evt) {
        console.log("onClicked: " + Fmt.ofmt(evt));
        /*
        let x = evt.x/Config.renderScale;
        let y = evt.y/Config.renderScale;
        let idx = this.grid.idxfromxy(x, y);
        console.log("idx is: " + idx);
        */
    }

    iupdate(ctx) {
        super.iupdate(ctx);
        this.updateToolPanel(ctx);
    }

    /*
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
    */

    /*
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
    */

    /*
    *findOverlaps(bounds, filter=(v) => true) {
        yield *this.grid.findOverlaps(bounds, filter);
    }
    */


    updateToolPanel(ctx) {
        if (this.toolMode !== this.lastToolMode) {
            this.lastToolMode = this.toolMode;
            this.paintSelect.visible = (this.toolMode === "paint");
            this.fillSelect.visible = (this.toolMode === "fill");
            this.getSelect.visible = (this.toolMode === "get");
            this.deleteSelect.visible = (this.toolMode === "delete");
        }
    }

}
