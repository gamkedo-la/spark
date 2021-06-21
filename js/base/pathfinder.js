export { Pathfinder };

import { PriorityQueue }    from "./priq.js";
import { Fmt }              from "./fmt.js";
import { Grid } from "./grid.js";
import { LevelNode } from "../lvlGraph.js";

class Pathfinder {
    constructor(spec={}) {
        this.graph = spec.graph;
        this.heuristicFcn = spec.heuristicFcn || ((v1, v2) => v2 - v1);
        this.equalsFcn = spec.equalsFcn || ((v1, v2) => v2 === v1);
        this.dbg = spec.dbg;
        this.maxTries = spec.maxTries || 500;
        // FIXME: remove
        this.grid = new Grid({columns:20,rows:20});
    }

    find(from, to) {
        from = new LevelNode(from.x, from.y, from.layer);
        to = new LevelNode(to.x, to.y, to.layer);
        if (this.dbg) console.log("pathfinder find: from: " + from + " to: " + to);
        let cost = 0;
        if (!this.graph.contains(from) || !this.graph.contains(to)) return undefined;
        // initialize priority queue
        let queue = new PriorityQueue();
        // initialize association lists
        let cameFrom = {}; // value to value
        // add starting point to priority queue
        queue.add(0, from);
        cameFrom[from] = {cost: 0, from: false};
        let tries = 0;
        let success = false;
        // iterate through nodes in the priority queue
        while (!queue.empty) {
            // extract next item from queue
            let current = queue.extract();
            if (this.dbg) console.log(`------- current: ${this.grid.idxfromxy(current.value.x,current.value.y)} => ${current.key}:${current.value}`);
            // if equal to destination, we are done
            //console.log(`current.value: ${current.value.x},${current.value.y},${current.value.layer} to: ${to.x},${to.y},${to.layer}`);
            if (this.equalsFcn(current.value, to)) {
                success = true;
                break;
            }
            // otherwise, iterate through neighbors of current node
            let neighbors = this.graph.getNeighbors(current.value);
            //if (this.dbg) console.log(" neighbors: " + Array.from(neighbors).join(","));
            for (const neighbor of neighbors) {
                let cf = cameFrom[neighbor];
                // calculate cost to neighbor
                let pnode = this.graph.getActions(cameFrom[current.value].cost, current.value, neighbor);
                if (this.dbg) console.log(`--> consider neighbor: ${neighbor} pnode: ${Fmt.ofmt(pnode)}`);
                //let newCost = cameFrom[current.value].cost + Math.round(this.graph.getNeighborCost(current.value, neighbor));
                if (pnode && (!cf || pnode.cost < cf.cost)) {
                    // update/set came from map
                    cameFrom[neighbor] = pnode;
                    // calculate priority based on guessed heuristic
                    //console.log(`heur(${neighbor},${to}): ${this.heuristicFcn(neighbor, to)}`);
                    let priority = pnode.cost + this.heuristicFcn(neighbor, to);
                    queue.add(priority, neighbor);
                    if (this.dbg) console.log(`----> add neighbor: ${this.grid.idxfromxy(neighbor.x,neighbor.y)}:${neighbor} pri: ${priority} cf: ${Fmt.ofmt(cameFrom[neighbor])}`);
                }
            }
            if (this.dbg) console.log(`q: ${queue}`);
            // FIXME: remove
            if (tries++ > this.maxTries) {
                console.log("reached max path tries, giving up");
                break;
            }
            //break;
        }
        // check for failed path finding (no route to destination)
        if (!success) return undefined;
        // calculate cost
        cost = cameFrom[to].cost;
        // build resulting path
        let actions = [];
        let path = [to];
        for (let cf=cameFrom[to]; cf && cf.from; cf=cameFrom[cf.from]) {
            //console.log(`cf.from: ${cf.from}, action: ${cf.actions}`);
            for (let i=cf.actions.length-1; i>=0; i--) {
                actions.unshift(cf.actions[i]);
            }
            path.unshift(cf.from);
        }
        //path.unshift(from);
        if (this.dbg) console.log(`actions: ${actions}`);
        return {cost: cost, path: path, actions: actions};
    }

}