export { LevelNode, LevelGraph, LayerGraph }

import { Bounds }           from "./base/bounds.js";
import { Direction }        from "./base/dir.js";
import { Fmt }              from "./base/fmt.js";
import { Grid }             from "./base/grid.js";
import { Vect }             from "./base/vect.js";
import { DummyAction, MoveToAction }     from "./base/action.js";
import { Base }             from "./base/base.js";
import { Stairs }           from "./stairs.js";
import { Config }           from "./base/config.js";
import { Mathf }            from "./base/math.js";
import { Util } from "./base/util.js";
import { Collider } from "./base/collider.js";

class LevelNode {
    constructor(x,y,layer) {
        this.x = Mathf.floorInt(x, Config.tileSize)*Config.tileSize + Config.halfSize;
        this.y = Mathf.floorInt(y, Config.tileSize)*Config.tileSize + Config.halfSize;
        this.layer = layer;
    }
    toString() {
        return `${this.x},${this.y},${this.layer}`;
    }
    equals(other) {
        //console.log(`other: ${Fmt.ofmt(other)} other type: ${typeof(other)} equals object ${typeof(other) === "object"}}`);
        return typeof(other) === "object" && other.x === this.x && other.y === this.y && other.layer === this.layer;
    }
}

class LevelGraph {
    constructor(spec={}) {
        this._grid = spec.grid || ((this.getgrid) ? undefined : new Grid());
        this.getgrid = spec.getgrid || (() => this._grid);
    }

    get grid() {
        return this.getgrid();
    }

    contains(obj) {
        return Bounds.contains(this.grid, obj);
    }

    *getNeighbors(obj, blocking=Collider.all) {
        let gidx = this.grid.idxfromxy(obj.x, obj.y);
        // look along cardinal directions
        let blockedCardinals = 0;
        for (const dir of Direction.cardinals) {
            let nidx = this.grid.idxfromdir(gidx, dir);
            if (nidx === undefined) continue;
            // find any objects that might be blocking our path
            let blocked = false;
            let exitNode = undefined;
            let objectToBypass = undefined;
            let bounds = undefined;
            for (const other of this.grid.findgidx(nidx, (gzo) => !gzo.pathfinding && (gzo.layer === obj.layer) && gzo.collider && (gzo.collider.tag & blocking))) {
                if (this.dbg) console.log(`gidx: ${gidx} nidx: ${nidx} lvl graph check obstruction: ${other}`);
                // is a bypass action allowed?
                if (other.bypassAction) {
                    let approaches = other.approaches;
                    //console.log(`approaches: ${approaches} obj: ${obj} obj in approaches: ${Util.arrayContains(approaches, obj)}`);
                    if (!approaches || Util.arrayContains(approaches, obj)) {
                        exitNode = other.exitFor(obj);
                        objectToBypass = other;
                        continue;
                    }
                }
                // is pathing in current direction allowed?
                if (other.collider.allowPathMask&Direction.opposite(dir)) continue;
                // check for actual collision
                if (!bounds) bounds = new Bounds(this.grid.xfromidx(nidx), this.grid.yfromidx(nidx), Config.tileSize, Config.tileSize)
                let overlap = bounds.overlaps(other.collider);
                //console.log(`${Direction.toString(dir)} -- bounds: ${bounds} checking: ${other.collider} gives: ${overlap}`);
                if (!overlap) continue;
                blocked = true;
                break;
            }
            if (!blocked) {
                let neighborNode = (exitNode) ? exitNode : new LevelNode(this.grid.xfromidx(nidx, true), this.grid.yfromidx(nidx, true), obj.layer);
                if (objectToBypass) neighborNode.extraAction = objectToBypass.bypassAction();
                yield neighborNode;
            } else {
                blockedCardinals |= dir;
            }
        }

        // look along diagonal directions
        for (const dir of Direction.diagonals) {
            // for diagonal to be viable, adjacent cardinal directions must not be blocked
            if (blockedCardinals&Direction.composites[dir]) continue;
            let nidx = this.grid.idxfromdir(gidx, dir);
            if (nidx === undefined) continue;
            // find any objects that might be blocking our path
            let blocked = false;
            let bounds = undefined;
            for (const other of this.grid.findgidx(nidx, (gzo) => !gzo.pathfinding && (gzo.layer === obj.layer) && gzo.collider && (gzo.collider.tag & blocking))) {
                // is a bypass action allowed?
                if (other.bypassAction) continue;
                // is pathing in current direction allowed?
                if (other.collider.allowPathMask&Direction.opposite(dir)) continue;
                // check for actual collision
                if (!bounds) bounds = new Bounds(this.grid.xfromidx(nidx), this.grid.yfromidx(nidx), Config.tileSize, Config.tileSize)
                let overlap = bounds.overlaps(other.collider);
                //console.log(`${Direction.toString(dir)} -- bounds: ${bounds} checking: ${other.collider} gives: ${overlap}`);
                if (!overlap) continue;
                blocked = true;
                break;
            }
            if (!blocked) yield new LevelNode(this.grid.xfromidx(nidx, true), this.grid.yfromidx(nidx, true), obj.layer);
        }

        // look for stairs
        for (const stairs of this.grid.findgidx(gidx, (gzo) => ((gzo.layer === obj.layer) && (gzo instanceof Stairs)))) {
            yield new LevelNode(this.grid.xfromidx(gidx, true), this.grid.yfromidx(gidx, true), stairs.otherLayer);
        }
    }

    getActions(baseCost, from, to) {
        let actions = [];
        let cost = baseCost;
        // handle layer transitions
        if (from.layer !== to.layer) {
            // push move action
            actions.push(new DummyAction({info: `layer transition ${from.layer}->${to.layer}`}));
        } else {
            cost += Math.round(Vect.dist(from, to)); 
            // anything at target to?
            /*
            let gidx = this.grid.idxfromxy(to.x, to.y);
            for (const obj of this.grid.findgidx(gidx, (gzo) => !gzo.pathfinding && gzo.collider && gzo.collider.blocking && gzo.bypassAction)) {
                actions.push(obj.bypassAction());
            }
            */
           if (to.extraAction) actions.push(to.extraAction);
            // push move action
            actions.push(new MoveToAction({x:to.x, y:to.y}));
        }
        return { 
            from: from, 
            cost: cost,
            actions: actions,
        };
    }
}

class LayerGraph {
    constructor(spec={}) {
        this.findFcn = spec.findFcn || Base.find;
        this.pathfinder = spec.pathfinder || new Pathfinder({
            maxTries: 100,
            graph: new LevelGraph({getGrid: () => Base.instance.state.grid}),
            heuristicFcn: Base.instance.state.grid.heuristic,
            equalsFcn: (v1, v2) => Vect.equals(v1,v2) && v1.layer === v2.layer,
            dbg: true,
        });
        this.layerGraph = {};
        this.buildNet();
    }

    buildNet() {
        // iterate through elements in grid
        for (const obj of this.findFcn((v) => v instanceof(Stairs))) {
            if (!this.layerGraph[obj.layer]) {
                this.layerGraph[obj.layer] = [];
            }
            this.layerGraph[obj.layer].push(obj);
        }
    }

    contains(obj) {
        return obj.layer in this.layerGraph;
    }

    *getNeighbors(obj) {
        for (const neighbor of this.layerGraph[obj.layer] || []) {
            let v = new Vect(neighbor.x, neighbor.y);
            v.layer = neighbor.newLayer;
            yield v;
        }
    }

    getActions(baseCost, from, to) {
        // find path
        let pathInfo = this.pathfinder.find(from, to);
        let actions = pathinfo.actions;
        // handle failed path
        if (!actions.length) return undefined;
        // return set of actions from pathing
        return {
            from: from,
            cost: baseCost + pathInfo.cost,
            actions: actions,
        };
    }

}
