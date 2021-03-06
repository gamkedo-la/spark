export { UxLvlView, UxEditorView, EditorState };

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

class UxLvlView extends UxPanel {
    cpost(spec) {
        super.cpost(spec);
        this.xlvl = spec.xlvl;
        this.assets = spec.assets || Base.instance.assets;   
        this.loadedRegion = spec.loadedRegion;
    }

    buildLvl() {
        this.clear();
        for (const xregion of this.xlvl.xregions) {
            if (xregion.tag === this.loadedRegion) continue;
            this.buildRegion(xregion);
        }
    }

    clear() {
        for (const child of this.children()) {
            child.orphan();
            child.destroy();
        }
    }

    buildRegion(xregion) {
        let offx = xregion.offx;
        let offy = xregion.offy;
        let columns = xregion.columns || 0;
        let rows = xregion.rows || 0;
        // parse layers and layer data
        for (const layer of Object.keys(Config.layerMap)) {
            let layerInfo = xregion.layers[layer];
            if (!layerInfo) continue;
            for (const depth of Object.keys(Config.depthMap)) {
                let depthData = layerInfo[depth];
                if (!depthData) continue;
                for (let i=0; i<columns; i++) {
                    for (let j=0; j<rows; j++) {
                        let idx = i + columns*j;
                        let id = depthData[idx];
                        if (!id) continue;
                        let assetId = id.slice(1);
                        this.assignTile(layer, depth, i+offx, j+offy, assetId);
                    }
                }
            }
        }
    }

    assignTile(layer, depth, i, j, id, offy=1) {
        let layerId = Config.layerMap[layer];
        let depthId = Config.depthMap[depth];
        let xobj = this.assets.fromId(id);
        if (xobj) {
            let x = (i*Config.tileSize) + Config.halfSize;
            let y = ((j-layerId*offy)*Config.tileSize) + Config.halfSize;
            xobj = Object.assign({
                x: x, 
                y: y, 
                depth: depthId,
                layer: layerId,
            }, xobj);
            let obj = Generator.generate(xobj);
            let xview = {
                cls: "ModelView",
                xsketch: obj.xsketch,
                xxform: Object.assign({border: .5}, obj.xxform),
                model: obj,
            };
            let view = new ModelView(xview);
            this.adopt(view);
        }
    }

    iupdate(ctx) {
        let updated = false;
        if (!this.firstUpdate) {
            this.firstUpdate = true;
            this.buildLvl();
            updated = true;
        }
        return updated|super.iupdate(ctx);
    }

}

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
        let columns = this.xregion.columns || 0;
        let rows = this.xregion.rows || 0;
        // parse layers and layer data
        for (const layer of Object.keys(Config.layerMap)) {
            let layerInfo = this.xregion.layers[layer];
            if (!layerInfo) continue;
            for (const depth of Object.keys(Config.depthMap)) {
                let depthData = layerInfo[depth];
                if (!depthData) continue;
                for (let i=0; i<columns; i++) {
                    for (let j=0; j<rows; j++) {
                        let idx = i + columns*j;
                        let id = depthData[idx];
                        if (!id) continue;
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

    assignTile(layer, depth, i, j, id, offy=1) {
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
            let y = ((j-layerId*offy)*Config.tileSize) + Config.halfSize;
            //let y = (j*Config.tileSize) + Config.halfSize;
            xobj = Object.assign({
                x: x, 
                y: y, 
                depth: depthId,
                layer: layerId,
            }, xobj);
            let obj = Generator.generate(xobj);
            let xview = {
                cls: "ModelView",
                xsketch: obj.xsketch,
                xxform: Object.assign({border: .5}, obj.xxform),
                model: obj,
            };
            let view = new ModelView(xview);
            this.adopt(view);
            this.tileViews[key] = view;
        }

    }

    assignRegion(xregion) {
        if (!WorldGen.hasOwnProperty(xregion.tag)) WorldGen[xregion.tag] = xregion;
        this.destroyViews();
        this.xregion = xregion;
        this.buildViews();
    }

    setLayerOffy(offy) {
        for (const view of Object.values(this.tileViews)) {
            if (view.model) view.model._y += offy;
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
                        cls: "UxLvlView",
                        tag: "lvlPanel",
                        loadedRegion: xregion.tag,
                        xlvl: World.xlvl,
                        xsketch: {},
                        xxform: { dx: -xregion.offx*Config.tileSize-xregion.columns*Config.halfSize, dy: -xregion.offy*Config.tileSize-xregion.rows*Config.halfSize, offset: 10, scalex: Config.renderScale, scaley: Config.renderScale },
                    },
                    {
                        cls: "UxEditorView",
                        tag: "editorPanel",
                        xregion: xregion,
                        xsketch: {},
                        xxform: { dx: -xregion.columns*Config.halfSize, dy: -xregion.rows*Config.halfSize, offset: 10, scalex: Config.renderScale, scaley: Config.renderScale },
                    },
                    Templates.editorText("xText", "x: 0", { xxform: { left: .94, right: .015, top: .025, bottom: .95}}),
                    Templates.editorText("yText", "y: 0", { xxform: { left: .94, right: .015, top: .05, bottom: .925}}),
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
                        Templates.editorToggle("l1.bg.tog", { xxform: { right: .9, top: 0/13, bottom: 1-1/13 }}),
                        Templates.editorSelectButton("l1.bg", "layer1 background", { xxform: { left: .1, top: 0/13, bottom: 1-1/13 }}),
                        Templates.editorToggle("l1.bgo.tog", { xxform: { right: .9, top: 1/13, bottom: 1-2/13 }}),
                        Templates.editorSelectButton("l1.bgo", "layer1 bg overlay", { xxform: { left: .1, top: 1/13, bottom: 1-2/13 }}),
                        Templates.editorToggle("l1.fg.tog", { xxform: { right: .9, top: 2/13, bottom: 1-3/13 }}),
                        Templates.editorSelectButton("l1.fg", "layer1 foreground", { xxform: { left: .1, top: 2/13, bottom: 1-3/13 }}),
                        Templates.editorToggle("l1.fgo.tog", { xxform: { right: .9, top: 3/13, bottom: 1-4/13 }}),
                        Templates.editorSelectButton("l1.fgo", "layer1 fg overlay", { xxform: { left: .1, top: 3/13, bottom: 1-4/13 }}),

                        Templates.editorToggle("l2.bg.tog", { xxform: { right: .9, top: 4/13, bottom: 1-5/13 }}),
                        Templates.editorSelectButton("l2.bg", "layer2 background", { xxform: { left: .1, top: 4/13, bottom: 1-5/13 }}),
                        Templates.editorToggle("l2.bgo.tog", { xxform: { right: .9, top: 5/13, bottom: 1-6/13 }}),
                        Templates.editorSelectButton("l2.bgo", "layer2 bg overlay", { xxform: { left: .1, top: 5/13, bottom: 1-6/13 }}),
                        Templates.editorToggle("l2.fg.tog", { xxform: { right: .9, top: 6/13, bottom: 1-7/13 }}),
                        Templates.editorSelectButton("l2.fg", "layer2 foreground", { xxform: { left: .1, top: 6/13, bottom: 1-7/13 }}),
                        Templates.editorToggle("l2.fgo.tog", { xxform: { right: .9, top: 7/13, bottom: 1-8/13 }}),
                        Templates.editorSelectButton("l2.fgo", "layer2 fg overlay", { xxform: { left: .1, top: 7/13, bottom: 1-8/13 }}),

                        Templates.editorToggle("l3.bg.tog", { xxform: { right: .9, top: 8/13, bottom: 1-9/13 }}),
                        Templates.editorSelectButton("l3.bg", "layer3 background", { xxform: { left: .1, top: 8/13, bottom: 1-9/13 }}),
                        Templates.editorToggle("l3.bgo.tog", { xxform: { right: .9, top: 9/13, bottom: 1-10/13 }}),
                        Templates.editorSelectButton("l3.bgo", "layer3 bg overlay", { xxform: { left: .1, top: 9/13, bottom: 1-10/13 }}),
                        Templates.editorToggle("l3.fg.tog", { xxform: { right: .9, top: 10/13, bottom: 1-11/13 }}),
                        Templates.editorSelectButton("l3.fg", "layer3 foreground", { xxform: { left: .1, top: 10/13, bottom: 1-11/13 }}),
                        Templates.editorToggle("l3.fgo.tog", { xxform: { right: .9, top: 11/13, bottom: 1-12/13 }}),
                        Templates.editorSelectButton("l3.fgo", "layer3 fg overlay", { xxform: { left: .1, top: 11/13, bottom: 1-12/13 }}),
                        Templates.editorToggle("lvl.tog", { xxform: { right: .9, top: 12/13, bottom: 1-13/13 }}),
                        Templates.editorText(null, "level data", { xxform: { left: .1, top: 12/13, bottom: 1-13/13 }}),
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

                    Templates.panel("selectTileButtons", { xxform: { offset: 15, left: .14, right: .75 }, xchildren: [
                        Templates.panel("currentTile", { xxform: { bottom: .8, right: .5 }}),
                        Templates.editorText(null, " ", { xxform: { offset: 5, bottom: .8, right: .5 }}),
                        Templates.editorButton("helpTile1", "1", { xxform: { top: .2, bottom: .6, right: .5 }}),
                        Templates.editorButton("helpTile2", "2", { xxform: { top: .4, bottom: .4, right: .5 }}),
                        Templates.editorButton("helpTile3", "3", { xxform: { top: .6, bottom: .2, right: .5 }}),
                        Templates.editorButton("helpTile4", "4", { xxform: { top: .8, bottom: 0, right: .5 }}),
                        Templates.editorButton("helpTile5", "5", { xxform: { top: .2, bottom: .6, left: .5 }}),
                        Templates.editorButton("helpTile6", "6", { xxform: { top: .4, bottom: .4, left: .5 }}),
                        Templates.editorButton("helpTile7", "7", { xxform: { top: .6, bottom: .2, left: .5 }}),
                        Templates.editorButton("helpTile8", "8", { xxform: { top: .8, bottom: 0, left: .5 }}),
                        //Templates.editorText(null, "1", { xxform: { offset: 5, top: .2, bottom: .6 }}),
                        //Templates.panel("helpTile2", { xxform: { top: .4, bottom: .4 }}),
                        //Templates.editorText(null, "2", { xxform: { offset: 5, top: .4, bottom: .4 }}),
                        //Templates.panel("helpTile3", { xxform: { top: .6, bottom: .2 }}),
                        //Templates.editorText(null, "3", { xxform: { offset: 5, top: .6, bottom: .2 }}),
                        //Templates.panel("helpTile4", { xxform: { top: .8 }}),
                        //Templates.editorText(null, "4", { xxform: { offset: 5, top: .8 }}),
                    ]}),

                    Templates.panel("tileButtonsPanel", { xxform: { offset: 15, left: .25 }, xchildren: [
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

        Util.bind(this, "onKeyDown", "onClicked", "onTileSelected", "onCanvasResized", "onSave", "onLoad", "assignRegion", "onNew", "onEdit", "onFilter", "onFilterSelect", "onMouseMoved");
        Keys.evtKeyPressed.listen(this.onKeyDown);
        Mouse.evtClicked.listen(this.onClicked);
        Mouse.evtMoved.listen(this.onMouseMoved);
        this.view.evtResized.listen(this.onCanvasResized);

        // parse kws from media
        const media = spec.media || Base.instance.media;
        this.kws = ["none"];
        for (const m of media) {
            for (const kw of (m.kw || [])) {
                if (!this.kws.includes(kw)) this.kws.push(kw);
            }
        }
        // parse hints from assets
        // -- map media tag back to asset id
        this.hintMap = {};
        for (const asset of this.assets) {
            if (!asset.id || !asset.xsketch) continue;
            this.hintMap[asset.xsketch.tag] = asset.id;
        }

        // setup state
        this.toolMode = "paint";
        this.layerMode = "l1.fg";
        this.tileButtons = [];
        this.filterKwButtons = [];
        this.levelViews = [];
        this.selectedTile = "003";
        this.filterKw = "none";
        for (let i=1; i<=8; i++) this[`selectedHelp${i}`] = "000";

        this.xregion = WorldGen.vendor1;

        // lookup object references
        // wire callbacks
        this.gridPanel = Hierarchy.find(this.view, v=>v.tag === "gridPanel");
        this.editorPanel = Hierarchy.find(this.view, v=>v.tag === "editorPanel");
        this.lvlPanel = Hierarchy.find(this.view, v=>v.tag === "lvlPanel");
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
        let toggle = Hierarchy.find(this.view, v=>v.tag === "lvl.tog");
        toggle.evtClicked.listen(((lvlPanel) => (evt) => lvlPanel.visible = evt.value)(this.lvlPanel));
        this.currentTile = Hierarchy.find(this.view, v=>v.tag === "currentTile");
        for (let i=1; i<=8; i++) {
            let tag = `helpTile${i}`;
            this[tag] = Hierarchy.find(this.view, v=>v.tag === tag);
            this[tag].evtClicked.listen(this.onTileSelected);
            this[tag].assetId = "000";
        }
        this.newButton = Hierarchy.find(this.view, v=>v.tag === "newButton");
        this.newButton.evtClicked.listen(this.onNew);
        this.loadButton = Hierarchy.find(this.view, v=>v.tag === "loadButton");
        this.loadButton.evtClicked.listen(this.onLoad);
        this.editButton = Hierarchy.find(this.view, v=>v.tag === "editButton");
        this.editButton.evtClicked.listen(this.onEdit);
        this.saveButton = Hierarchy.find(this.view, v=>v.tag === "saveButton");
        this.saveButton.evtClicked.listen(this.onSave);

        this.xText = Hierarchy.find(this.view, v=>v.tag === "xText");
        this.yText = Hierarchy.find(this.view, v=>v.tag === "yText");

        // hook camera
        //if (this.player) this.camera.trackTarget(this.player);
        //this.camera.trackWorld(this.model);
        //this.camera._x = -32;
        //this.camera._y = -32;

        // build out dynamic UI elements
        this.buildTileButtons();
        //this.buildViews();

    }

    onKeyDown(evt) {
        if (evt.key === "1") this.selectedTile = this.selectedHelp1;
        if (evt.key === "2") this.selectedTile = this.selectedHelp2;
        if (evt.key === "3") this.selectedTile = this.selectedHelp3;
        if (evt.key === "4") this.selectedTile = this.selectedHelp4;
        if (evt.key === "b") this.toolMode = "paint";
        if (evt.key === "f") this.toolMode = "fill";
        if (evt.key === "g") this.toolMode = "get";
        if (evt.key === "d") this.toolMode = "delete";
    }

    fill(layer, depth, i, j, tile) {
        let matchid = this.getid(layer, depth, i, j);
        if (matchid === tile) return;
        let q = [`${i},${j}`];
        // FIXME: hack: there's a bug in here somewhere causing an infinite loop... limit iterations for now
        let iterations = 0;
        while (q.length && iterations<500) {
            iterations++;
            let [x,y] = q.shift().split(",");
            x = parseInt(x);
            y = parseInt(y)
            this.assignTile(layer, depth, x, y, tile);
            if (x-1 >= 0 && this.getid(layer, depth, x-1, y) === matchid) {
                let coord = `${x-1},${y}`;
                if (!q.includes(coord)) q.push(coord);
            }
            if (x+1 < this.xregion.columns && this.getid(layer, depth, x+1, y) === matchid) {
                let coord = `${x+1},${y}`;
                if (!q.includes(coord)) q.push(coord);
            }
            if (y-1 >= 0 && this.getid(layer, depth, x, y-1) === matchid) {
                let coord = `${x},${y-1}`;
                if (!q.includes(coord)) q.push(coord);
            }
            if (y+1 < this.xregion.rows && this.getid(layer, depth, x, y+1) === matchid) {
                let coord = `${x},${y+1}`;
                if (!q.includes(coord)) q.push(coord);
            }
        }
    }

    getdata(layer, depth) {
        // pull layer
        let layerData;
        if (!this.xregion.layers.hasOwnProperty(layer)) {
            layerData = {};
            this.xregion.layers[layer] = layerData;
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
        return depthData;
    }

    getid(layer, depth, i, j) {
        let data = this.getdata(layer, depth);
        let idx = Grid.idxfromij(i, j, this.xregion.columns, this.xregion.rows);
        return data[idx];
    }

    onClicked(evt) {
        if (!this.active) return;
        let localMousePos = this.editorPanel.xform.getLocal(new Vect(evt.x, evt.y))
        let bounds = new Bounds(0, 0, this.xregion.columns*Config.tileSize, this.xregion.rows*Config.tileSize);
        if (bounds.contains(localMousePos)) {
            // assign the tile...
            let i = Grid.ifromx(localMousePos.x, Config.tileSize, this.xregion.columns);
            let j = Grid.jfromy(localMousePos.y, Config.tileSize, this.xregion.rows);
            let idx = Grid.idxfromij(i, j, this.xregion.columns, this.xregion.rows);
            this.lastMouseIdx = idx;
            let fields = this.layerMode.split(".");
            let layer = fields[0];
            let depth = fields[1];
            if (this.toolMode === "paint") {
                this.assignTile(layer, depth, i, j, this.selectedTile);
            } else if (this.toolMode === "fill") {
                this.fill(layer, depth, i, j, this.selectedTile);
            } else if (this.toolMode === "get") {
                let tileid = this.getid(layer, depth, i, j);
                if (tileid) {
                    let assetid = tileid.slice(1);
                    if (tileid && assetid !== "000") this.selectedTile = assetid;
                }
            } else if (this.toolMode === "delete") {
                this.assignTile(layer, depth, i, j, "000");
            }
        }
    }

    onMouseMoved(evt) {
        if (Mouse.down) {
            let localMousePos = this.editorPanel.xform.getLocal(new Vect(evt.x, evt.y))
            let bounds = new Bounds(0, 0, this.xregion.columns*Config.tileSize, this.xregion.rows*Config.tileSize);
            if (bounds.contains(localMousePos)) {
                let i = Grid.ifromx(localMousePos.x, Config.tileSize, this.xregion.columns);
                let j = Grid.jfromy(localMousePos.y, Config.tileSize, this.xregion.rows);
                let idx = Grid.idxfromij(i, j, this.xregion.columns, this.xregion.rows);
                if (idx !== this.lastMouseIdx) {
                    this.lastMouseIdx = idx;
                    this.onClicked(evt);
                }
            }
        }
    }

    onCanvasResized(evt) {
        this.buildTileButtons();
    }

    onTileSelected(evt) {
        this.selectedTile = evt.actor.assetId;
    }

    onSave() {
        this.active = false;
        // create new controller for menu
        this.stateMgr.push(new EditorSaveState({xregion: this.xregion}));
    }

    onLoad() {
        this.active = false;
        // create new controller for menu
        this.stateMgr.push(new EditorLoadState({assignRegion: this.assignRegion}));
    }

    onNew() {
        this.active = false;
        // create new controller for menu
        this.stateMgr.push(new EditorNewState({assignRegion: this.assignRegion}));
    }

    onEdit() {
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
        this.updateCoords(ctx);
        this.updateHints(ctx);
    }

    assignTile(layer, depth, i, j, id, flags="0") {
        let data = this.getdata(layer, depth);
        // assign tile to region
        let idx = Grid.idxfromij(i, j, this.xregion.columns, this.xregion.rows);
        data[idx] = `${flags}${id}`;
        // update view
        this.editorPanel.assignTile(layer, depth, i, j, id, 0);
    }

    assignRegion(xregion) {
        // update lvl panel xform
        this.lvlPanel.xform.dx = -xregion.offx*Config.tileSize-xregion.columns*Config.halfSize;
        this.lvlPanel.xform.dy = -xregion.offy*Config.tileSize-xregion.rows*Config.halfSize;
        // reset lvl panel
        this.lvlPanel.loadedRegion = xregion.tag;
        this.lvlPanel.firstUpdate = false;
        // update editor panel xform
        this.editorPanel.xform.dx = -xregion.columns*Config.halfSize;
        this.editorPanel.xform.dy = -xregion.rows*Config.halfSize;
        // inform editor panel of region change
        this.editorPanel.assignRegion(xregion);
        this.xregion = xregion;

        let fields = this.layerMode.split(".");
        let layer = fields[0];
        let layerId = Config.layerMap[layer];
        let offy = layerId * Config.tileSize;
        this.editorPanel.setLayerOffy(offy);

        //xxform: { dx: -xregion.columns*Config.halfSize, dy: -xregion.rows*Config.halfSize, offset: 10, scalex: Config.renderScale, scaley: Config.renderScale },
    }

    updateSelectedTile(ctx) {
        if (this.selectedTile !== this.lastSelectedTile) {
            this.lastSelectedTile = this.selectedTile;
            let xobj = this.assets.fromId(this.selectedTile);
            if (!xobj) return;
            let sketch = Generator.generate(Object.assign({}, xobj.xsketch, { lockRatio: true, xfitter: { cls: "FitToParent" }}));
            if (!sketch) return;
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
            let lastLayerId = 0;
            if (this.lastLayerMode) {
                let fields = this.lastLayerMode.split(".");
                let layer = fields[0];
                lastLayerId = Config.layerMap[layer];
            }
            this.lastLayerMode = this.layerMode;
            for (const layer of ["l1", "l2", "l3"]) {
                for (const depth of ["bg", "bgo", "fg", "fgo"]) {
                    this[`${layer}${depth}Select`].visible = (this.layerMode === `${layer}.${depth}`);
                    if (this.layerMode === `${layer}.${depth}`) {
                        let layerId = Config.layerMap[layer];
                        let offy = (layerId-lastLayerId) * Config.tileSize;
                        this.editorPanel.setLayerOffy(offy);
                        /*
                        // iterate through all model state
                        for (const view of Object.values(this.tileViews)) {
                            if (view.model) {
                                view.model._y += offy;
                            }
                        }
                        */
                    }
                }
            }
        }
    }

    updateCoords(ctx) {
        let localMousePos = this.editorPanel.xform.getLocal(new Vect(Mouse.x, Mouse.y));
        let bounds = new Bounds(0, 0, this.xregion.columns*Config.tileSize, this.xregion.rows*Config.tileSize);
        if (bounds.contains(localMousePos)) {
            // look up grid indices
            let i = Grid.ifromx(localMousePos.x, Config.tileSize, this.xregion.columns);
            let j = Grid.jfromy(localMousePos.y, Config.tileSize, this.xregion.rows);
            if (this.lastI !== i) {
                this.lastI = i;
                this.xText.text = `x: ${i}`;
            }
            if (this.lastJ !== j) {
                this.lastJ = j;
                this.yText.text = `y: ${j}`;
            }
        }
    }

    getHints(layer, depth, i, j, dir) {
        let id = this.getid(layer, depth, i, j);
        if (!id) return [];
        let assetid = id.slice(1);
        let asset = this.assets.fromId(assetid);
        let media = this.media.get((asset) ? asset.xsketch.tag : "");
        if (!media || !media.hints) return [];
        return media.hints[dir];
    }

    updateHints(ctx) {
        let localMousePos = this.editorPanel.xform.getLocal(new Vect(Mouse.x, Mouse.y));
        let bounds = new Bounds(0, 0, this.xregion.columns*Config.tileSize, this.xregion.rows*Config.tileSize);
        if (bounds.contains(localMousePos)) {
            // look up grid indices
            let i = Grid.ifromx(localMousePos.x, Config.tileSize, this.xregion.columns);
            let j = Grid.jfromy(localMousePos.y, Config.tileSize, this.xregion.rows);
            let idx = Grid.idxfromij(i, j, this.xregion.columns, this.xregion.rows);
            if (idx != this.lastHintIdx) {
                this.lastHintIdx = idx;
                let fields = this.layerMode.split(".");
                let layer = fields[0];
                let depth = fields[1];
                // look up any hints based on neighbors...
                let hints = [];
                for (const [dir, io, jo] of [["r", -1, 0], ["l", 1, 0], ["d", 0, -1], ["u", 0, 1]]) {
                    if (i+io >=0 && i+io < this.xregion.columns && j+jo >= 0 && j+jo < this.xregion.rows) {
                        let dhints = this.getHints(layer, depth, i+io, j+jo, dir);
                        if (dhints && dhints.length) {
                            if (hints.length) {
                                let intersect = [];
                                for (const hint of dhints) {
                                    if (hints.includes(hint)) intersect.push(hint);
                                }
                                hints = intersect;
                            } else {
                                hints = dhints;
                            }
                        }
                    }
                }
                if (!Util.arraysEqual(this.lastHints, hints)) {
                    this.lastHints = hints;
                    for (let i=0; i<8; i++) {
                        let xsketch = this.media.get(hints[i]) || {};
                        let assetId = this.hintMap[hints[i]] || "000";
                        let sketch = Generator.generate(Object.assign({}, xsketch, { xfitter: { cls: "FitToParent" }}));
                        let helpTileTag = `helpTile${i+1}`;
                        let view = this[helpTileTag];
                        view.unpressed = sketch;
                        view.assetId = assetId;
                        this[`selectedHelp${i+1}`] = assetId;
                    }
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
        let maxCols = Math.floor(this.tileButtonsPanel.width/30);
        let colStep = 1/maxCols;
        let maxRows = Math.floor(this.tileButtonsPanel.height/30);
        let rowStep = 1/maxRows;
        // add button for rest of tileset assets
        for (const asset of this.assets) {
            if (!asset.id || !asset.xsketch) continue;
            // skip based on filter
            if (this.filterKw != "none") {
                let media = this.media.get(asset.xsketch.tag);
                if (!media) continue;
                if (!media.kw || !media.kw.includes(this.filterKw)) continue;
            }
            let bspec = {
                cls: "UxButton",
                dfltDepth: this.tileButtonsPanel.depth + 1,
                dfltLayer: this.tileButtonsPanel.layer,
                parent: this.tileButtonsPanel,
                xxform: {parent: this.tileButtonsPanel.xform, left: col*colStep, right: 1-(col+1)*colStep, top: row*rowStep, bottom: 1-(row+1)*rowStep},
                //xunpressed: Object.assign({}, asset.xsketch, { lockRatio: true, xfitter: { cls: "FitToParent" } }),
                xunpressed: Object.assign({}, asset.xsketch, { xfitter: { cls: "FitToParent" } }),
                xtext: {text: " " + asset.id.toString() + " ", color: new Color(255,255,0,.175)},
            };
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
                        Templates.editorInput("columnsInput", "16",  { xxform: { top: 1/5, bottom: 1-2/5, left: .4, offset: 10}, charset: '0123456789'}),
                        Templates.editorText(null, "rows:",         { xxform: { top: 2/5, bottom: 1-3/5, right: .6, left: .05, otop: 20, obottom:10}}),
                        Templates.editorInput("rowsInput", "16",     { xxform: { top: 2/5, bottom: 1-3/5, left: .4, offset: 10}, charset: '0123456789'}),
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
        //if (!confirm("Creating new level will erase current level data, OK to proceed?")) return;
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
        //if (!confirm("Creating new level will erase current level data, OK to proceed?")) return;
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
                Templates.editorPanel("bgPanel"),
                Templates.editorText(null, "Load Level", { xxform: { top: .025, bottom: .915}}),
                Templates.editorPanel("lvlBgPanel", { xxform: { top: .1, bottom: .1}, xchildren: [
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
        let maxCols = 8;
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
        //if (!confirm("Loading new level will erase current level data, OK to proceed?")) return;
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
        if (evt.key === "z" || evt.key === "x" || evt.key === "Escape")  {
            this.onBack();
        }
    }

    onCopy(evt) {
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
            if (v === null) v = "0000";
            if (v === undefined) v = "0000";
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
                // check depth data for null...
                let empty = true;
                for (const v of depthData) {
                    if (v !== null && v !== undefined && v !== "0000") empty = false;
                    if (!empty) break;
                }
                if (empty) continue;
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
