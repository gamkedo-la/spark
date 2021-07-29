export { UxEditorView, EditorState };

import { State }            from "./base/state.js";
import { Base }             from "./base/base.js";
import { Keys }             from "./base/keys.js";
import { Util }             from "./base/util.js";
import { Fmt }              from "./base/fmt.js";
import { Config }           from "./base/config.js";
import { Mouse }            from "./base/mouse.js";
import { World }            from "./world.js";
import { ModelView }        from "./modelView.js";
import { Camera }           from "./base/camera.js";
import { Color }            from "./base/color.js";
import { Templates }        from "./templates.js";
import { Hierarchy }        from "./base/hierarchy.js";
import { Generator }        from "./base/generator.js";
import { UxPanel }          from "./base/uxPanel.js";
import { Vect }             from "./base/vect.js";
import { Bounds }           from "./base/bounds.js";
import { Grid }             from "./base/grid.js";
import { WorldGen }         from "./worldGen.js";

class UxEditorView extends UxPanel {
    cpost(spec) {
        super.cpost(spec);
        this.camera = spec.camera || Camera.main;
        this.xregion = spec.xregion;
        this.assets = spec.assets || Base.instance.assets;   
        this.tileViews = {};
        this.visibility = {};
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

    destroyViews() {
        for (const view of Object.values(this.tileViews)) {
            if (view.model) view.model.destroy();
            view.destroy();
        }
        this.tileViews = {};
    }

    assignVisibility(layer, depth, value) {
        let layerId = Config.layerMap[layer];
        let depthId = Config.depthMap[depth];
        let tag = `${layer}.${depth}`;
        if (this.visibility[tag] != value) {
            this.visibility[tag] = value;
            for (const view of Object.values(this.tileViews)) {
                if (view.model && view.model.layer === layerId && view.model.depth === depthId) {
                    view.model.visible = value;
                }
            }
        }
    }

    getVisibility(layer, depth) {
        let tag = `${layer}.${depth}`;
        return this.visibility[tag];
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

    assignRegion(xregion) {
        this.destroyViews();
        this.xregion = xregion;
        this.buildViews();
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
        let xregion = WorldGen.vendor1;
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
                    Templates.panel("layerButtons", { xxform: { top: .3, left: .1, right: .1, bottom: .025 }, xchildren: [
                        Templates.editorToggle("l1.bg.tog", { xxform: { right: .9, top: 0/12, bottom: 1-1/12 }}),
                        Templates.editorSelectButton("l1.bg", "layer1 background", { xxform: { left: .1, top: 0/12, bottom: 1-1/12 }}),
                        Templates.editorToggle("l1.bgo.tog", { xxform: { right: .9, top: 1/12, bottom: 1-2/12 }}),
                        Templates.editorSelectButton("l1.bgo", "layer1 bg overlay", { xxform: { left: .1, top: 1/12, bottom: 1-2/12 }}),
                        Templates.editorToggle("l1.fg.tog", { xxform: { right: .9, top: 2/12, bottom: 1-3/12 }}),
                        Templates.editorSelectButton("l1.fg", "layer1 foreground", { xxform: { left: .1, top: 2/12, bottom: 1-3/12 }}),
                        Templates.editorToggle("l1.fgo.tog", { xxform: { right: .9, top: 3/12, bottom: 1-4/12 }}),
                        Templates.editorSelectButton("l1.fgo", "layer1 fg overlay", { xxform: { left: .1, top: 3/12, bottom: 1-4/12 }}),

                        Templates.editorToggle("l2.bg.tog", { xxform: { right: .9, top: 4/12, bottom: 1-5/12 }}),
                        Templates.editorSelectButton("l2.bg", "layer2 background", { xxform: { left: .1, top: 4/12, bottom: 1-5/12 }}),
                        Templates.editorToggle("l2.bgo.tog", { xxform: { right: .9, top: 5/12, bottom: 1-6/12 }}),
                        Templates.editorSelectButton("l2.bgo", "layer2 bg overlay", { xxform: { left: .1, top: 5/12, bottom: 1-6/12 }}),
                        Templates.editorToggle("l2.fg.tog", { xxform: { right: .9, top: 6/12, bottom: 1-7/12 }}),
                        Templates.editorSelectButton("l2.fg", "layer2 foreground", { xxform: { left: .1, top: 6/12, bottom: 1-7/12 }}),
                        Templates.editorToggle("l2.fgo.tog", { xxform: { right: .9, top: 7/12, bottom: 1-8/12 }}),
                        Templates.editorSelectButton("l2.fgo", "layer2 fg overlay", { xxform: { left: .1, top: 7/12, bottom: 1-8/12 }}),

                        Templates.editorToggle("l3.bg.tog", { xxform: { right: .9, top: 8/12, bottom: 1-9/12 }}),
                        Templates.editorSelectButton("l3.bg", "layer3 background", { xxform: { left: .1, top: 8/12, bottom: 1-9/12 }}),
                        Templates.editorToggle("l3.bgo.tog", { xxform: { right: .9, top: 9/12, bottom: 1-10/12 }}),
                        Templates.editorSelectButton("l3.bgo", "layer3 bg overlay", { xxform: { left: .1, top: 9/12, bottom: 1-10/12 }}),
                        Templates.editorToggle("l3.fg.tog", { xxform: { right: .9, top: 10/12, bottom: 1-11/12 }}),
                        Templates.editorSelectButton("l3.fg", "layer3 foreground", { xxform: { left: .1, top: 10/12, bottom: 1-11/12 }}),
                        Templates.editorToggle("l3.fgo.tog", { xxform: { right: .9, top: 11/12, bottom: 1-12/12 }}),
                        Templates.editorSelectButton("l3.fgo", "layer3 fg overlay", { xxform: { left: .1, top: 11/12, bottom: 1-12/12 }}),
                    ]}),
                ]}),
                Templates.editorPanel("tilePanel", { xxform: { top: .7 }, xchildren: [

                    Templates.panel("toolButtons", { xxform: { offset: 15, right: .85 }, xchildren: [
                        Templates.editorSelectButton("paint", "paint", { xxform: { bottom: .8 }}),
                        Templates.editorSelectButton("fill", "fill", { xxform: { top:.2, bottom: .6 }}),
                        Templates.editorSelectButton("get", "get", { xxform: { top:.4, bottom: .4 }}),
                        Templates.editorSelectButton("delete", "delete", { xxform: { top:.6, bottom: .2 }}),
                        Templates.editorButton("filterButton", "filter", { xxform: { top: .8 }}),
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

                    Templates.editorPanel("filterPanel", { xxform: { left: .1, right: .7, top: .1, bottom: .1}}),

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
        this.media = spec.media || Base.instance.media;   

        Util.bind(this, "onKeyDown", "onClicked", "onTileSelected", "onCanvasResized", "onSave", "onLoad", "assignRegion", "onNew", "onEdit", "onFilter", "onFilterSelect");
        Keys.evtKeyPressed.listen(this.onKeyDown);
        Mouse.evtClicked.listen(this.onClicked);
        this.view.evtResized.listen(this.onCanvasResized);

        // parse kws from media
        const media = spec.media || Base.instance.media;
        this.kws = ["none"];
        for (const m of media) {
            for (const kw of (m.kw || [])) {
                if (!this.kws.includes(kw)) this.kws.push(kw);
            }
        }
        console.log(`kws: ${this.kws}`);

        // setup state
        this.toolMode = "paint";
        this.layerMode = "l1.fg";
        this.tileButtons = [];
        this.filterKwButtons = [];
        this.levelViews = [];
        this.selectedTile = "003";
        this.filterKw = "none";

        this.xregion = WorldGen.vendor1;

        // lookup object references
        // wire callbacks
        this.gridPanel = Hierarchy.find(this.view, v=>v.tag === "gridPanel");
        this.editorPanel = Hierarchy.find(this.view, v=>v.tag === "editorPanel");
        this.tileButtonsPanel = Hierarchy.find(this.view, v=>v.tag === "tileButtonsPanel");
        for (const tool of ["paint", "fill", "get", "delete"]) {
            this[`${tool}Select`] = Hierarchy.find(this.view, v=>v.tag === `${tool}.select`);
            this[`${tool}Button`] = Hierarchy.find(this.view, v=>v.tag === `${tool}.button`);
            this[`${tool}Button`].evtClicked.listen((evt) => this.toolMode = tool);
        }
        this.filterButton = Hierarchy.find(this.view, v=>v.tag === `filterButton`);
        this.filterButton.evtClicked.listen(this.onFilter);
        this.filterPanel = Hierarchy.find(this.view, v=>v.tag === `filterPanel`);
        this.selectTileButtons = Hierarchy.find(this.view, v=>v.tag === `selectTileButtons`);
        // hide/disable filter panel
        this.filterPanel.active = false;
        this.filterPanel.visible = false;
        this.buildFilterKwButtons();
        for (const layer of ["l1", "l2", "l3"]) {
            for (const depth of ["bg", "bgo", "fg", "fgo"]) {
                this[`${layer}${depth}Select`] = Hierarchy.find(this.view, v=>v.tag === `${layer}.${depth}.select`);
                this[`${layer}${depth}Button`] = Hierarchy.find(this.view, v=>v.tag === `${layer}.${depth}.button`);
                this[`${layer}${depth}Button`].evtClicked.listen((evt) => this.layerMode = `${layer}.${depth}`);
                let toggle = Hierarchy.find(this.view, v=>v.tag === `${layer}.${depth}.tog`);
                toggle.evtClicked.listen(((l, d) => (evt) => this.editorPanel.assignVisibility(l, d, evt.value))(layer, depth));
            }
        }
        this.currentTile = Hierarchy.find(this.view, v=>v.tag === "currentTile");
        this.helpTile1 = Hierarchy.find(this.view, v=>v.tag === "helpTile1");
        this.helpTile2 = Hierarchy.find(this.view, v=>v.tag === "helpTile2");
        this.helpTile3 = Hierarchy.find(this.view, v=>v.tag === "helpTile3");
        this.helpTile4 = Hierarchy.find(this.view, v=>v.tag === "helpTile4");
        this.newButton = Hierarchy.find(this.view, v=>v.tag === "newButton");
        this.newButton.evtClicked.listen(this.onNew);
        this.loadButton = Hierarchy.find(this.view, v=>v.tag === "loadButton");
        this.loadButton.evtClicked.listen(this.onLoad);
        this.editButton = Hierarchy.find(this.view, v=>v.tag === "editButton");
        this.editButton.evtClicked.listen(this.onEdit);
        this.saveButton = Hierarchy.find(this.view, v=>v.tag === "saveButton");
        this.saveButton.evtClicked.listen(this.onSave);

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

    onMouseMove(evt) {
        console.log("EditorState onMouseMove: " + Fmt.ofmt(evt));
    }

    onKeyDown(evt) {
        console.log("EditorState onKeyDown: " + Fmt.ofmt(evt));
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
        let localMousePos = this.editorPanel.xform.getLocal(new Vect(evt.x, evt.y))
        let bounds = new Bounds(0, 0, this.xregion.columns*Config.tileSize, this.xregion.rows*Config.tileSize);
        if (bounds.contains(localMousePos)) {
            // assign the tile...
            let i = Grid.ifromx(localMousePos.x, Config.tileSize, this.xregion.columns);
            let j = Grid.jfromy(localMousePos.y, Config.tileSize, this.xregion.rows);
            let fields = this.layerMode.split(".");
            let layer = fields[0];
            let depth = fields[1];
            if (this.toolMode === "paint") {
                this.assignTile(layer, depth, i, j, this.selectedTile);
            } else if (this.toolMode === "delete") {
                this.assignTile(layer, depth, i, j, "000");
            }
        }
    }

    onCanvasResized(evt) {
        this.buildTileButtons();
    }

    onTileSelected(evt) {
        console.log(`onTileSelected: ${Fmt.ofmt(evt)} assetId: ${evt.actor.assetId}`);
        this.selectedTile = evt.actor.assetId;
    }

    onSave() {
        console.log("onSave");
        this.active = false;
        // create new controller for menu
        this.stateMgr.push(new EditorSaveState({xregion: this.xregion}));
    }

    onLoad() {
        console.log("onLoad");
        this.active = false;
        // create new controller for menu
        this.stateMgr.push(new EditorLoadState({assignRegion: this.assignRegion}));
    }

    onNew() {
        console.log("onNew");
        this.active = false;
        // create new controller for menu
        this.stateMgr.push(new EditorNewState({assignRegion: this.assignRegion}));
    }

    onEdit() {
        console.log("onEdit");
        this.active = false;
        // create new controller for menu
        this.stateMgr.push(new EditorEditState({xregion: this.xregion, assignRegion: this.assignRegion}));
    }


    destroyFilterKwButtons() {
        for (const b of this.filterKwButtons) {
            b.destroy();
        }
        this.filterKwButtons = [];
    }

    buildFilterKwButtons() {
        this.destroyFilterKwButtons();
        let row = 0;
        let col = 0;
        let maxCols = 3;
        let colStep = 1/maxCols;
        let maxRows = 4;
        let rowStep = 1/maxRows;
        // add button for rest of tileset assets
        for (const kw of this.kws) {
            let bspec = {
                cls: "UxButton",
                dfltDepth: this.filterPanel.depth + 1,
                dfltLayer: this.filterPanel.layer,
                parent: this.filterPanel,
                xxform: {parent: this.filterPanel.xform, left: col*colStep, right: 1-(col+1)*colStep, top: row*rowStep, bottom: 1-(row+1)*rowStep},
                xtext: {text: kw, color: new Color(255,255,0,.75)},
            };
            let b = Generator.generate(bspec);
            if (b) {
                b.kw = kw;
                b.evtClicked.listen(this.onFilterSelect);
                this.filterPanel.adopt(b);
                col++;
                if (col >= maxCols) {
                    row++;
                    col = 0;
                }
                this.filterKwButtons.push(b);
            }
        }
    }


    onFilter() {
        this.filterPanel.active = !this.filterPanel.active;
        this.filterPanel.visible = !this.filterPanel.visible;
        this.selectTileButtons.active = !this.filterPanel.active;
        this.tileButtonsPanel.active = !this.filterPanel.active;
    }

    onFilterSelect(evt) {
        this.filterKw = evt.actor.kw;
        this.filterPanel.active = false;
        this.filterPanel.visible = false
        this.selectTileButtons.active = true;
        this.tileButtonsPanel.active = true;
        this.buildTileButtons();
    }

    iupdate(ctx) {
        super.iupdate(ctx);
        this.updateSelectedTile(ctx);
        this.updateToolPanel(ctx);
        this.updateLayerPanel(ctx);
        this.updateHints(ctx);
    }

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

    assignRegion(xregion) {
        // update editor panel xform
        this.editorPanel.xform.dx = -xregion.columns*Config.halfSize;
        this.editorPanel.xform.dy = -xregion.rows*Config.halfSize;
        // inform editor panel of region change
        this.editorPanel.assignRegion(xregion);
        this.xregion = xregion;
        //xxform: { dx: -xregion.columns*Config.halfSize, dy: -xregion.rows*Config.halfSize, offset: 10, scalex: Config.renderScale, scaley: Config.renderScale },
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

    updateHints(ctx) {
        let localMousePos = this.editorPanel.xform.getLocal(new Vect(Mouse.x, Mouse.y));
        let bounds = new Bounds(0, 0, this.xregion.columns*Config.tileSize, this.xregion.rows*Config.tileSize);
        if (bounds.contains(localMousePos)) {
            // assign the tile...
            let i = Grid.ifromx(localMousePos.x, Config.tileSize, this.xregion.columns);
            let j = Grid.jfromy(localMousePos.y, Config.tileSize, this.xregion.rows);
            let idx = Grid.idxfromij(i, j, this.xregion.columns, this.xregion.rows);
            if (idx != this.lastHintIdx) {
                console.log(`mouse over: ${i},${j} => ${idx}`);
                this.lastHintIdx = idx;
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
            // skip based on filter
            if (this.filterKw != "none") {
                let media = this.media.get(asset.xsketch.tag);
                if (!media.kw || !media.kw.includes(this.filterKw)) continue;
            }
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

class EditorNewState extends State {
    cpre(spec) {
        super.cpre(spec);
        spec.xview = {
            cls: "UxCanvas",
            cvsid: "canvas",
            resize: true,
            xchildren: [
                Templates.editorPanel(null, { xxform: { border: .2 }, xchildren: [
                    Templates.editorText(null, "New Level", { xxform: { offset: 10, bottom: .9 }}),
                    Templates.editorPanel(null, { xxform: { top: .1, bottom: .1}, xchildren: [
                        Templates.editorText(null, "name:",         { xxform: { top: 0/5, bottom: 1-1/5, right: .6, left: .05, otop: 20, obottom:10}}),
                        Templates.editorInput("nameInput", "lvl",   { xxform: { top: 0/5, bottom: 1-1/5, left: .4, offset: 10}}),
                        Templates.editorText(null, "columns:",      { xxform: { top: 1/5, bottom: 1-2/5, right: .6, left: .05, otop: 20, obottom:10}}),
                        Templates.editorInput("columnsInput", "8",  { xxform: { top: 1/5, bottom: 1-2/5, left: .4, offset: 10}, charset: '0123456789'}),
                        Templates.editorText(null, "rows:",         { xxform: { top: 2/5, bottom: 1-3/5, right: .6, left: .05, otop: 20, obottom:10}}),
                        Templates.editorInput("rowsInput", "8",     { xxform: { top: 2/5, bottom: 1-3/5, left: .4, offset: 10}, charset: '0123456789'}),
                        Templates.editorText(null, "x offset:",     { xxform: { top: 3/5, bottom: 1-4/5, right: .6, left: .05, otop: 20, obottom:10}}),
                        Templates.editorInput("offxInput", "0",     { xxform: { top: 3/5, bottom: 1-4/5, left: .4, offset: 10}, charset: '0123456789'}),
                        Templates.editorText(null, "y offset:",     { xxform: { top: 4/5, bottom: 1-5/5, right: .6, left: .05, otop: 20, obottom:10}}),
                        Templates.editorInput("offyInput", "0",     { xxform: { top: 4/5, bottom: 1-5/5, left: .4, offset: 10}, charset: '0123456789'}),
                    ]}),
                    Templates.editorButton("okButton", "ok", { xxform: { left: .6, right: .25, top: .9, offset: 10 }}),
                    Templates.editorButton("backButton", "back", { xxform: { left: .75, right: .1, top: .9, offset: 10 }}),
                ]}),
            ],
        };
    }

    cpost(spec) {
        super.cpost(spec);
        this.assignRegion = spec.assignRegion || ((region) => false);
        Util.bind(this, "onKeyDown", "onOk", "onBack");
        Keys.evtKeyPressed.listen(this.onKeyDown);
        this.nameInput = Hierarchy.find(this.view, v=>v.tag === "nameInput");
        this.columnsInput = Hierarchy.find(this.view, v=>v.tag === "columnsInput");
        this.rowsInput = Hierarchy.find(this.view, v=>v.tag === "rowsInput");
        this.offxInput = Hierarchy.find(this.view, v=>v.tag === "offxInput");
        this.offyInput = Hierarchy.find(this.view, v=>v.tag === "offyInput");
        let okButton = Hierarchy.find(this.view, v=>v.tag === "okButton");
        okButton.evtClicked.listen(this.onOk);
        let backButton = Hierarchy.find(this.view, v=>v.tag === "backButton");
        backButton.evtClicked.listen(this.onBack);
    }

    onKeyDown(evt) {
        if (!this.active) return;
        if (evt.key === "z" || evt.key === "x" || evt.key === "Escape")  {
            this.onBack();
        }
    }

    onBack(evt) {
        // restore last controller
        this.stateMgr.pop();
        this.stateMgr.current.active = true;
        // tear down state
        this.destroy();
    }

    destroy() {
        if (this.view) this.view.destroy();
        Keys.evtKeyPressed.ignore(this.onKeyDown);
        super.destroy();
    }

    onOk(evt) {
        console.log("onOk: " + Fmt.ofmt(evt));
        if (!confirm("Creating new level will erase current level data, OK to proceed?")) return;
        // build empty region
        let xregion = {
            tag: this.nameInput.text,
            columns: Math.min(Config.maxRegionSize, parseInt(this.columnsInput.text)),
            rows: Math.min(Config.maxRegionSize, parseInt(this.rowsInput.text)),
            offx: parseInt(this.offxInput.text),
            offy: parseInt(this.offyInput.text),
            autoArea: true,
            layers: {},
        }
        // assign region
        this.assignRegion(xregion);
        // close window
        this.onBack();
    }

}

class EditorEditState extends State {
    cpre(spec) {
        super.cpre(spec);
        let xregion = spec.xregion;
        spec.xview = {
            cls: "UxCanvas",
            cvsid: "canvas",
            resize: true,
            xchildren: [
                Templates.editorPanel(null, { xxform: { border: .2 }, xchildren: [
                    Templates.editorText(null, "Edit Level", { xxform: { offset: 10, bottom: .9 }}),
                    Templates.editorPanel(null, { xxform: { top: .1, bottom: .1}, xchildren: [
                        Templates.editorText(null, "name:",                                 { xxform: { top: 0/7, bottom: 1-1/7, right: .6, left: .05, otop: 20, obottom:10}}),
                        Templates.editorInput("nameInput", xregion.tag,                     { xxform: { top: 0/7, bottom: 1-1/7, left: .4, offset: 10}}),
                        Templates.editorText(null, "columns:",                              { xxform: { top: 1/7, bottom: 1-2/7, right: .6, left: .05, otop: 20, obottom:10}}),
                        Templates.editorInput("columnsInput", xregion.columns.toString(),   { xxform: { top: 1/7, bottom: 1-2/7, left: .4, offset: 10}, charset: '0123456789'}),
                        Templates.editorText(null, "rows:",                                 { xxform: { top: 2/7, bottom: 1-3/7, right: .6, left: .05, otop: 20, obottom:10}}),
                        Templates.editorInput("rowsInput", xregion.rows.toString(),         { xxform: { top: 2/7, bottom: 1-3/7, left: .4, offset: 10}, charset: '0123456789'}),
                        Templates.editorText(null, "x offset:",                             { xxform: { top: 3/7, bottom: 1-4/7, right: .6, left: .05, otop: 20, obottom:10}}),
                        Templates.editorInput("offxInput", xregion.offx.toString(),         { xxform: { top: 3/7, bottom: 1-4/7, left: .4, offset: 10}, charset: '0123456789'}),
                        Templates.editorText(null, "y offset:",                             { xxform: { top: 4/7, bottom: 1-5/7, right: .6, left: .05, otop: 20, obottom:10}}),
                        Templates.editorInput("offyInput", xregion.offy.toString(),         { xxform: { top: 4/7, bottom: 1-5/7, left: .4, offset: 10}, charset: '0123456789'}),
                        Templates.editorText(null, "x shift:",                              { xxform: { top: 5/7, bottom: 1-6/7, right: .6, left: .05, otop: 20, obottom:10}}),
                        Templates.editorInput("shiftxInput", "0",                           { xxform: { top: 5/7, bottom: 1-6/7, left: .4, offset: 10}, charset: '0123456789-'}),
                        Templates.editorText(null, "y shift:",                              { xxform: { top: 6/7, bottom: 1-7/7, right: .6, left: .05, otop: 20, obottom:10}}),
                        Templates.editorInput("shiftyInput", "0",                           { xxform: { top: 6/7, bottom: 1-7/7, left: .4, offset: 10}, charset: '0123456789-'}),
                    ]}),
                    Templates.editorButton("okButton", "ok", { xxform: { left: .6, right: .25, top: .9, offset: 10 }}),
                    Templates.editorButton("backButton", "back", { xxform: { left: .75, right: .1, top: .9, offset: 10 }}),
                ]}),
            ],
        };
    }

    cpost(spec) {
        super.cpost(spec);
        this.assignRegion = spec.assignRegion || ((region) => false);
        this.xregion = spec.xregion;
        Util.bind(this, "onKeyDown", "onOk", "onBack");
        Keys.evtKeyPressed.listen(this.onKeyDown);
        this.nameInput = Hierarchy.find(this.view, v=>v.tag === "nameInput");
        this.columnsInput = Hierarchy.find(this.view, v=>v.tag === "columnsInput");
        this.rowsInput = Hierarchy.find(this.view, v=>v.tag === "rowsInput");
        this.offxInput = Hierarchy.find(this.view, v=>v.tag === "offxInput");
        this.offyInput = Hierarchy.find(this.view, v=>v.tag === "offyInput");
        this.shiftxInput = Hierarchy.find(this.view, v=>v.tag === "shiftxInput");
        this.shiftyInput = Hierarchy.find(this.view, v=>v.tag === "shiftyInput");
        let okButton = Hierarchy.find(this.view, v=>v.tag === "okButton");
        okButton.evtClicked.listen(this.onOk);
        let backButton = Hierarchy.find(this.view, v=>v.tag === "backButton");
        backButton.evtClicked.listen(this.onBack);
    }

    onKeyDown(evt) {
        if (!this.active) return;
        if (evt.key === "z" || evt.key === "x" || evt.key === "Escape")  {
            this.onBack();
        }
    }

    onBack(evt) {
        // restore last controller
        this.stateMgr.pop();
        this.stateMgr.current.active = true;
        // tear down state
        this.destroy();
    }

    destroy() {
        if (this.view) this.view.destroy();
        Keys.evtKeyPressed.ignore(this.onKeyDown);
        super.destroy();
    }

    onOk(evt) {
        console.log("onOk: " + Fmt.ofmt(evt));
        if (!confirm("Creating new level will erase current level data, OK to proceed?")) return;
        // build empty region
        let xregion = {
            tag: this.nameInput.text,
            columns: Math.min(Config.maxRegionSize, parseInt(this.columnsInput.text)),
            rows: Math.min(Config.maxRegionSize, parseInt(this.rowsInput.text)),
            offx: parseInt(this.offxInput.text) || 0,
            offy: parseInt(this.offyInput.text) || 0,
            autoArea: true,
            layers: {},
        }
        let shiftx = parseInt(this.shiftxInput.text) || 0;
        let shifty = parseInt(this.shiftyInput.text) || 0;
        // rebuild layer data
        for (const layer of Object.keys(Config.layerMap)) {
            let layerInfo = this.xregion.layers[layer];
            if (!layerInfo) continue;
            let newLayerInfo = {};
            for (const depth of Object.keys(Config.depthMap)) {
                let depthData = layerInfo[depth];
                if (!depthData) continue;
                let newDepthData = new Array(xregion.rows*xregion.columns);
                for (let i=0; i<this.xregion.columns; i++) {
                    for (let j=0; j<this.xregion.rows; j++) {
                        let ni = i+shiftx;
                        let nj = j+shifty;
                        if (ni >= 0 && ni < xregion.columns && nj >= 0 && nj < xregion.rows) {
                            let idx = Grid.idxfromij(i, j, this.xregion.columns, this.xregion.rows);
                            let nidx = Grid.idxfromij(ni, nj, xregion.columns, xregion.rows);
                            newDepthData[nidx] = depthData[idx];
                        }
                    }
                }
                newLayerInfo[depth] = newDepthData;
            }
            xregion.layers[layer] = newLayerInfo;
        }
        // assign region
        this.assignRegion(xregion);
        // close window
        this.onBack();
    }

}
class EditorLoadState extends State {
    cpre(spec) {
        super.cpre(spec);
        spec.xview = {
            cls: "UxCanvas",
            cvsid: "canvas",
            resize: true,
            xchildren: [
                Templates.editorPanel(null),
                Templates.editorText(null, "Load Level", { xxform: { top: .025, bottom: .915}}),
                Templates.editorPanel(null, { xxform: { top: .1, bottom: .1}, xchildren: [
                    Templates.panel("lvlPanel", { xxform: { offset: 10 }, }),
                ]}),
                Templates.editorButton("backButton", "back", { xxform: { left: .75, right: .1, top: .9, offset: 20 }}),
            ],
        };
    }

    cpost(spec) {
        super.cpost(spec);
        this.assignRegion = spec.assignRegion || ((region) => false);
        Util.bind(this, "onKeyDown", "onLvlSelect", "onBack");
        Keys.evtKeyPressed.listen(this.onKeyDown);
        this.lvlPanel = Hierarchy.find(this.view, v=>v.tag === "lvlPanel");
        let backButton = Hierarchy.find(this.view, v=>v.tag === "backButton");
        backButton.evtClicked.listen(this.onBack);

        // build out level buttons
        let row = 0;
        let col = 0;
        let maxCols = 4;
        let colStep = 1/maxCols;
        let maxRows = Math.floor(this.lvlPanel.height/40);
        let rowStep = 1/maxRows;
        for (const lvlName of Object.keys(WorldGen)) {
            let bspec = Templates.editorButton(null, lvlName, {
                xxform: {left: col*colStep, right: 1-(col+1)*colStep, top: row*rowStep, bottom: 1-(row+1)*rowStep, offset: 5},
            });
            let b = Generator.generate(bspec);
            if (b) {
                b.lvlName = lvlName;
                b.evtClicked.listen(this.onLvlSelect);
                this.lvlPanel.adopt(b);
                col++;
                if (col >= maxCols) {
                    row++;
                    col = 0;
                }
            }
        }

    }

    onKeyDown(evt) {
        if (!this.active) return;
        if (evt.key === "z" || evt.key === "x" || evt.key === "Escape")  {
            this.onBack();
        }
    }

    onBack(evt) {
        // restore last controller
        this.stateMgr.pop();
        this.stateMgr.current.active = true;
        // tear down state
        this.destroy();
    }

    destroy() {
        if (this.view) this.view.destroy();
        Keys.evtKeyPressed.ignore(this.onKeyDown);
        super.destroy();
    }

    onLvlSelect(evt) {
        console.log("onLvlSelect: " + Fmt.ofmt(evt));
        if (!confirm("Loading new level will erase current level data, OK to proceed?")) return;
        // look up region
        let regionName = evt.actor.lvlName;
        let xregion = WorldGen[regionName];
        if (!xregion) {
            console.error(`cannot load region for: ${regionName}`);
        }
        // assign region
        this.assignRegion(xregion);
        // close window
        this.onBack();
    }

}

class EditorSaveState extends State {
    cpre(spec) {
        super.cpre(spec);
        spec.xview = {
            cls: "UxCanvas",
            cvsid: "canvas",
            resize: true,
            xchildren: [
                Templates.editorPanel(null, { xxform: { offset: -10, left: .15, right: .15, top: .05, bottom: .05}}),
                Templates.editorButton("copyButton", "copy", { xxform: { left: .65, right: .25, top: .9, bottom: .05 }}),
                Templates.editorButton("backButton", "back", { xxform: { left: .75, right: .15, top: .9, bottom: .05 }}),
            ],
        };
    }

    cpost(spec) {
        super.cpost(spec);
        this.xregion = spec.xregion;
        Util.bind(this, "onKeyDown", "onCopy", "onBack");
        Keys.evtKeyPressed.listen(this.onKeyDown);
        let div = document.createElement('div');
        div.style.height = "90%";
        div.style.width = "70%";
        div.style.background = "rgba(0,0,0,0)";
        div.style.position = "absolute";
        div.style.left = "50%";
        div.style.top = "50%";
        div.style.transform = "translate(-50%, -50%)";
        div.style.padding = "5px";
        div.style.pointerEvents = "none";
        div.style.transition = "all 300ms ease-in-out";
        div.style.zIndex = "1011";
        this.text = document.createElement("p");
        this.text.innerHTML = "<pre>" + this.pprintRegion(this.xregion) + "</pre>";
        this.text.style.color = "yellow";
        div.appendChild(this.text);
        document.body.appendChild(div)
        this.div = div;
        let copyButton = Hierarchy.find(this.view, v=>v.tag === "copyButton");
        copyButton.evtClicked.listen(this.onCopy);
        let backButton = Hierarchy.find(this.view, v=>v.tag === "backButton");
        backButton.evtClicked.listen(this.onBack);
    }

    onKeyDown(evt) {
        if (!this.active) return;
        console.log("EditorSaveState onKeyDown: " + Fmt.ofmt(evt));
        if (evt.key === "z" || evt.key === "x" || evt.key === "Escape")  {
            this.onBack();
        }
    }

    onCopy(evt) {
        console.log("onCopy");
        // hackety hack hack... can't figure out a way to directly copy from text element being displayed... so create a text area and copy from there
        var elem = document.createElement("textarea");
        document.body.appendChild(elem);
        elem.value = this.text.innerText;
        elem.select();
        document.execCommand("copy");
        document.body.removeChild(elem);
        alert("copied to clipboard");
    }

    onBack(evt) {
        // restore last controller
        this.stateMgr.pop();
        this.stateMgr.current.active = true;
        // tear down state
        this.destroy();
    }

    pprintArray(arr, width=16, indent=0, spaces=3) {
        let str = " ".repeat(indent);
        let col = 0;
        for (var v of arr) {
            if (col >= width) {
                str += "\n" + " ".repeat(indent);
                col = 0;
            }
            if (v === null) v = 0;
            if (v === undefined) v = 0;
            let s = `"${v}"`.padStart(spaces, " ");
            str += (s + ",");
            col++;
        }
        str += "\n";
        return str;
    }

    pprintRegion(xregion) {
        let str = 
            `static ${xregion.tag} = {\n` +
            `    tag: "${xregion.tag}",\n` +
            `    columns: ${xregion.columns},\n` +
            `    rows: ${xregion.rows},\n` +
            `    offx: ${xregion.offx},\n` +
            `    offy: ${xregion.offy},\n` +
            `    autoArea: true,\n` +
            `    layers: {\n`;
        for (const layer of Object.keys(Config.layerMap)) {
            let layerInfo = this.xregion.layers[layer];
            if (!layerInfo) continue;
            str += `        ${layer}: {\n`;
            for (const depth of Object.keys(Config.depthMap)) {
                let depthData = layerInfo[depth];
                if (!depthData) continue;
                str += `            ${depth}: [\n`;
                str += this.pprintArray(depthData, xregion.columns, 16);
                str += `            ],\n`;
            }
            str += `        },\n`;
        }
        str += `    },\n`;
        str += `};`;
        return str;
    }

    destroy() {
        if (this.div) this.div.remove();
        if (this.view) this.view.destroy();
        Keys.evtKeyPressed.ignore(this.onKeyDown);
        super.destroy();
    }

}