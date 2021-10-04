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
import { Generator }        from "./base/generator.js";
import { UxGloom }          from "./uxGloom.js";
import { Templates }        from "./templates.js";
import { Atts }             from "./base/atts.js";
import { Vect }             from "./base/vect.js";
import { PauseAction }      from "./actions/pause.js";
import { WaitAction }       from "./actions/wait.js";
import { ResumeAction }     from "./actions/resume.js";
import { PanToAction }      from "./actions/panTo.js";
import { PowerUpAction }    from "./actions/powerUp.js";
import { UxPanel }          from "./base/uxPanel.js";
import { Font }             from "./base/font.js";
import { Text }             from "./base/text.js";
import { Event }            from "./base/event.js";
import { SparkDialog } from "./sparkDialog.js";
import { Dialog } from "./base/dialog.js";
import { UxDialogCtrl } from "./uxDialog.js";
import { Bounds } from "./base/bounds.js";
import { Hierarchy } from "./base/hierarchy.js";
import { PlaySoundAction } from "./base/action.js";

class PlayState extends State {

    static actionSketches = {
        "none":         {cls: "Text", text: "X", xfitter: { cls: "FitToParent"}, color: new Color(225,0,0,.75)},
        "leave":        {cls: "Text", text: "^", xfitter: { cls: "FitToParent"}, color: new Color(225,0,0,.75)},
        "occupy":       {cls: "Text", text: "V", xfitter: { cls: "FitToParent"}, color: new Color(225,0,0,.75)},
        "spark":        {cls: "Text", text: "#", xfitter: { cls: "FitToParent"}, color: new Color(225,0,0,.75)},
        "open":         {cls: "Text", text: "o", xfitter: { cls: "FitToParent"}, color: new Color(225,0,0,.75)},
        "talk":         {cls: "Text", text: "t", xfitter: { cls: "FitToParent"}, color: new Color(225,0,0,.75)},
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
                    Templates.dbgText("coords", "x,y",                  { xxform: { top: 0/7, bottom: 1-1/7 }}),
                    Templates.dbgText(null, "1 - hide debug",       { xxform: { top: 1/7, bottom: 1-2/7 }}),
                    Templates.dbgText(null, "2 - show colliders",   { xxform: { top: 2/7, bottom: 1-3/7 }}),
                    Templates.dbgText(null, "3 - show areas",       { xxform: { top: 3/7, bottom: 1-4/7 }}),
                    Templates.dbgText(null, "4 - show grid",        { xxform: { top: 4/7, bottom: 1-5/7 }}),
                    Templates.dbgText(null, "5 - hide night",       { xxform: { top: 5/7, bottom: 1-6/7 }}),
                    Templates.dbgText(null, "6 - hide gloom",       { xxform: { top: 6/7, bottom: 1-7/7 }}),
                ]}),
                Templates.dbgText("pauseText", "paused",       { xxform: { border: .4 }}),
            ],
        };
        spec.xmodel = World.xlvl;
    }


    cpost(spec) {
        super.cpost(spec);
        this.camera = spec.camera || Camera.main;
        //this.camera.dbg = true;

        Util.bind(this, "onKeyDown", "onClicked", "onMenu", "onMorale", "onCloseDialog");
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

        this.xupSketch = Base.instance.media.get("upArrow");
        this.xdownSketch = Base.instance.media.get("downArrow");

        // lookup object references
        this.player = this.findFirst(v=>v.tag === "player");
        this.dbgPanel = this.findFirst(v=>v.tag === "dbgPanel");
        this.pauseText = this.findFirst(v=>v.tag === "pauseText");
        this.pauseText.visible = false;
        this.menuButton = this.findFirst(v=>v.tag === "menu");
        //console.log(`menuButton: ${this.menuButton}`);
        this.menuButton.evtClicked.listen(this.onMenu);
        this.moraleButton = this.findFirst(v=>v.tag === "morale");
        //console.log(`moraleButton: ${this.moraleButton}`);
        this.moraleButton.evtClicked.listen(this.onMorale);
        this.zPanel = this.findFirst(v=>v.tag === "zPanel");
        this.coordsText = this.findFirst(v=>v.tag === "coords");
        //console.log(`zPanel: ${this.zPanel}`);
        //console.log(`PlayState player is ${this.player}`);
        // hook camera
        if (this.player) this.camera.trackTarget(this.player);
        this.camera.trackWorld(this.model);

        // hook to game events
        this.eventQ = spec.eventQ || Atts.gameEventQ;
        this.actions = [];

        // ui state

        // audio sfxs
        this.grumbles = [
            Generator.generate({cls: "Media", tag: "grumble1"}),
            Generator.generate({cls: "Media", tag: "grumble2"}),
            Generator.generate({cls: "Media", tag: "grumble3"}),
        ];
        this.cheers = [
            Generator.generate({cls: "Media", tag: "cheer1"}),
            Generator.generate({cls: "Media", tag: "cheer2"}),
            Generator.generate({cls: "Media", tag: "cheer3"}),
        ];
        this.pillarActivateSfx = Generator.generate({cls: "Media", tag: "pillarActivation"}),

        // find game objects...
        this.vendorSparkbase = this.findFirst(v=>v.tag === "vhouse.rune" && v.ownerTag === "Aodhan");
        this.vendorSparkbase2 = this.findFirst(v=>v.tag === "floorRelay" && v.ownerTag === "Aodhan");

        // debug mode
        this.clickMode = "path";

    }

    get grid() {
        return this.model.grid;
    }

    onKeyDown(evt) {
        if (!this.view.active) return;
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
        if (evt.key === "7") {
            Config.dbg.Stats = !Config.dbg.Stats;
        }
        if (evt.key === "8") {
            //this.eventQ.push(new Event("npc.chat", {actor: this.player, target: null, msg: "hello there", kind: null}));
            let xdialog = SparkDialog.dialogs.test;
            xdialog.actor = this.player;
            let dialog = new Dialog(xdialog);
            //this.genDialog(undefined, dialog);
            this.eventQ.push(new Event("npc.dialog", {actor: this.player, target: null, dialog: dialog}));
            //console.log(`dialog: ${Fmt.ofmt(dialog)}`);
            //let ctrl = new UxDialogCtrl({dialog: dialog});
            //console.log(`ctrl: ${Fmt.ofmt(ctrl)}`);
        }
        if (evt.key === "9") {
            switch(this.clickMode) {
            case "check":
                this.clickMode = "path";
                break;
            case "path":
                this.clickMode = "check";
                break;
            }
            console.log(`changed clickMode to: ${this.clickMode}`);
        }
        if (evt.key === "p") {
            Atts.paused = !Atts.paused;
            this.pauseText.visible = Atts.paused;
        }
        if (evt.key === "m"){      
           Base.instance.audioMgr.muteToggle();
        }
    }

    checkClickedForCollision(x, y) {
        let target = new LevelNode(x, y, this.player.layer);
        console.log("check collisions for target: " + target);
        let xbounds = new Bounds(target.x-Config.halfSize, target.y-Config.halfSize, Config.tileSize, Config.tileSize);
        for (const other of this.findOverlaps(xbounds, (v) => ((v.collider) && v.layer === this.player.layer))) {
            let overlap = xbounds.overlaps(other.collider);
            console.log(`found collider: ${other} overlap: ${overlap}`);
        }

        // pull up pathfinding system
        let pfsys = Hierarchy.find(Base.instance.systemMgr, (o => o.cls === "PathfindingSystem"));
        console.log(`pfsys: ${pfsys}`);
        let graph = pfsys.lvlGraph;

        // get neighbors of current target
        let neighbors = graph.getNeighbors(target, this.player.collider.blocking);
        for(const n of neighbors) {
            console.log(`==> neighbor: ${n}`);
        }
    }

    pathToClick(x, y) {
        let target = new LevelNode(x, y, this.player.layer);
        console.log("player path to target: " + target);
        this.player.wantPathTo = target;
    }

    panToClick(x, y) {
        if (this.camera.panTarget) {
            this.camera.stopPan();
            this.camera.center();
        } else {
            let target = new Vect(x,y);
            this.camera.startPan(target);
        }
    }


    onClicked(evt) {
        if (!this.view.active) return;
        // ignore if within button
        if (this.moraleButton.mouseOver || this.menuButton.mouseOver) return;
        //let localMousePos = this.editorPanel.xform.getLocal(new Vect(evt.x, evt.y))
        console.log("onClicked: " + Fmt.ofmt(evt));
        let x = evt.x + this.camera.minx;
        let y = evt.y + this.camera.miny;
        x = x/Config.renderScale;
        y = y/Config.renderScale;
        switch (this.clickMode) {
            case "check":
                this.checkClickedForCollision(x,y);
                break;
            case "path":
                this.pathToClick(x,y);
                break;
            case "pan":
                this.panToClick(x,y);
                break;
        }
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
                wantMouse: obj.hoverable,
                xxform: Object.assign({scalex:Config.renderScale, scaley:Config.renderScale}, obj.xxform),
                model: obj,
            };
            view = new ModelView(xview);
            obj.view = view;
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
        let action = Atts.interactAction;
        //// FIXME
        //let action = "spark";
        if (this.lastAction !== action) {
            //console.log(`setting z action to: ${action}`);
            // update z panel w/ new icon for given action
            let sketch = Generator.generate(PlayState.actionSketches[action]);
            this.zPanel.sketch = sketch;
            this.lastAction = action;
            return true;
        }
        return false;
    }

    updateCoords(ctx) {
        let x = (Mouse.x + this.camera.minx)/Config.renderScale;
        let y = (Mouse.y + this.camera.miny)/Config.renderScale;
        if (this.lastCoordX !== x || this.lastCoordY !== y) {
            this.lastCoordX = x;
            this.lastCoordY = y;
            let node = new LevelNode(x, y, 0);
            this.coordsText.text = `${node.x},${node.y}`;
            return true;
        }
        return false;
    }

    updateCamera(ctx) {
        this.camera.update(ctx);
        return false;
    }

    startMoraleIndicator(target, up=true) {
        // create new indicator
        let dx = target.x*Config.renderScale - this.camera.minx;
        let dy = target.y*Config.renderScale - this.camera.miny;
        let xview = {
            cls: "UxMoraleIndicator",
            ui: true,
            target: target,
            xsketch: (up) ? this.xupSketch: this.xdownSketch,
            ttl: 1000,
            dx: 0,
            dy: -.01,
            getx: () => target.x*Config.renderScale - this.camera.minx,
            gety: () => target.y*Config.renderScale - this.camera.miny,
            xxform: { dx: -8, dy: -25, x: dx, y: dy, scalex: Config.renderScale, scaley: Config.renderScale },
        };
        let view = new UxMoraleIndicator(xview);
    }

    genChat(target, msg) {
        // measure text
        let font = new Font({size: 16});
        let size = Text.measure(font, msg);

        let xview = {
            cls: "UxChatBubble",
            ui: true,
            target: target,
            xsketch: { cls: 'Media', tag: "btnGoldOpaqS4" },
            ttl: 3000,
            getx: () => target.x*Config.renderScale - this.camera.minx,
            gety: () => target.y*Config.renderScale - this.camera.miny,
            xxform: { width: size.x+10, height: size.y+10, dx: -8, dy: -25, x: target.x*Config.renderScale-this.camera.minx, y: target.y*Config.renderScale-this.camera.miny, scalex: Config.renderScale, scaley: Config.renderScale },
            xchildren: [
                Templates.playText(null, msg, {xxform: {left: .05, right: .05}}),
            ],
        };
        let view = new UxChatBubble(xview);
    }

    genDialog(dialog) {
        // don't start new dialog if dialog is already running
        if (this.currentDialog) return;
        // create new dialog controller
        this.currentDialog = new UxDialogCtrl({dialog: dialog});
        // disable play state ui and mouse clicks
        this.view.active = false;
        // pause game
        Atts.paused = true;
        // hook destroy event for dialog
        this.currentDialog.evtDestroyed.listen(this.onCloseDialog);
    }

    onCloseDialog() {
        // clear dialog
        this.currentDialog = null;
        // re-enable play state
        this.view.active = true;
        // unpause game
        Atts.paused = false;
    }

    updateGameEvents(ctx) {
        while (this.eventQ.length) {
            let evt = this.eventQ.shift();
            console.log(`play state processing game event: ${Fmt.ofmt(evt)}`);

            let sfx;
            switch (evt.tag) {
                case "npc.moraleMax":
                    // spark base activation for aodhan
                    if (evt.actor.tag === "aodhan") {
                        // push new actions to queue...
                        this.actions.push(new PauseAction());
                        this.actions.push(new PanToAction({target: this.vendorSparkbase}));
                        this.actions.push(new PlaySoundAction({sfx: this.pillarActivateSfx}));
                        this.actions.push(new PowerUpAction({target: this.vendorSparkbase}));
                        this.actions.push(new WaitAction());
                        this.actions.push(new PanToAction({target: this.vendorSparkbase2}));
                        this.actions.push(new PlaySoundAction({sfx: this.pillarActivateSfx}));
                        this.actions.push(new PowerUpAction({target: this.vendorSparkbase2}));
                        this.actions.push(new WaitAction());
                        this.actions.push(new PanToAction({target: this.player}));
                        this.actions.push(new ResumeAction());
                    }
                    break;
                case "npc.moraleUp":
                    this.startMoraleIndicator(evt.actor, true);
                    sfx = Util.choose(this.cheers);
                    sfx.play();
                    break;
                case "npc.moraleDown":
                    this.startMoraleIndicator(evt.actor, false);
                    sfx = Util.choose(this.grumbles);
                    sfx.play();
                    break;
                case "npc.chat":
                    this.genChat(evt.actor, evt.msg);
                    break;
                case "npc.dialog":
                    this.genDialog(evt.dialog);
                    break;
            }

        }
        return false;
    }

    firstUpdate(ctx) {
        this.music = Generator.generate(Base.instance.media.get("gameplayMusic"));
        //console.log(`this.music: ${this.music}`);
        this.music.play();
    }

    iupdate(ctx) {
        if (!this.firstUpdated && Base.instance.audioMgr.resumed) {
            this.firstUpdated = true;
            this.firstUpdate(ctx);
        }
        this.updated = super.iupdate(ctx);
        this.updated |= this.updateZPanel(ctx);
        this.updated |= this.updateCoords(ctx);
        // camera control
        this.updated |= this.updateCamera(ctx);
        // handle game events...
        this.updated |= this.updateGameEvents(ctx);
        return this.updated;
    }

}


class UxMoraleIndicator extends UxPanel {

    // CONSTRUCTOR ---------------------------------------------------------
    cpre(spec) {
        super.cpre(spec);
        if (spec.xsketch && !spec.xsketch.xfitter) spec.xsketch.xfitter = {};
    }
    cpost(spec={}) {
        super.cpost(spec);
        this.target = spec.target || { x: 0, y: 0};
        this.ttl = spec.ttl || 1000;
        this.dx = spec.dx || 0;
        this.dy = spec.dy || 0;
        this.getx = spec.getx || (() => 0);
        this.gety = spec.gety || (() => 0);
    }

    iupdate(ctx) {
        this.updated |= super.iupdate(ctx);
        this.ttl -= ctx.deltaTime;
        if (this.ttl <= 0) {
            this.destroy();
            return false;
        }
        this.xform._offx = this.getx();
        this.xform._offy = this.gety();
        this.xform.dx += (this.dx * ctx.deltaTime);
        this.xform.dy += (this.dy * ctx.deltaTime);
        if (this.dx || this.dy) this.updated = true;
        return this.updated;
    }
}

class UxChatBubble extends UxPanel {

    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec={}) {
        super.cpost(spec);
        this.target = spec.target || { x: 0, y: 0};
        this.ttl = spec.ttl || 3000;
        this.getx = spec.getx || (() => 0);
        this.gety = spec.gety || (() => 0);
    }

    iupdate(ctx) {
        this.updated |= super.iupdate(ctx);
        this.ttl -= ctx.deltaTime;
        if (this.ttl <= 0) {
            this.destroy();
            console.log("destroy chat bubble");
            return true;
        }
        this.xform._offx = this.getx();
        this.xform._offy = this.gety();
        if (this.dx || this.dy) this.updated = true;
        return this.updated;
    }
}