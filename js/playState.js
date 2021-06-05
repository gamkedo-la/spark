export { PlayState };

import { State }            from "./base/state.js";
import { Character }        from "./character.js";
import { Base }             from "./base/base.js";
//import { Hierarchy }        from "./base/hierarchy.js";
//import { Tile }   from "./tile.js";
import { LevelCtrl }        from "./lvl.js";
import { Keys } from "./base/keys.js";
import { Util } from "./base/util.js";
import { Fmt } from "./base/fmt.js";
import { Config } from "./base/config.js";
import { Generator } from "./base/generator.js";
import { SketchView } from "./sketchView.js";
import { LevelGraph, LevelNode } from "./lvlGraph.js";
import { Pathfinder } from "./base/pathfinder.js";
import { Vect } from "./base/vect.js";
import { Mouse } from "./base/mouse.js";
import { UxView } from "./base/uxView.js";
import { Text } from "./base/text.js";
import { World } from "./world.js";
import { Bounds } from "./base/bounds.js";

class GridView extends UxView {
    cpost(spec={}) {
        super.cpost(spec);
        this.grid = spec.grid;
        // FIXME
        this.player = spec.player;
        this.other = spec.other;
        this.indices = [];
    }

    renderGrid(ctx) {
        ctx.strokeStyle = "rgba(255,255,0,.25";
        ctx.lineWidth = 3;
        // vertical
        for (let i=0; i<=this.grid.width; i++) {
            ctx.beginPath()
            ctx.moveTo(i*this.grid.tileSize,0);
            ctx.lineTo(i*this.grid.tileSize,this.grid.maxy);
            ctx.stroke();
        }
        // horizontal
        for (let i=0; i<=this.grid.height; i++) {
            ctx.beginPath()
            ctx.moveTo(0,i*this.grid.tileSize);
            ctx.lineTo(this.grid.maxx,i*this.grid.tileSize);
            ctx.stroke();
        }

    }

    renderIndices(ctx) {
        for (let i=0; i<this.grid.nentries; i++) {
            let x = this.grid.xfromidx(i);
            let y = this.grid.yfromidx(i);
            let text = new Text({text:i.toString(), width: 28, height: 28, align: "center", valign: "middle", color: "rgba(255,255,0,.25"});
            text.render(ctx, x+1, y+3);
        }
    }

    _render(ctx) {
        if (!this.grid) return;
        if (!Config.dbgViewGrid) return;
        // grid
        this.renderGrid(ctx);
        //this.renderFIXME(ctx);
        //this.renderIndices(ctx);
    }
}

class PlayState extends State {
    cpre(spec) {
        super.cpre(spec);
        const media = spec.media || Base.instance.media;
        // construct the UI elements
        spec.xview = {
            cls: "UxCanvas",
            cvsid: "canvas",
            tag: "cvs.0",
            depth: 10,
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
    }

    cpost(spec) {
        super.cpost(spec);
        let xlvl = World.xlvl;
        this.ctrl = new LevelCtrl({
            xmodel: xlvl,
        });
        this.grid = this.ctrl.model.grid;
        this.lvlGraph = new LevelGraph({grid: this.grid});
        this.pathfinder = new Pathfinder({
            maxTries: 100,
            graph: this.lvlGraph, 
            heuristicFcn: this.grid.heuristic,
            equalsFcn: Vect.equals,
            dbg: true,
        });
        Util.bind(this, "onKeyDown", "onClicked");
        Keys.evtKeyPressed.listen(this.onKeyDown);
        Mouse.evtClicked.listen(this.onClicked)
        let vs = this.find(v=>v.tag === "player");
        for (const v of vs) this.player = v;
        vs = this.find(v=>v.gid === 14);
        for (const v of vs) this.other = v;
        console.log("this.player: " + this.player);
        console.log("this.other: " + this.other);
        let gridView = new GridView({depth: 99, grid: this.grid, player: this.player, other:this.other});

    }

    testRender(ctx) {
        if (!this.hasOwnProperty("testTTL")) {
            this.testTTL = 1000;
            this.testFPS = 0;
            /*
            let xobj = Base.instance.assets.fromId(22);
            xobj = Object.assign({x: 64, y: 64, depth: 1}, xobj);
            this.testtile = Generator.generate(xobj);
            let xview = {
                cls: "SketchView",
                depth: this.testtile.depth,
                xsketch: this.testtile.xsketch,
                getx: () => this.testtile.x,
                gety: () => this.testtile.y,
                collider: this.testtile.collider,
            };
            this.testview = new SketchView(xview);
            this.testimg = this.testview.sketch.img;
            this.testiters = 5;
            this.testlast = new Date();
            this.testraw = false;
            this.testmin = 1000;
            this.testmax = 0;
            */
        }
        this.testTTL -= ctx.deltaTime;
        this.testFPS += 1;
        if (ctx.deltaTime > this.testmax) this.testmax = ctx.deltaTime;
        if (ctx.deltaTime < this.testmin) this.testmin = ctx.deltaTime;
        if (this.testTTL <= 0) {
            let now = new Date();
            let elapsed = now-this.testlast;
            this.testlast = now;
            console.log(`fps: ${this.testFPS} draws: ${this.testiters} elapsed: ${elapsed} raw: ${this.testraw} min: ${this.testmin} max: ${this.testmax}`);
            this.testTTL = 1000;
            this.testFPS = 0;
            this.testmin = 1000;
            this.testmax = 0;
        }
        /*
        for (let i=0; i<this.testiters; i++) {
            if (this.testraw) {
                this.viewMgr.renderCtx.drawImage(this.testimg, 64, 128);
            } else {
                this.testview.render(this.viewMgr.renderCtx);
            }
        }
        */
    }

    onKeyDown(evt) {
        //console.log("onKeyDown: " + Fmt.ofmt(evt));
        if (evt.key === "2") Config.dbgViewColliders = !Config.dbgViewColliders;
        if (evt.key === "3") Config.dbgViewAreas = !Config.dbgViewAreas;
        if (evt.key === "4") Config.dbgViewGrid = !Config.dbgViewGrid;
        if (evt.key === "+") this.testiters += 100;
        if (evt.key === "-") this.testiters -= 100;
        if (evt.key === "#") this.testraw = !this.testraw;
        if (evt.key === "*") console.log(`player: ${this.player.miny},${this.player.maxy}`);
    }

    onClicked(evt) {
        console.log("onClicked: " + Fmt.ofmt(evt));
        let idx = this.grid.idxfromxy(evt.x, evt.y);
        console.log("idx is: " + idx);
        let target = new LevelNode(evt.x, evt.y, 0);
        //let target = new Vect(this.grid.xfromidx(idx, true), this.grid.yfromidx(idx, true));
        //target.layer = 0;
        //let pidx = this.grid.idxfromxy(this.player.x, this.player.y);
        //let src = new LevelNode(this.player.x, this.player.y, this.player.layer);
        //Vect(this.grid.xfromidx(pidx, true), this.grid.yfromidx(pidx, true));
        //src.layer = this.player.layer;
        //console.log(`current pos: ${this.player.x},${this.player.y}`);
        console.log("target: " + target);
        this.player.wantPathTo = target;
        /*
        this.player.pathfinding = true;
        let pathinfo = this.pathfinder.find(src, target);
        this.player.pathfinding = false;
        console.log("path: " + Fmt.ofmt(pathinfo));
        let path = pathinfo.path;
        path.shift();
        //if (path.length) this.player.path = path;
        if (pathinfo.actions) this.player.actions = pathinfo.actions;
        */
    }

    *findOverlaps(bounds, filter=(v) => true) {
        yield *this.grid.findOverlaps(bounds, filter);
    }

    update(ctx) {
        super.update(ctx);
        //this.testRender(ctx);
    }

}
