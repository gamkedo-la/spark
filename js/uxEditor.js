class UxEditorView extends UxPanel {
    constructor(spec={}) {
        super(spec);
        console.log("starting ux editor view");
    }

    renderGrid(ctx) {
        ctx.strokeStyle = "rgba(255,255,0,.25";
        ctx.lineWidth = 3;
        // vertical
        for (let i=0; i<currentLevel.width; i++) {
            ctx.beginPath()
            ctx.moveTo(i*currentLevel.sketchWidth,0);
            ctx.lineTo(i*currentLevel.sketchWidth,currentLevel.maxy);
            ctx.stroke();
        }
        // horizontal
        for (let i=0; i<currentLevel.height; i++) {
            ctx.beginPath()
            ctx.moveTo(0,i*currentLevel.sketchHeight);
            ctx.lineTo(currentLevel.maxx,i*currentLevel.sketchHeight);
            ctx.stroke();
        }
    }

    renderRooms(ctx) {
        if (this.ctrl && this.ctrl.selectMode === "room") {
            for (let i=0; i<this.ctrl.rooms.length; i++) {
                let id = this.ctrl.rooms[i];
                if (!id) continue;
                let x = currentLevel.xfromidx(i);
                let y = currentLevel.yfromidx(i);
                let text = new Text({text:id.toString(), width: 40, height: 40, align: "center", valign: "middle", color: "rgba(255,255,0,.75"});
                text.render(ctx, x, y+5);
            }
        }
    }

    render(ctx) {
        super.render(ctx);
		// Wrapped in IF/ELSE to support Tile Editor Mode	
		ctx.translate(-camera.x, -camera.y);
        currentLevel.render(ctx);
        //currentLevel.lateRender(ctx);
        this.renderGrid(ctx);
        this.renderRooms(ctx);
		ctx.translate(camera.x, camera.y);
    }
}

class UxEditorCtrl extends UxCtrl {
    constructor(spec={}) {
        super(spec);
        // construct the UI elements
        this.view = UxView.generate({
            cls: "UxCanvas",
            cvsid: "gameCanvas",
            tag: "editorCanvas",
            resize: true,
            xchild: [
                {
                    cls: "UxEditorView",
                    ctrl: this,
                    tag: "editorPanel",
                    xxform: { origx: 0, origy: 0, right: .3 },
                    xsketch: { cls: 'Rect', color: new Color(0,20,100,1), xfitter: { cls: "FitToParent" }, },
                },
                {
                    cls: "UxPanel",
                    tag: "menuPanel",
                    xxform: { left: .7, bottom: 0},
                    xsketch: { cls: 'Rect', color: new Color(0,0,0,1), xfitter: { cls: "FitToParent" }, },
                    xchild: [
                        {
                            cls: "UxText",
                            xxform: { top: .01, bottom: .95},
                            xtext: { color: new Color(0,255,0,.75), text: "Editor Menu", },
                        },
                        {
                            cls: "UxButton",
                            tag: "helpButton",
                            xxform: { top: .01, bottom: .95, left: .9, right: .025},
                            xtext: { color: new Color(0,255,0,.75), text: "?", },
                        },

                        {
                            cls: "UxButton",
                            tag: "newButton",
                            xxform: { top: .05, bottom: .9, right: .75, offset: 5},
                            xtext: { color: new Color(0,255,0,.75), text: "New", },
                        },

                        {
                            cls: "UxButton",
                            tag: "loadButton",
                            xxform: { top: .05, bottom: .9, right: .5, left: .25, offset: 5},
                            xtext: { color: new Color(0,255,0,.75), text: "Load", },
                        },

                        {
                            cls: "UxButton",
                            tag: "editButton",
                            xxform: { top: .05, bottom: .9, right: .25, left: .5, offset: 5},
                            xtext: { color: new Color(0,255,0,.75), text: "Edit", },
                        },

                        {
                            cls: "UxButton",
                            tag: "generateButton",
                            xxform: { top: .05, bottom: .9, left: .75, offset: 5},
                            xtext: { color: new Color(0,255,0,.75), text: "Generate", },
                        },

                        {
                            cls: "UxPanel",
                            xxform: { top: .1, bottom: .8, right: .67, offset: 5},
                            xsketch: { cls: 'Rect', color: new Color(0,20,200,1), xfitter: { cls: "FitToParent" }, },
                            xchild: [
                                {
                                    cls: "UxPanel",
                                    tag: "fgSelectPanel",
                                    xxform: {offset: 3},
                                    xsketch: { cls: 'Rect', borderWidth: 5, borderColor: new Color(255,0,0,.5), xfitter: { cls: "FitToParent" }, },
                                },
                                {
                                    cls: "UxButton",
                                    tag: "fgButton",
                                    xxform: { bottom: .6, offset: 5 },
                                    xtext: { color: new Color(0,255,0,.75), text: "FG", },
                                },
                                {
                                    cls: "UxPanel",
                                    tag: "fgPanel",
                                    xxform: { top: .65, bottom: .35, left: .5, right: .5, width: 40, height: 40},
                                },
                            ],
                        },

                        {
                            cls: "UxPanel",
                            xxform: { top: .1, bottom: .8, left: .33, right: .33, offset: 5},
                            xsketch: { cls: 'Rect', color: new Color(0,20,200,1), xfitter: { cls: "FitToParent" }, },
                            xchild: [
                                {
                                    cls: "UxPanel",
                                    tag: "bgSelectPanel",
                                    xxform: {offset: 3},
                                    xsketch: { cls: 'Rect', borderWidth: 5, borderColor: new Color(255,0,0,.5), xfitter: { cls: "FitToParent" }, },
                                },
                                {
                                    cls: "UxButton",
                                    tag: "bgButton",
                                    xxform: { bottom: .6, offset: 5 },
                                    xtext: { color: new Color(0,255,0,.75), text: "BG", },
                                },
                                {
                                    cls: "UxButton",
                                    tag: "bgFillButton",
                                    xxform: { top: .4, bottom: .1, left: .65, offset: 5 },
                                    xtext: { color: new Color(0,255,0,.75), text: "Fill", },
                                },
                                {
                                    cls: "UxPanel",
                                    tag: "bgPanel",
                                    xxform: { top: .65, bottom: .35, left: .5, right: .5, width: 40, height: 40},
                                },
                            ],
                        },

                        {
                            cls: "UxPanel",
                            xxform: { top: .1, bottom: .8, left: .67, offset: 5},
                            xsketch: { cls: 'Rect', color: new Color(0,20,200,1), xfitter: { cls: "FitToParent" }, },
                            xchild: [
                                {
                                    cls: "UxPanel",
                                    tag: "roomSelectPanel",
                                    xxform: {offset: 3},
                                    xsketch: { cls: 'Rect', borderWidth: 5, borderColor: new Color(255,0,0,.5), xfitter: { cls: "FitToParent" }, },
                                },
                                {
                                    cls: "UxButton",
                                    tag: "roomButton",
                                    xxform: { bottom: .6, offset: 5 },
                                    xtext: { color: new Color(0,255,0,.75), text: "Room", },
                                },
                                {
                                    cls: "UxPanel",
                                    tag: "roomPanel",
                                    xxform: { top: .65, bottom: .35, left: .5, right: .5, width: 40, height: 40},
                                },
                            ],
                        },

                        {
                            cls: "UxPanel",
                            tag: "tilePanel",
                            xxform: { top: .2, offset: 5 },
                        },
                    ],
                },

            ],
        });
        this.dbg = spec.dbg;
        // bind UI elements
        this.editorPanel = this.view.find((v) => v.tag === "editorPanel");
        this.tilePanel = this.view.find((v) => v.tag === "tilePanel");
        this.fgPanel = this.view.find((v) => v.tag === "fgPanel");
        this.bgPanel = this.view.find((v) => v.tag === "bgPanel");
        this.roomPanel = this.view.find((v) => v.tag === "roomPanel");
        this.fgSelect = this.view.find((v) => v.tag === "fgSelectPanel");
        this.bgSelect = this.view.find((v) => v.tag === "bgSelectPanel");
        this.roomSelect = this.view.find((v) => v.tag === "roomSelectPanel");
        for (const tag of ["fg", "bg", "room"]) {
            let b = this.view.find((v) => v.tag === tag + "Button");
            if (b) {
                b.evtClicked.listen((evt) => { 
                    if (this.dbg) console.log(tag + " selected");
                    this.selectMode = tag; 
                });
            }
        }
        this.newButton = this.view.find((v) => v.tag === "newButton");
        this.newButton.evtClicked.listen(this.onNew.bind(this));
        this.loadButton = this.view.find((v) => v.tag === "loadButton");
        this.loadButton.evtClicked.listen(this.onLoadLevel.bind(this));
        this.editButton = this.view.find((v) => v.tag === "editButton");
        this.editButton.evtClicked.listen(this.onEditLevel.bind(this));
        this.genButton = this.view.find((v) => v.tag === "generateButton");
        this.genButton.evtClicked.listen(this.onGenerate.bind(this));
        this.fillButton = this.view.find((v) => v.tag === "bgFillButton");
        this.fillButton.evtClicked.listen(this.onFillBg.bind(this));
        this.helpButton = this.view.find((v) => v.tag === "helpButton");
        this.helpButton.evtClicked.listen(this.onHelp.bind(this));

        // build out tile buttons
        this.selectButtons = [];
        this.buildTileButtons();

        // editor state
        this.selectMode = "fg";
        this.fgId = TILE.WALL_BOTTOM;
        this.bgId = TILE.GROUND;
        this.roomId = 1;
        this.lvlName = "editorlvl";

        // handle resize of canvas/window
        camera.resize(this.editorPanel.width, this.editorPanel.height);
        this.view.evtResized.listen(this.onCanvasResize.bind(this));
        // reset levels
        levelLoader.clear();
        // update camera to track mouse position
        this.tracker = {x:0, y:0};
        camera.follow(this.tracker);
        camera.dbg = true;

        // create new basic level
        currentLevel = new Level({
            width: 12,
            height: 12,
        });
        // level doesn't keep room array, so build editor's own version
        this.rooms = this.buildRoomArray();

    }

    destroySelectButtons() {
        for (const b of this.selectButtons) {
            b.destroy();
        }
        this.selectButtons = [];
    }

    buildTileButtons() {
        this.destroySelectButtons();
        let row = 0;
        let col = 0;
        let maxCols = Math.floor(this.tilePanel.width/30);
        let colStep = 1/maxCols;
        let maxRows = Math.floor(this.tilePanel.height/30);
        let rowStep = 1/maxRows;
        // add button for "zero/no tile"
        let bspec = {
            cls: "UxButton",
            dfltDepth: this.tilePanel.depth + 1,
            dfltLayer: this.tilePanel.layer,
            parent: this.tilePanel,
            xxform: {parent: this.tilePanel.xform, left: col*colStep, right: 1-(col+1)*colStep, top: row*rowStep, bottom: 1-(row+1)*rowStep},
            xtext: {text: " " + "0" + " ", color: new Color(255,255,0,.5)},
            xunpressed: { cls: 'Rect', color: new Color(0,0,0,1), xfitter: { cls: "FitToParent" }, },
        };
        col++;
        let b = UxView.generate(bspec);
        b.assetId = 0;
        b.evtClicked.listen(this.onTileSelect.bind(this));
        this.tilePanel.adopt(b);
        this.selectButtons.push(b);
        // add button for rest of tileset assets
        for (const asset of assets) {
            if (!asset.tileset) continue;
            let bspec = {
                cls: "UxButton",
                dfltDepth: this.tilePanel.depth + 1,
                dfltLayer: this.tilePanel.layer,
                parent: this.tilePanel,
                xxform: {parent: this.tilePanel.xform, left: col*colStep, right: 1-(col+1)*colStep, top: row*rowStep, bottom: 1-(row+1)*rowStep},
                xunpressed: asset,
                xtext: {text: " " + asset.id.toString() + " ", color: new Color(255,255,0,.175)},
            };
            let b = UxView.generate(bspec);
            if (b) {
                b.assetId = asset.id;
                b.evtClicked.listen(this.onTileSelect.bind(this));
                this.tilePanel.adopt(b);
                col++;
                if (col >= maxCols) {
                    row++;
                    col = 0;
                }
                this.selectButtons.push(b);
            }
        }
    }

    buildRoomButtons() {
        console.log("build room buttons");
        this.destroySelectButtons();
        let row = 0;
        let col = 0;
        let maxCols = Math.floor(this.tilePanel.width/40);
        let colStep = 1/maxCols;
        let maxRows = Math.floor(this.tilePanel.height/40);
        let rowStep = 1/maxRows;
        for (let id = 0; id<25; id++) {
            let bspec = {
                cls: "UxButton",
                dfltDepth: this.tilePanel.depth + 1,
                dfltLayer: this.tilePanel.layer,
                parent: this.tilePanel,
                xxform: {parent: this.tilePanel.xform, left: col*colStep, right: 1-(col+1)*colStep, top: row*rowStep, bottom: 1-(row+1)*rowStep},
                xtext: {text: " " + id.toString() + " ", color: new Color(255,255,0,.5)},
            };
            let b = UxView.generate(bspec);
            if (b) {
                b.roomId = id;
                b.evtClicked.listen(this.onRoomSelect.bind(this));
                this.tilePanel.adopt(b);
                col++;
                if (col >= maxCols) {
                    row++;
                    col = 0;
                }
                this.selectButtons.push(b);
            }
        }
    }

    mouseClicked(mouseX, mouseY) {
        if (this.disable) return;
        // skip mouse click if not on camera
        console.log(`mouse: ${mouseX},${mouseY} lvl: ${currentLevel.maxx},${currentLevel.maxy} camera: ${camera.maxx},${camera.maxy}`);
        if (!currentLevel.containsPoint(mouseX, mouseY)) return;
        if (!camera.contains(mouseX, mouseY)) return;
        console.log("placing tile");
        // lookup idx of current mouse position
        let idx = currentLevel.idxfromxy(mouseX, mouseY);
        if (this.selectMode === "fg") {
            currentLevel.setfgi(idx, this.fgId);
        }
        if (this.selectMode === "bg") {
            currentLevel.setbgi(idx, this.bgId);
        }
        if (this.selectMode === "room") {
            this.rooms[idx] = this.roomId;
        }

    }

    mouseMoved(mouseX, mouseY) {
        if (this.disable) return;
        //console.log("tracker is: " + Fmt.ofmt(this.tracker));
        if(mouseDragging) {
            if (!currentLevel.containsPoint(mouseX, mouseY)) return;
            if (!camera.contains(mouseX, mouseY)) return;
            let idx = currentLevel.idxfromxy(mouseX, mouseY);
            if (this.selectMode === "fg") {
                currentLevel.setfgi(idx, this.fgId);
            }
            if (this.selectMode === "bg") {
                currentLevel.setbgi(idx, this.bgId);
            }
            if (this.selectMode === "room") {
                // FIXME: need to redo room code
                //currentLvl.setbgi(idx, this.bgId);
            }
        }
    }

    keyReleased(key) {
        let wmaxx = currentLevel.maxx;
        let wmaxy = currentLevel.maxy;
        if (key === KEY_RIGHT_ARROW) {
            if (camera.x < wmaxx-camera.dx) this.tracker.x = camera.x+camera.width - camera.dx + currentLevel.sketchWidth;
        }
        if (key === KEY_LEFT_ARROW) {
           if (camera.x > 0) this.tracker.x = camera.x + camera.dx - currentLevel.sketchWidth;
        }
        if (key === KEY_DOWN_ARROW) {
            if (camera.y < wmaxy-camera.dy) this.tracker.y = camera.y+camera.height - camera.dy + currentLevel.sketchWidth;
        }
        if (key === KEY_UP_ARROW) {
           if (camera.y > 0) this.tracker.y = camera.y + camera.dy - currentLevel.sketchWidth;
        }
        if (key === KEY_LETTER_F) {
            this.selectMode = "fg";
        }
        if (key === KEY_LETTER_B) {
            this.selectMode = "bg";
        }
        if (key === KEY_LETTER_R) {
            this.selectMode = "room";
        }
    }

    updateSelectedPanels() {
        if (this.selectMode !== this.lastSelectMode) {
            if (this.selectMode === "room") {
                this.buildRoomButtons();
                showRoomNumbers = true;
            } else {
                if (this.lastSelectMode === "room") {
                this.buildTileButtons();
                showRoomNumbers = false;
                }
            }
            this.lastSelectMode = this.selectMode;
            this.fgSelect.visible = (this.selectMode === "fg");
            this.bgSelect.visible = (this.selectMode === "bg");
            this.roomSelect.visible = (this.selectMode === "room");
        }
        if (this.fgId !== this.lastFgId) {
            this.lastFgId = this.fgId;
            let xsketch;
            if (this.fgId !== 0) {
                xsketch = Object.assign({parent: this.fgPanel}, assets.get(props.getTag(this.fgId)), {xfitter: { cls: "FitToParent" }});
            } else {
                xsketch = {parent: this.bgPanel, cls: "Text", text: "0", xfitter: { cls: "FitToParent" }, color: new Color(255,255,0,.75)};
            }
            this.fgPanel.sketch = Sketch.generate(xsketch);
        }
        if (this.bgId !== this.lastBgId) {
            this.lastBgId = this.bgId;
            let xsketch = Object.assign({parent: this.bgPanel}, assets.get(props.getTag(this.bgId)), {xfitter: { cls: "FitToParent" }});
            this.bgPanel.sketch = Sketch.generate(xsketch);
        }
        if (this.roomId !== this.lastRoomId) {
            this.lastRoomId = this.roomId;
            let xsketch = {parent: this.bgPanel, cls: "Text", text: this.roomId.toString(), xfitter: { cls: "FitToParent" }, color: new Color(255,255,0,.75)};
            this.roomPanel.sketch = Sketch.generate(xsketch);
        }
    }

    update(updateCtx) {
		// camera movement
		camera.update(updateCtx);
        //console.log("updating camera");
        this.updateSelectedPanels();
    }

    // EVENT CALLBACKS -----------------------------------------------------

    onNew() {
        console.log("onNewLevel");
        this.view.active = false;
        // create new controller for equip menu
        ctrlSys.assign(new UxNewLvlPopUpCtrl(), true);
    }

    onEditLevel() {
        console.log("onEditevel");
        this.view.active = false;
        // create new controller for equip menu
        ctrlSys.assign(new UxEditLvlPopUpCtrl(), true);
    }

    onHelp() {
        console.log("onHelp");
        this.view.active = false;
        // create new controller for help menu
        ctrlSys.assign(new UxHelpPopUpCtrl(), true);
    }

    onLoadLevel() {
        console.log("onLoadLevel");
        this.view.active = false;
        // create new controller for equip menu
        ctrlSys.assign(new UxLoadLvlPopUpCtrl(), true);
    }

    onFillBg() {
        console.log("onFillBg");
        if (!confirm("Fill entire background with selected BG tile?")) return;
        for (let i=0; i<currentLevel.nentries; i++) {
            currentLevel.setbgi(i, this.bgId);
        }
    }

    buildRoomArray(
    ) {
        let arr = new Array(currentLevel.nentries);
        for (const room of currentLevel.rooms) {
            for (const idx of room.idxs) {
                arr[idx] = room.roomNumber;
            }
        }
        return arr;
    }

    pprintArray(arr, width=16, indent=0, spaces=3) {
        let str = " ".repeat(indent);
        let col = 0;
        for (var v of arr) {
            if (v === null) v = 0;
            if (v === undefined) v = 0;
            let s = v.toString().padStart(spaces, " ");
            str += (s + ",");
            if (++col >= width) {
                str += "\n" + " ".repeat(indent);
                col = 0;
            }
        }
        return str;
    }

    pprintLvl() {
        let str = 
`var ${this.lvlName}Spec = {
    name: "${this.lvlName}",
    width: ${currentLevel.width},
    height: ${currentLevel.height},
    bg: [
${this.pprintArray(currentLevel.bg, currentLevel.width, 8)}
    ],
    fg: [
${this.pprintArray(currentLevel.fg, currentLevel.width, 8)}
    ],
    rooms: [
${this.pprintArray(this.rooms, currentLevel.width, 8)}
    ],
};
`
        return str;
    }

    onGenerate() {
        console.log("onGenerate");
        let view = this.view;
        let ctrl = this;
        view.active = false;
        ctrl.disable = true;
        const modal = document.getElementById('lvl-generate-modal');
        modal.classList.add('is--visible');
        const bodyBlackout = document.querySelector('.body-blackout');
        bodyBlackout.classList.add('is-blacked-out');
        const text = document.getElementById('lvl-text');
        modal.querySelector('.popup-modal__close').addEventListener('click', () => {
            modal.classList.remove('is--visible');
            bodyBlackout.classList.remove('is-blacked-out');
            view.active = true;
            ctrl.disable = false;
        });
        modal.querySelector('.popup-modal__copy').addEventListener('click', () => {
            var t = text.innerText;
            var elem = document.createElement("textarea");
            document.body.appendChild(elem);
            elem.value = t;
            elem.select();
            document.execCommand("copy");
            document.body.removeChild(elem);
            alert("copied to clipboard");
        });
        text.innerHTML = "<pre>" + this.pprintLvl() + "</pre>";
        bodyBlackout.addEventListener('click', () => {
            modal.classList.remove('is--visible')
            bodyBlackout.classList.remove('is-blacked-out')
            view.active = true;
            ctrl.disable = false;
        });
    }

    onCanvasResize(evt) {
        console.log("onCanvasResize");
        // update camera viewport based on current size of game panel
        camera.resize(this.editorPanel.width, this.editorPanel.height);
    }

    onTileSelect(evt) {
        console.log("onTileSelect: " + evt.actor.assetId);
        if (this.selectMode === "fg") {
            this.fgId = evt.actor.assetId;
        } else if (this.selectMode === "bg") {
            this.bgId = evt.actor.assetId;
        }
    }

    onRoomSelect(evt) {
        console.log("onRoomSelect: " + evt.actor.roomId);
        this.roomId = evt.actor.roomId;
    }

}

class UxLoadLvlPopUpCtrl extends UxCtrl {
    constructor(spec={}) {
        super(spec);
        // construct the UI elements
        this.view = UxView.generate({
            cls: "UxCanvas",
            cvsid: "gameCanvas",
            layer: 1,
            xchild: [
                {
                    cls: "UxPanel",
                    xxform: { border: .2},
                    xsketch: { cls: 'Rect', borderWidth: 5, borderColor: "green", color: new Color(25,25,25,1), xfitter: { cls: "FitToParent" }, },
                    xchild: [
                        {
                            cls: "UxText",
                            xxform: { top: .075, bottom: .85 },
                            xtext: { color: new Color(0,255,0,.75), text: "Choose Level", },
                        },
                        {
                            cls: "UxPanel",
                            tag: "lvlPanel",
                            xxform: { top: .2, bottom: .1 },
                        },
                        {
                            cls: "UxButton",
                            tag: "backButton",
                            xxform: { top: .9, offset: 5, left: .4, right: .4 },
                            xtext: { text: "Back", color: new Color(255,255,0,.75)},
                        },
                    ],
                },
            ],
        });

        this.lvlPanel = this.view.find((v) => v.tag === "lvlPanel");
        this.backButton = this.view.find((v) => v.tag === "backButton");
        this.backButton.evtClicked.listen(this.onBack.bind(this));

        // build out level buttons
        let row = 0;
        let col = 0;
        let maxCols = 4;
        let colStep = 1/maxCols;
        let maxRows = Math.floor(this.lvlPanel.height/40);
        let rowStep = 1/maxRows;
        for (const lvlName in allLevels) {
            let bspec = {
                cls: "UxButton",
                dfltDepth: this.lvlPanel.depth + 1,
                dfltLayer: this.lvlPanel.layer,
                parent: this.lvlPanel,
                xxform: {parent: this.lvlPanel.xform, left: col*colStep, right: 1-(col+1)*colStep, top: row*rowStep, bottom: 1-(row+1)*rowStep, offset: 5},
                xtext: {text: lvlName, color: new Color(255,255,0,.75)},
            };
            let b = UxView.generate(bspec);
            if (b) {
                b.lvlName = lvlName;
                b.evtClicked.listen(this.onLvlSelect.bind(this));
                this.lvlPanel.adopt(b);
                col++;
                if (col >= maxCols) {
                    row++;
                    col = 0;
                }
            }
        }

    }

    keyReleased(key) {
        if (key === KEY_ESCAPE) {
            this.onBack();
        }
    }

    // EVENT CALLBACKS -----------------------------------------------------
    onBack() {
        console.log("onBack");
        // restore last controller
        ctrlSys.pop();
        // tear down view
        if (this.view) this.view.destroy();
        // restore last view
        ctrlSys.current.view.active = true;
    }

    onLvlSelect(evt) {
        console.log("onLvlSelect: " + Fmt.ofmt(evt));
        if (!confirm("Loading new level will erase current level data, OK to proceed?")) return;
        // load level
        let lvl = evt.actor.lvlName;
        levelLoader.load(lvl, true)
        // reset tracker and camera
        ctrlSys.last.tracker.x = 0;
        ctrlSys.last.tracker.y = 0;
        ctrlSys.last.lvlName = evt.actor.lvlName;
        ctrlSys.last.rooms = ctrlSys.last.buildRoomArray();
        camera.reset();
        // close window
        this.onBack();
    }

}

class UxNewLvlPopUpCtrl extends UxCtrl {
    constructor(spec={}) {
        super(spec);
        // construct the UI elements
        this.view = UxView.generate({
            cls: "UxCanvas",
            cvsid: "gameCanvas",
            layer: 1,
            xchild: [
                {
                    cls: "UxPanel",
                    xxform: { border: .2},
                    xsketch: { cls: 'Rect', borderWidth: 5, borderColor: "green", color: new Color(25,25,25,1), xfitter: { cls: "FitToParent" }, },
                    xchild: [
                        {
                            cls: "UxText",
                            xxform: { top: .075, bottom: .85 },
                            xtext: { color: new Color(0,255,0,.75), text: "New Level", },
                        },
                        {
                            cls: "UxPanel",
                            xxform: { top: .2, bottom: .1 },
                            xchild: [
                                {
                                    cls: "UxText",
                                    xxform: { bottom: .8, right: .6, left: .05, otop: 20, obottom:10},
                                    xtext: { color: new Color(0,255,0,.75), text: "Name:", align: "left"},
                                },
                                {
                                    cls: "UxInput",
                                    tag: "nameInput",
                                    xtext: { text: "lvl"},
                                    xxform: { bottom: .8, left: .4, offset:10 },
                                },
                                {
                                    cls: "UxText",
                                    xxform: { top: .2, bottom: .6, right: .6, left: .05, otop: 20, obottom:10},
                                    xtext: { color: new Color(0,255,0,.75), text: "Width:", align: "left"},
                                },
                                {
                                    cls: "UxInput",
                                    tag: "widthInput",
                                    charset: '0123456789',
                                    xtext: { text: "16"},
                                    xxform: { top: .2, bottom: .6, left: .4, right: .4, offset:10 },
                                },
                                {
                                    cls: "UxText",
                                    xxform: { top: .4, bottom: .4, right: .6, left: .05, otop: 20, obottom:10},
                                    xtext: { color: new Color(0,255,0,.75), text: "Height:", align: "left"},
                                },
                                {
                                    cls: "UxInput",
                                    tag: "heightInput",
                                    charset: '0123456789',
                                    xtext: { text: "12"},
                                    xxform: { top: .4, bottom: .4, left: .4, right: .4, offset:10 },
                                },

                            ]
                        },
                        {
                            cls: "UxButton",
                            tag: "okButton",
                            xxform: { top: .9, offset: 5, left: .3, right: .55 },
                            xtext: { text: "OK", color: new Color(255,255,0,.75)},
                        },
                        {
                            cls: "UxButton",
                            tag: "backButton",
                            xxform: { top: .9, offset: 5, left: .55, right: .3 },
                            xtext: { text: "Back", color: new Color(255,255,0,.75)},
                        },

                    ],
                },
            ],
        });

        this.lvlPanel = this.view.find((v) => v.tag === "lvlPanel");
        this.backButton = this.view.find((v) => v.tag === "backButton");
        this.backButton.evtClicked.listen(this.onBack.bind(this));
        this.okButton = this.view.find((v) => v.tag === "okButton");
        this.okButton.evtClicked.listen(this.onOK.bind(this));
        this.nameInput = this.view.find((v) => v.tag === "nameInput");
        this.heightInput = this.view.find((v) => v.tag === "heightInput");
        this.widthInput = this.view.find((v) => v.tag === "widthInput");

    }

    // EVENT CALLBACKS -----------------------------------------------------
    onBack() {
        console.log("onBack");
        // restore last controller
        ctrlSys.pop();
        // tear down view
        if (this.view) this.view.destroy();
        ctrlSys.current.view.active = true;
    }

    onOK() {
        console.log("onOK");
        if (!confirm("Creating new level will erase current level data, OK to proceed?")) return;
        let width = Math.min(gMaxLvlSize, parseInt(this.widthInput.text));
        let height = Math.min(gMaxLvlSize, parseInt(this.heightInput.text));
        let spec = {
            name: this.nameInput.text,
            width: width,
            height: height,
            editor: true,
        }
        console.log("trying to gen lvl for: " + Fmt.ofmt(spec));
        let lvl = new Level(spec);
        currentLevel = lvl;
        // reset tracker and camera
        ctrlSys.last.tracker.x = 0;
        ctrlSys.last.tracker.y = 0;
        ctrlSys.last.lvlName = spec.name;
        ctrlSys.last.rooms = ctrlSys.last.buildRoomArray();
        camera.reset();
        // close window
        this.onBack();
    }

}

class UxEditLvlPopUpCtrl extends UxCtrl {
    constructor(spec={}) {
        super(spec);
        // construct the UI elements
        this.view = UxView.generate({
            cls: "UxCanvas",
            cvsid: "gameCanvas",
            layer: 1,
            xchild: [
                {
                    cls: "UxPanel",
                    xxform: { border: .2},
                    xsketch: { cls: 'Rect', borderWidth: 5, borderColor: "green", color: new Color(25,25,25,1), xfitter: { cls: "FitToParent" }, },
                    xchild: [
                        {
                            cls: "UxText",
                            xxform: { top: .075, bottom: .85 },
                            xtext: { color: new Color(0,255,0,.75), text: "Edit Level", },
                        },
                        {
                            cls: "UxPanel",
                            xxform: { top: .2, bottom: .1 },
                            xchild: [
                                {
                                    cls: "UxText",
                                    xxform: { bottom: .8, right: .6, left: .05, otop: 20, obottom:10},
                                    xtext: { color: new Color(0,255,0,.75), text: "Name:", align: "left"},
                                },
                                {
                                    cls: "UxInput",
                                    tag: "nameInput",
                                    xtext: { text: currentLevel.name},
                                    xxform: { bottom: .8, left: .4, offset:10 },
                                },
                                {
                                    cls: "UxText",
                                    xxform: { top: .2, bottom: .6, right: .6, left: .05, otop: 20, obottom:10},
                                    xtext: { color: new Color(0,255,0,.75), text: "Width:", align: "left"},
                                },
                                {
                                    cls: "UxInput",
                                    tag: "widthInput",
                                    charset: '0123456789',
                                    xtext: { text: currentLevel.width.toString()},
                                    xxform: { top: .2, bottom: .6, left: .4, right: .4, offset:10 },
                                },
                                {
                                    cls: "UxText",
                                    xxform: { top: .4, bottom: .4, right: .6, left: .05, otop: 20, obottom:10},
                                    xtext: { color: new Color(0,255,0,.75), text: "Height:", align: "left"},
                                },
                                {
                                    cls: "UxInput",
                                    tag: "heightInput",
                                    charset: '0123456789',
                                    xtext: { text: currentLevel.height.toString()},
                                    xxform: { top: .4, bottom: .4, left: .4, right: .4, offset:10 },
                                },

                            ]
                        },
                        {
                            cls: "UxButton",
                            tag: "okButton",
                            xxform: { top: .9, offset: 5, left: .3, right: .55 },
                            xtext: { text: "OK", color: new Color(255,255,0,.75)},
                        },
                        {
                            cls: "UxButton",
                            tag: "backButton",
                            xxform: { top: .9, offset: 5, left: .55, right: .3 },
                            xtext: { text: "Back", color: new Color(255,255,0,.75)},
                        },

                    ],
                },
            ],
        });

        this.lvlPanel = this.view.find((v) => v.tag === "lvlPanel");
        this.backButton = this.view.find((v) => v.tag === "backButton");
        this.backButton.evtClicked.listen(this.onBack.bind(this));
        this.okButton = this.view.find((v) => v.tag === "okButton");
        this.okButton.evtClicked.listen(this.onOK.bind(this));
        this.nameInput = this.view.find((v) => v.tag === "nameInput");
        this.heightInput = this.view.find((v) => v.tag === "heightInput");
        this.widthInput = this.view.find((v) => v.tag === "widthInput");

    }

    // EVENT CALLBACKS -----------------------------------------------------
    onBack() {
        console.log("onBack");
        // restore last controller
        ctrlSys.pop();
        // tear down view
        if (this.view) this.view.destroy();
        ctrlSys.current.view.active = true;
    }

    onOK() {
        console.log("onOK");
        if (!confirm("Creating new level will erase level data outside of new bounds, OK to proceed?")) return;
        let width = Math.min(gMaxLvlSize, parseInt(this.widthInput.text));
        let height = Math.min(gMaxLvlSize, parseInt(this.heightInput.text));
        let spec = {
            name: this.nameInput.text,
            width: width,
            height: height,
            editor: true,
        }
        console.log("trying to gen lvl for: " + Fmt.ofmt(spec));
        let lvl = new Level(spec);
        // rebuild fg/bg/room data
        let maxw = Math.min(lvl.width, currentLevel.width);
        let maxh = Math.min(lvl.height, currentLevel.height);
        for (let i=0; i<maxw; i++) {
            for (let j=0; j<maxh; j++) {
                lvl.setfg(i, j, currentLevel.getfg(i, j));
                lvl.setbg(i, j, currentLevel.getbg(i, j));
            }
        }
        let rooms = new Array(lvl.nentries);
        for (let idx=0; idx<currentLevel.nentries; idx++) {
            if (ctrlSys.last.rooms[idx]) {
                let i = currentLevel.ifromidx(idx);
                let j = currentLevel.jfromidx(idx);
                if (i < lvl.width && j < lvl.height) {
                    let nidx = lvl.idxfromij(i,j);
                    rooms[nidx] = ctrlSys.last.rooms[idx];
                }
            }
        }
        currentLevel = lvl;
        // reset tracker and camera
        ctrlSys.last.tracker.x = 0;
        ctrlSys.last.tracker.y = 0;
        ctrlSys.last.lvlName = spec.name;
        ctrlSys.last.rooms = rooms;
        camera.reset();
        // close window
        this.onBack();
    }
}

class UxHelpPopUpCtrl extends UxCtrl {
    constructor(spec={}) {
        super(spec);
        // construct the UI elements
        this.view = UxView.generate({
            cls: "UxCanvas",
            cvsid: "gameCanvas",
            layer: 1,
            xchild: [
                {
                    cls: "UxPanel",
                    xxform: { border: .2},
                    xsketch: { cls: 'Rect', borderWidth: 5, borderColor: "green", color: new Color(25,25,25,1), xfitter: { cls: "FitToParent" }, },
                    xchild: [
                        {
                            cls: "UxText",
                            xxform: { top: .075, bottom: .85 },
                            xtext: { color: new Color(0,255,0,.75), text: "Editor Help", },
                        },
                        {
                            cls: "UxPanel",
                            xxform: { top: .2, bottom: .1 },
                            xchild: [
                                {
                                    cls: "UxText",
                                    xxform: { bottom: .8, right: .7, left: .05, otop: 20, obottom:10},
                                    xtext: { color: new Color(0,255,0,.75), text: "Arrows", align: "left"},
                                },
                                {
                                    cls: "UxText",
                                    xtext: { text: "Move/Pan levels larger than screen"},
                                    xxform: { bottom: .8, left: .3, offset:10 },
                                },
                                {
                                    cls: "UxText",
                                    xxform: { top: .2, bottom: .6, right: .7, left: .05, otop: 20, obottom:10},
                                    xtext: { color: new Color(0,255,0,.75), text: "F, B, R:", align: "left"},
                                },
                                {
                                    cls: "UxText",
                                    xtext: { text: "Switch between Foreground, Background, Room editor modes"},
                                    xxform: { top: .2, bottom: .6, left: .3, offset:10 },
                                },
                                {
                                    cls: "UxText",
                                    xxform: { top: .4, bottom: .4, right: .7, left: .05, otop: 20, obottom:10},
                                    xtext: { color: new Color(0,255,0,.75), text: "Edit Existing Level", align: "left"},
                                },
                                {
                                    cls: "UxText",
                                    xtext: { text: "Press <Load> button, select level, edit, generate level data, save to game"},
                                    xxform: { top: .4, bottom: .4, left: .3, offset:10 },
                                },
                                {
                                    cls: "UxText",
                                    xxform: { top: .6, bottom: .2, right: .7, left: .05, otop: 20, obottom:10},
                                    xtext: { color: new Color(0,255,0,.75), text: "Generate level data", align: "left"},
                                },
                                {
                                    cls: "UxText",
                                    xtext: { text: "Press <Generate> button, press <#> in upper right to copy to clipboard", wrap: true, fit: false},
                                    xxform: { top: .6, bottom: .2, left: .3, offset:10 },
                                },
                                {
                                    cls: "UxText",
                                    xxform: { top: .8, bottom: 0, right: .7, left: .05, otop: 20, obottom:10},
                                    xtext: { color: new Color(0,255,0,.75), text: "Save to Game", align: "left"},
                                },
                                {
                                    cls: "UxText",
                                    xtext: { text: "Edit WorldGen.js with new/updated level data from clipboard, for new update World.js for new level definition", wrap: true, fit: false},
                                    xxform: { top: .8, bottom: 0, left: .3, offset:10 },
                                },
                            ]
                        },
                        {
                            cls: "UxButton",
                            tag: "backButton",
                            xxform: { top: .9, offset: 5, left: .45, right: .45 },
                            xtext: { text: "Back", color: new Color(255,255,0,.75)},
                        },

                    ],
                },
            ],
        });

        this.backButton = this.view.find((v) => v.tag === "backButton");
        this.backButton.evtClicked.listen(this.onBack.bind(this));

    }

    // EVENT CALLBACKS -----------------------------------------------------
    onBack() {
        console.log("onBack");
        // restore last controller
        ctrlSys.pop();
        if (this.view) this.view.destroy();
        // restore last view
        ctrlSys.current.view.active = true;
    }

}