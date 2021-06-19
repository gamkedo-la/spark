export { Grid };

import { Config }           from "./config.js";
import { Util }             from "./util.js";
import { Fmt }              from "./fmt.js";
import { Direction }        from "./dir.js";

/** ========================================================================
 * A grid-based object (gizmo) storage bucket which allows for quick lookups of game elements based on location.
 */

class Grid {
    static dfltSize = 32;

    constructor(spec={}) {
        this.width = spec.width || Grid.dfltSize;
        this.height = spec.height || Grid.dfltSize;
        this.nentries = this.width * this.height;
        this.grid = new Array(this.nentries);
        this.tileSize = spec.tileSize || Config.tileSize;
        this.halfSize = this.tileSize * .5;
        this.diagSize = this.tileSize * Math.SQRT2;
        // -- events/handlers
        Util.bind(this, "onGizmoUpdate", "onGizmoDestroy", "heuristic");
        this._maxx = this.tileSize * this.width;
        this._maxy = this.tileSize * this.height;
        this.dbg = spec.dbg;
        //console.log("grid w/ spec: " + Fmt.ofmt(spec));
    }

    get minx() { return 0 };
    get maxx() { return this._maxx };
    get miny() { return 0 };
    get maxy() { return this._maxy };

    // STATIC METHODS ------------------------------------------------------
    static ifromidx(idx, width, nentries=undefined) {
        if (idx < 0) idx = 0;
        if (nentries && idx >= nentries) idx = nentries-1;
        return idx % width;
    }
    static jfromidx(idx, width, nentries=undefined) {
        if (idx < 0) idx = 0;
        if (nentries && idx >= nentries) idx = nentries-1;
        return Math.floor(idx/width);
    }
    static ifromx(x, tileSize, width=undefined) {
        let i = Math.floor(x/tileSize);
        if (i < 0) i = 0;
        if (width && i >= width) i = width-1;
        return i;
    }
    static jfromy(y, tileSize, height=undefined) {
        let j = Math.floor(y/tileSize);
        if (j < 0) j = 0;
        if (height && j >= height) j = height-1;
        return j;
    }

    static xfromidx(idx, width, tileWidth, center=false) {
        return (((idx % width) * tileWidth) + ((center) ? tileWidth*.5 : 0));
    }
    static yfromidx(idx, width, tileHeight, center=false) {
        return ((Math.floor(idx/width) * tileHeight) + ((center) ? tileHeight*.5 : 0));
    }

    static idxfromij(i, j, width, height) {
        if (i >= width) i = width-1;
        if (j >= height) j = height-1;
        return i + width*j;
    }

    // EVENT HANDLERS ------------------------------------------------------
    onGizmoUpdate(evt) {
        let gzo = evt.actor;
        if (!gzo) return;
        let gidx = this.getgidx(gzo);
        if (!gidx.equals(gzo.gidx)) {
            if (this.dbg) console.log(`----- Grid.onGizmoUpdate: ${evt.actor} old ${gzo.gidx} new ${gidx}`);
            // remove old
            if (gzo.gidx) {
                for (const idx of gzo.gidx) {
                    let entries = this.grid[idx] || [];
                    let i = entries.indexOf(gzo);
                    if (i >= 0) entries.splice(i, 1);
                }
            }
            // add new
            for (const idx of gidx) {
                if (!this.grid[idx]) this.grid[idx] = [];
                this.grid[idx].push(gzo);
            }
            // assign new gidx
            gzo.gidx = gidx;
        }
    }

    onGizmoDestroy(evt) {
        console.log("onGizmoDestroy");
        let gzo = evt.actor;
        if (!gzo) return;
        this.remove(gzo);
    }

    ifromidx(idx) {
        if (idx < 0) idx = 0;
        if (idx >= this.nentries) idx = this.nentries-1;
        return idx % this.width;
    }
    jfromidx(idx) {
        if (idx < 0) idx = 0;
        if (idx >= this.nentries) idx = this.nentries-1;
        return Math.floor(idx/this.width);
    }
    ifromx(x) {
        let i = Math.floor(x/this.tileSize);
        if (i < 0) i = 0;
        if (i >= this.width) i = this.width-1;
        return i;
    }
    jfromy(y) {
        let j = Math.floor(y/this.tileSize);
        if (j < 0) j = 0;
        if (j >= this.height) j = this.height-1;
        return j;
    }

    heuristic(p1,p2) {
        let p1i = this.ifromx(p1.x);
        let p1j = this.jfromy(p1.y);
        let p2i = this.ifromx(p2.x);
        let p2j = this.jfromy(p2.y);
        let di = Math.abs(p1i - p2i);
        let dj = Math.abs(p1j - p2j);
        return this.tileSize * (di + dj) + (this.diagSize - 2 * this.tileSize) * Math.min(di, dj);
    }

    idxfromxy(x,y) {
        let i = Math.floor(x/this.tileSize);
        let j = Math.floor(y/this.tileSize);
        if (i < 0) i = 0;
        if (j < 0) j = 0;
        if (i >= this.width) i = this.width-1;
        if (j >= this.height) j = this.height-1;
        return i + this.width*j;
    }

    xfromidx(idx, center=false) {
        return (((idx % this.width) * this.tileSize) + ((center) ? this.halfSize : 0));
    }
    yfromidx(idx, center=false) {
        return ((Math.floor(idx/this.width) * this.tileSize) + ((center) ? this.halfSize : 0));
    }

    idxfromij(i,j) {
        if (i >= this.width) i = this.width-1;
        if (j >= this.height) j = this.height-1;
        return i + this.width*j;
    }

    idxfromdir(idx, dir) {
        switch (dir) {
            case Direction.north:
                return (idx > this.width) ? idx-this.width : undefined;
            case Direction.northEast:
                return ((idx > this.width) && (idx%this.width < this.width)) ? idx-this.width+1 : undefined;
            case Direction.east:
                return (idx%this.width < this.width) ? idx+1 : undefined;
            case Direction.southEast:
                return ((idx%this.width < this.width) && (idx < this.nentries-this.width)) ? idx+this.width+1 : undefined;
            case Direction.south:
                return (idx < this.nentries-this.width) ? idx+this.width : undefined;
            case Direction.southWest:
                return ((idx < this.nentries-this.width) && (idx%this.width > 0)) ? idx+this.width-1 : undefined;
            case Direction.west:
                return (idx%this.width > 0) ? idx-1 : undefined;
            case Direction.northWest:
                return ((idx%this.width > 0) && (idx > this.width)) ? idx-this.width-1 : undefined;
        }
    }


    getgidx(gzo) {
        let minx = 0, miny = 0, maxx = 0, maxy = 0;
        let gidx = new GridIdx();
        // if object has dimensions...
        if (gzo.minx !== undefined && gzo.miny !== undefined && gzo.maxx !== undefined && gzo.maxy !== undefined) {
            minx = gzo.minx;
            miny = gzo.miny;
            maxx = Math.max(gzo.minx,gzo.maxx-1);
            maxy = Math.max(gzo.miny,gzo.maxy-1);
        // if object only has position...
        } else if (gzo.x !== undefined && gzo.y !== undefined) {
            minx = gzo.x;
            miny = gzo.y;
            maxx = gzo.x;
            maxy = gzo.y;
        // object doesn't have dimensions or position, so cannot be tracked in grid...
        } else {
            return gidx;
        }
        let maxi = this.ifromx(maxx);
        let maxj = this.jfromy(maxy);
        for (let i=this.ifromx(minx); i<=maxi; i++) {
            for (let j=this.jfromy(miny); j<=maxj; j++) {
                // compute grid index
                let idx = this.idxfromij(i,j);
                // track object gidx
                gidx.add(idx);
            }
        }
        return gidx;
    }

    add(gzo) {
        let gidx = this.getgidx(gzo);
        // assign object to grid
        for (const idx of gidx) {
            if (!this.grid[idx]) this.grid[idx] = [];
            this.grid[idx].push(gzo);
        }
        // assign gizmo gidx
        gzo.gidx = gidx;
        if (this.dbg) console.log(`grid add ${gzo} w/ idx: ${gzo.gidx}`);
        // handle gizmo updates
        gzo.evtUpdated.listen(this.onGizmoUpdate);
    }

    *[Symbol.iterator]() {
        for (let i=0; i<this.nentries; i++) {
            if (this.grid[i]) {
                yield *this.grid[i];
            }
        }
    }

    *findgidx(gidx, filter=(v) => true) {
        if (!Util.iterable(gidx)) gidx = [gidx];
        let found = new Set();
        for (const idx of gidx) {
            let entries = this.grid[idx] || [];
            if (entries) {
                for (const gzo of entries) {
                    if (found.has(gzo.gid)) continue;
                    if (filter(gzo)) {
                        found.add(gzo.gid);
                        yield gzo;
                    }
                }
            }
        }
    }

    *findContains(x, y, filter=(v) => true) {
        let gidx = this.getgidx({x: x, y: y});
        yield *this.findgidx(gidx, filter);
    }

    *findOverlaps(bounds, filter=(v) => true) {
        let gidx = this.getgidx(bounds);
        yield *this.findgidx(gidx, filter);
    }

    remove(gzo) {
        if (gzo && gzo.gidx) {
            for (const idx of gzo.gidx) {
                let entries = this.grid[idx] || [];
                let i = entries.indexOf(gzo);
                if (i >= 0) entries.splice(i, 1);
            }
            // clear gizmo listens
            gzo.evtUpdated.ignore(this.onGizmoUpdate);
        }
    }

    toString() {
        return Fmt.toString(this.constructor.name, this.width, this.height);
    }

}

/** ========================================================================
 * A grid-based object (gizmo) storage bucket which allows for quick lookups of game elements based on location.
 */
class GridIdx {
    constructor(values) {
        this.values = (values) ? Array.from(values) : new Array();
    }
    add(gidx) {
        this.values.push(gidx);
    }
    equals(other) {
        if (!other) return false;
        if (other.values.length !== this.values.length) return false;
        for (let i=0; i<this.values.length; i++) {
            if (this.values[i] !== other.values[i]) return false;
        }
        return true;
    }
    *[Symbol.iterator]() {
        yield *this.values;
    }
    toString() {
        return Fmt.toString(this.constructor.name, this.values);
    }
}