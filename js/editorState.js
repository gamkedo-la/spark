export { UxEditorView, EditorState };

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
import { Generator } from "./base/generator.js";
import { UxPanel } from "./base/uxPanel.js";

class UxEditorView extends UxPanel {
    cpost(spec) {
        super.cpost(spec);
        this.xregion = spec.xregion;
    }

    renderGrid(ctx) {
        ctx.strokeStyle = "rgba(255,255,0,.25";
        ctx.lineWidth = 1;
        // vertical
        for (let i=0; i<=this.xregion.columns; i++) {
            ctx.beginPath()
            ctx.moveTo(i*Config.tileSize,0);
            ctx.lineTo(i*Config.tileSize,Config.tileSize*this.xregion.rows);
            ctx.stroke();
        }
        // horizontal
        for (let i=0; i<=this.xregion.rows; i++) {
            ctx.beginPath()
            ctx.moveTo(0,i*Config.tileSize);
            ctx.lineTo(Config.tileSize*this.xregion.columns,i*Config.tileSize);
            ctx.stroke();
        }
    }

    buildViews() {
        // FIXME
        let xview = {
            cls: "ModelView",
            xsketch: obj.xsketch,
            xxform: Object.assign({scalex:Config.renderScale, scaley:Config.renderScale}, obj.xxform),
            model: obj,
        };
        view = new ModelView(xview);
    }

    _render(ctx) {
        super._render(ctx);
		//ctx.translate(-camera.x, -camera.y);
        if (Config.renderScale !== 1) {
            ctx.scale(Config.renderScale, Config.renderScale);
        }
        this.renderGrid(ctx);
        if (Config.renderScale !== 1) ctx.scale(1/Config.renderScale, 1/Config.renderScale);
		//ctx.translate(camera.x, camera.y);
    }
}

class EditorState extends State {
    cpre(spec) {
        super.cpre(spec);
        let xlvl = World.xlvl;
        let xregion = World.vendor1;
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
                    {
                        cls: "UxEditorView",
                        tag: "editorView",
                        xregion: xregion,
                        xsketch: {},
                        xxform: { offset: 10 },
                    }
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
                        Templates.editorSelectButton("l1.bg", "layer1 background", { xxform: { top: 0/12, bottom: 1-1/12 }}),
                        Templates.editorSelectButton("l1.bgo", "layer1 bg overlay", { xxform: { top: 1/12, bottom: 1-2/12 }}),
                        Templates.editorSelectButton("l1.fg", "layer1 foreground", { xxform: { top: 2/12, bottom: 1-3/12 }}),
                        Templates.editorSelectButton("l1.fgo", "layer1 fg overlay", { xxform: { top: 3/12, bottom: 1-4/12 }}),

                        Templates.editorSelectButton("l2.bg", "layer2 background", { xxform: { top: 4/12, bottom: 1-5/12 }}),
                        Templates.editorSelectButton("l2.bgo", "layer2 bg overlay", { xxform: { top: 5/12, bottom: 1-6/12 }}),
                        Templates.editorSelectButton("l2.fg", "layer2 foreground", { xxform: { top: 6/12, bottom: 1-7/12 }}),
                        Templates.editorSelectButton("l2.fgo", "layer2 fg overlay", { xxform: { top: 7/12, bottom: 1-8/12 }}),

                        Templates.editorSelectButton("l3.bg", "layer3 background", { xxform: { top: 8/12, bottom: 1-9/12 }}),
                        Templates.editorSelectButton("l3.bgo", "layer3 bg overlay", { xxform: { top: 9/12, bottom: 1-10/12 }}),
                        Templates.editorSelectButton("l3.fg", "layer3 foreground", { xxform: { top: 10/12, bottom: 1-11/12 }}),
                        Templates.editorSelectButton("l3.fgo", "layer3 fg overlay", { xxform: { top: 11/12, bottom: 1-12/12 }}),
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

                    Templates.emptyPanel("tileButtonsPanel", { xxform: { offset: 15, left: .2 }, xchildren: [
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
        this.assets = spec.assets || Base.instance.assets;   

        Util.bind(this, "onKeyDown", "onClicked", "onTileSelected");
        Keys.evtKeyPressed.listen(this.onKeyDown);
        Mouse.evtClicked.listen(this.onClicked)

        // setup state
        this.toolMode = "paint";
        this.layerMode = "l1.fg";
        this.tileButtons = [];

        this.xregion = World.vendor1;

        // lookup object references
        // wire callbacks
        this.gridPanel = Hierarchy.find(this.view, v=>v.tag === "gridPanel");
        this.tileButtonsPanel = Hierarchy.find(this.view, v=>v.tag === "tileButtonsPanel");
        for (const tool of ["paint", "fill", "get", "delete"]) {
            this[`${tool}Select`] = Hierarchy.find(this.view, v=>v.tag === `${tool}.select`);
            this[`${tool}Button`] = Hierarchy.find(this.view, v=>v.tag === `${tool}.button`);
            this[`${tool}Button`].evtClicked.listen((evt) => this.toolMode = tool);
        }
        for (const layer of ["l1", "l2", "l3"]) {
            for (const depth of ["bg", "bgo", "fg", "fgo"]) {
                this[`${layer}${depth}Select`] = Hierarchy.find(this.view, v=>v.tag === `${layer}.${depth}.select`);
                this[`${layer}${depth}Button`] = Hierarchy.find(this.view, v=>v.tag === `${layer}.${depth}.button`);
                this[`${layer}${depth}Button`].evtClicked.listen((evt) => this.layerMode = `${layer}.${depth}`);
            }
        }

        // hook camera
        //if (this.player) this.camera.trackTarget(this.player);
        //this.camera.trackWorld(this.model);

        console.log(`view is ${this.view}`);

        // build out dynamic UI elements
        this.buildTileButtons();

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

    onTileSelected(evt) {
        console.log("onTileSelected: " + Fmt.ofmt(evt));
    }

    iupdate(ctx) {
        super.iupdate(ctx);
        this.updateToolPanel(ctx);
        this.updateLayerPanel(ctx);
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

    updateLayerPanel(ctx) {
        if (this.layerMode !== this.lastLayerMode) {
            this.lastLayerMode = this.layerMode;
            for (const layer of ["l1", "l2", "l3"]) {
                for (const depth of ["bg", "bgo", "fg", "fgo"]) {
                    this[`${layer}${depth}Select`].visible = (this.layerMode === `${layer}.${depth}`);
                }
            }
        }
    }

    destroyTileButtons() {
        for (const b of this.tileButtons) {
            b.destroy();
        }
        this.tileButtons = [];
    }

    buildTileButtons() {
        this.destroyTileButtons();
        let row = 0;
        let col = 0;
        let maxCols = Math.floor(this.tileButtonsPanel.width/40);
        let colStep = 1/maxCols;
        let maxRows = Math.floor(this.tileButtonsPanel.height/40);
        let rowStep = 1/maxRows;
        // add button for rest of tileset assets
        for (const asset of this.assets) {
            if (!asset.id || !asset.xsketch) continue;
            let bspec = {
                cls: "UxButton",
                dfltDepth: this.tileButtonsPanel.depth + 1,
                dfltLayer: this.tileButtonsPanel.layer,
                parent: this.tileButtonsPanel,
                xxform: {parent: this.tileButtonsPanel.xform, left: col*colStep, right: 1-(col+1)*colStep, top: row*rowStep, bottom: 1-(row+1)*rowStep},
                xunpressed: Object.assign({}, asset.xsketch, { lockRatio: true, xfitter: { cls: "FitToParent" } }),
                xtext: {text: " " + asset.id.toString() + " ", color: new Color(255,255,0,.175)},
            };
            //console.log(`bspec: ${Fmt.ofmt(bspec)}`);
            let b = Generator.generate(bspec);
            if (b) {
                b.assetId = asset.id;
                b.evtClicked.listen(this.onTileSelected);
                this.tileButtonsPanel.adopt(b);
                col++;
                if (col >= maxCols) {
                    row++;
                    col = 0;
                }
                this.tileButtons.push(b);
            }
        }
    }

}
