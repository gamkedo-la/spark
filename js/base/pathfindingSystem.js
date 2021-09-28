export { PathfindingSystem };

import { System }                   from "./system.js";
import { LayerGraph, LevelGraph, LevelNode }   from "../lvlGraph.js";
import { Pathfinder }               from "./pathfinder.js";
import { Vect }                     from "./vect.js";
import { Config }                   from "./config.js";
import { Fmt }                      from "./fmt.js";
import { Grid }                     from "./grid.js";
import { Util }                     from "./util.js";
import { Atts }                     from "./atts.js";

class PathfindingSystem extends System {
    // STATIC METHODS ------------------------------------------------------
    static targetEquals(v1, v2) {
        return v1.layer === v2.layer && Vect.equals(v1,v2);
    }

    // CONSTRUCTOR ---------------------------------------------------------
    cpre(spec) {
        super.cpre(spec);
        spec.iterateTTL = spec.iterateTTL || 0;
        spec.fixedPredicate = spec.fixedPredicate || ((e) => e.cat === "Model" && !e.passive);
    }
    cpost(spec) {
        super.cpost(spec);
        //this.find = spec.find || ((v) => { return [];});
        this._grid = spec.grid || ((this.getgrid) ? undefined : new Grid());
        this.getgrid = spec.getgrid || (() => this._grid);
        this.lvlGraph = new LevelGraph({
            getgrid: () => this.grid,
        });
        this.layerCost = spec.layerCost || Config.tileSize;
        Util.bind(this, "heuristic");
        this.pathfinder = new Pathfinder({
            maxTries: 800,
            graph: this.lvlGraph, 
            heuristicFcn: this.heuristic,
            equalsFcn: PathfindingSystem.targetEquals,
            //dbg: true,
        });
        Atts.pathfinder = this.pathfinder;
    }

    // PROPERTIES ----------------------------------------------------------
    get grid() {
        return this.getgrid();
    }

    // METHODS -------------------------------------------------------------
    heuristic(p1,p2) {
        let p1i = this.grid.ifromx(p1.x);
        let p1j = this.grid.jfromy(p1.y);
        let p2i = this.grid.ifromx(p2.x);
        let p2j = this.grid.jfromy(p2.y);
        let di = Math.abs(p1i - p2i);
        let dj = Math.abs(p1j - p2j);
        let dl = Math.abs(p1.layer - p2.layer);
        //console.log(`di: ${di}, dj: ${dj}, dl: ${dl}, lc: ${this.layerCost} this: ${this}`);
        return this.layerCost * dl + Config.tileSize * (di + dj) + (Config.diagSize - 2 * Config.tileSize) * Math.min(di, dj);
    }

    // METHODS -------------------------------------------------------------
    iterate(ctx, e) {
        // skip entities not looking for path
        if (!e.wantPathTo) return;
        //console.log("consider: " + e);

        // lookup path
        e.pathfinding = true;
        let src = new LevelNode(e.x, e.y, e.layer);
        //let eidx = this.grid.idxfromxy(e.x, e.y);
        //let src = new Vect(this.grid.xfromidx(eidx, true), this.grid.yfromidx(eidx, true));
        //src.layer = e.layer;
        let target = e.wantPathTo;
        //console.log(`src: ${Fmt.ofmt(src)} target: ${Fmt.ofmt(target)}`);
        //console.log(`heuristic: ${this.heuristic(src, target)}`);
        let pathinfo = this.pathfinder.find(src, target);
        //console.log("pathinfo: " + Fmt.ofmt(pathinfo));
        if (pathinfo && pathinfo.actions) {
            e.actions = pathinfo.actions;
        }
        e.wantPathTo = undefined;
        e.pathfinding = false;

    }

}