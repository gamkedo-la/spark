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
import { Vect } from "./base/vect.js";
import { Bounds } from "./base/bounds.js";
import { Grid } from "./base/grid.js";

class UxEditorView extends UxPanel {
    cpost(spec) {
        super.cpost(spec);
        this.camera = spec.camera || Camera.main;
        this.xregion = spec.xregion;
        this.assets = spec.assets || Base.instance.assets;   
        this.tileViews = {};
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
        // FIXME: offx/offy to be removed
        let columns = this.xregion.columns || 0;
        let rows = this.xregion.rows || 0;
        let offx=0;
        let offy=0;
        //let offx=this.width*.5/Config.renderScale;
        //let offy=this.height*.5/Config.renderScale;
        // parse layers and layer data
        for (const layer of Object.keys(Config.layerMap)) {
            //console.log(`layer: ${layer}`);
            let layerInfo = this.xregion.layers[layer];
            if (!layerInfo) continue;
            for (const depth of Object.keys(Config.depthMap)) {
                let depthData = layerInfo[depth];
                //console.log(`depth: ${depth} ${(depthData) ? "" : " - skipping"}`);
                if (!depthData) continue;
                for (let i=0; i<columns; i++) {
                    for (let j=0; j<rows; j++) {
                        let idx = i + columns*j;
                        let id = depthData[idx];
                        if (!id) continue;
                        let flags = id[0];
                        let assetId = id.slice(1);
                        this.assignTile(layer, depth, i, j, assetId);
                    }
                }
            }
        }
    }

    assignTile(layer, depth, i, j, id) {
        // handle clean up of any old view...
        let key = `${layer}.${depth}.${i}.${j}`;
        if (this.tileViews[key]) {
            let view = this.tileViews[key];
            if (view.model) view.model.destroy();
            view.destroy();
            delete this.tileViews[key];
        }

        let layerId = Config.layerMap[layer];
        let depthId = Config.depthMap[depth];

        let xobj = this.assets.fromId(id);
        if (xobj) {
            let x = (i*Config.tileSize) + Config.halfSize;
            let y = ((j-layerId)*Config.tileSize) + Config.halfSize;
            xobj = Object.assign({
                x: x, 
                y: y, 
                depth: depthId,
                layer: layerId,
            }, xobj);
            let obj = Generator.generate(xobj);
            //console.log(`xobj: ${Fmt.ofmt(xobj)}`);
            let xview = {
                cls: "ModelView",
                xsketch: obj.xsketch,
                xxform: Object.assign({border: .5}, obj.xxform),
                model: obj,
            };
            //console.log(`xview: ${Fmt.ofmt(xview)}`);
            let view = new ModelView(xview);
            this.adopt(view);
            //console.log(`view.xform: ${view.xform} xform.stretch: ${view.xform.stretchx},${view.xform.stretchy} xform.dim: ${view.xform.width},${view.xform.height} xform.ddim: ${view.xform._dwidth},${view.xform._dheight} xform.orig: ${view.xform._origx},${view.xform._origy} xform.do: ${view.xform.dox},${view.xform.doy} min: ${view.minx},${view.miny}`);
            this.tileViews[key] = view;
        }

    }

    iupdate(ctx) {
        let updated = false;
        if (!this.firstUpdate) {
            this.firstUpdate = true;
            this.buildViews();
            updated = true;
        }
        return updated|super.iupdate(ctx);
    }

    _frender(ctx) {
        super._frender(ctx);
		//ctx.translate(-this.camera.minx, -this.camera.miny);
        //if (Config.renderScale !== 1) {
            //ctx.scale(Config.renderScale, Config.renderScale);
        //}
        this.renderGrid(ctx);
        //if (Config.renderScale !== 1) ctx.scale(1/Config.renderScale, 1/Config.renderScale);
		//ctx.translate(this.camera.minx, this.camera.miny);
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
                        tag: "editorPanel",
                        xregion: xregion,
                        xsketch: {},
                        xxform: { dx: -xregion.columns*Config.halfSize, dy: -xregion.rows*Config.halfSize, offset: 10, scalex: Config.renderScale, scaley: Config.renderScale },
                        //xxform: { dx: -xregion.columns*Config.halfSize, dy: -xregion.rows*Config.halfSize, offset: 10 },
                        //xxform: { origx: .5, origy: .5, offset: 0 },
                    }
                ]}),
                Templates.editorPanel("widgetPanel", { xxform: { left: .7, bottom: .3 }, xchildren: [
                    Templates.editorText(null, "Spark Editor", { xxform: { offset: 10, bottom: .9 }}),
                    Templates.panel("mainButtons", { xxform: { offset: 15, top: .1, bottom: .8 }, xchildren: [
                        Templates.editorButton("newButton", "new", { xxform: { right: .75 }}),
                        Templates.editorButton("loadButton", "load", { xxform: { left: .25, right: .5 }}),
                        Templates.editorButton("editButton", "edit", { xxform: { left: .5, right: .25 }}),
                        Templates.editorButton("saveButton", "save", { xxform: { left: .75 }}),
                    ]}),
                    Templates.editorText(null, "Selected Layer/Depth", { xxform: { offset: 10, bottom: .7, top: .2 }}),
                    Templates.panel("layerButtons", { xxform: { top: .3, left: .15, right: .15, bottom: .025 }, xchildren: [
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

                    Templates.panel("toolButtons", { xxform: { offset: 15, right: .85 }, xchildren: [
                        Templates.editorSelectButton("paint", "paint", { xxform: { bottom: .8 }}),
                        Templates.editorSelectButton("fill", "fill", { xxform: { top:.2, bottom: .6 }}),
                        Templates.editorSelectButton("get", "get", { xxform: { top:.4, bottom: .4 }}),
                        Templates.editorSelectButton("delete", "delete", { xxform: { top:.6, bottom: .2 }}),
                        Templates.editorButton("filter", "filter", { xxform: { top: .8 }}),
                    ]}),

                    Templates.panel("selectTileButtons", { xxform: { offset: 15, left: .14, right: .8 }, xchildren: [
                        Templates.panel("currentTile", { xxform: { bottom: .8 }}),
                        Templates.editorText(null, "1", { xxform: { offset: 5, bottom: .8 }}),
                        Templates.panel("helpTile1", { xxform: { top: .2, bottom: .6 }}),
                        Templates.editorText(null, "2", { xxform: { offset: 5, top: .2, bottom: .6 }}),
                        Templates.panel("helpTile2", { xxform: { top: .4, bottom: .4 }}),
                        Templates.editorText(null, "3", { xxform: { offset: 5, top: .4, bottom: .4 }}),
                        Templates.panel("helpTile3", { xxform: { top: .6, bottom: .2 }}),
                        Templates.editorText(null, "4", { xxform: { offset: 5, top: .6, bottom: .2 }}),
                        Templates.panel("helpTile4", { xxform: { top: .8 }}),
                        Templates.editorText(null, "5", { xxform: { offset: 5, top: .8 }}),
                    ]}),

                    Templates.panel("tileButtonsPanel", { xxform: { offset: 15, left: .2 }, xchildren: [
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

        Util.bind(this, "onKeyDown", "onClicked", "onTileSelected", "onCanvasResized");
        Keys.evtKeyPressed.listen(this.onKeyDown);
        Mouse.evtClicked.listen(this.onClicked)
        this.view.evtResized.listen(this.onCanvasResized);

        // setup state
        this.toolMode = "paint";
        this.layerMode = "l1.fg";
        this.tileButtons = [];
        this.levelViews = [];
        this.selectedTile = "003";

        this.xregion = World.vendor1;

        // lookup object references
        // wire callbacks
        this.gridPanel = Hierarchy.find(this.view, v=>v.tag === "gridPanel");
        this.editorPanel = Hierarchy.find(this.view, v=>v.tag === "editorPanel");
        console.log(`editor panel: ${this.editorPanel}`);
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
        this.currentTile = Hierarchy.find(this.view, v=>v.tag === "currentTile");
        this.helpTile1 = Hierarchy.find(this.view, v=>v.tag === "helpTile1");
        this.helpTile2 = Hierarchy.find(this.view, v=>v.tag === "helpTile2");
        this.helpTile3 = Hierarchy.find(this.view, v=>v.tag === "helpTile3");
        this.helpTile4 = Hierarchy.find(this.view, v=>v.tag === "helpTile4");

        // hook camera
        //if (this.player) this.camera.trackTarget(this.player);
        //this.camera.trackWorld(this.model);
        //this.camera._x = -32;
        //this.camera._y = -32;

        console.log(`view is ${this.view}`);

        // build out dynamic UI elements
        this.buildTileButtons();
        //this.buildViews();

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
        console.log(`onClicked: ${Fmt.ofmt(evt)}`);
        console.log(`editorPanel pos: ${this.editorPanel.x},${this.editorPanel.y} min: ${this.editorPanel.minx},${this.editorPanel.miny} max: ${this.editorPanel.maxx},${this.editorPanel.maxy}`);
        console.log(`editorPanel xform.min ${this.editorPanel.xform.minx},${this.editorPanel.xform.miny} max: ${this.editorPanel.xform.maxx},${this.editorPanel.xform.maxy}`);
        let localMousePos = this.editorPanel.xform.getLocal(new Vect(evt.x, evt.y))
        let minx = this.editorPanel.xform.centerx - this.xregion.columns*Config.halfSize;
        let miny = this.editorPanel.xform.centery - this.xregion.rows*Config.halfSize;
        let maxx = this.editorPanel.xform.centerx + this.xregion.columns*Config.halfSize;
        let maxy = this.editorPanel.xform.centery + this.xregion.rows*Config.halfSize;
        console.log(`localMousePos: ${localMousePos} min: ${minx},${miny} max: ${maxx},${maxy}`);
        let bounds = new Bounds(0, 0, this.xregion.columns*Config.tileSize, this.xregion.rows*Config.tileSize);
        if (bounds.contains(localMousePos)) {
            console.log("contains");
            // assign the tile...
            let i = Grid.ifromx(localMousePos.x, Config.tileSize, this.xregion.columns);
            let j = Grid.jfromy(localMousePos.y, Config.tileSize, this.xregion.rows);
            let fields = this.layerMode.split(".");
            let layer = fields[0];
            let depth = fields[1];
            this.assignTile(layer, depth, i, j, this.selectedTile);
        }
        //let minx = this.xregion.columns*
        //xxform: { dx: -xregion.columns*Config.halfSize, dy: -xregion.rows*Config.halfSize, offset: 10, scalex: Config.renderScale, scaley: Config.renderScale },
        /*
        let x = evt.x/Config.renderScale;
        let y = evt.y/Config.renderScale;
        let idx = this.grid.idxfromxy(x, y);
        console.log("idx is: " + idx);
        */
    }

    onCanvasResized(evt) {
        this.buildTileButtons();
    }

    onTileSelected(evt) {
        console.log(`onTileSelected: ${Fmt.ofmt(evt)} assetId: ${evt.actor.assetId}`);
        this.selectedTile = evt.actor.assetId;
    }

    iupdate(ctx) {
        super.iupdate(ctx);
        this.updateSelectedTile(ctx);
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

    assignTile(layer, depth, i, j, id, flags="0") {
        // pull layer
        let layerData;
        if (!this.xregion.layers.hasOwnProperty(layer)) {
            layerData = {};
            this.xregion.layers[layer] = layer;
        } else {
            layerData = this.xregion.layers[layer];
        }
        // pull depth
        let depthData;
        if (!layerData.hasOwnProperty(depth)) {
            depthData = new Array(this.xregion.columns*this.xregion.rows);
            layerData[depth] = depthData;
        } else {
            depthData = layerData[depth];
        }
        // assign tile to region
        let idx = Grid.idxfromij(i, j, this.xregion.columns, this.xregion.rows);
        depthData[idx] = `${flags}${id}`;
        // update view
        this.editorPanel.assignTile(layer, depth, i, j, id);
    }

    updateSelectedTile(ctx) {
        if (this.selectedTile !== this.lastSelectedTile) {
            this.lastSelectedTile = this.selectedTile;
            let xobj = this.assets.fromId(this.selectedTile);
            if (!xobj) return;
            let sketch = Generator.generate(Object.assign({}, xobj.xsketch, { xfitter: { cls: "FitToParent" }}));
            if (!sketch) return;
            console.log(`xsketch: ${Fmt.ofmt(xobj.xsketch)}`);
            this.currentTile.sketch = sketch;
        }
    }

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
