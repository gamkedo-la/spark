export { Level };

import { Base }             from "./base/base.js";
import { Model }            from "./base/model.js";
import { Grid }             from "./base/grid.js";
import { Region }           from "./region.js";
import { Config }           from "./base/config.js";
import { Fmt }              from "./base/fmt.js";

/**
 * A level represents the entire dynamic model state for the game.
 */
class Level extends Model {
    cpost(spec) {
        this.name = spec.name || "lvl";
        this.rows = spec.rows || 12;
        this.columns = spec.columns || 16;
        this.nentries = this.rows * this.columns;
        this.layerMap = spec.layerMap || Config.layerMap;
        this.depthMap = spec.depthMap || Config.depthMap;
        this.assets = spec.assets || Base.instance.assets;
        this.generator = spec.generator || Base.instance.generator;
        this.xregions = spec.xregions || [];
        console.log(`level rows ${this.rows} columns: ${this.columns} nenties ${this.nentries}`);

        // grid maintains list of all interactable objects based on location
        // -- an object may be assigned more than one grid slot if it overlaps multiple grid locations
        // -- because of this, the grid is not enumerable
        this.grid = new Grid(spec);
        this.tileSize = spec.tileSize || Config.tileSize;
        this.halfSize = Math.round(this.tileSize * .5);
        this.width = this._maxx = this.tileSize * this.columns;
        this.height = this._maxy = this.tileSize * this.rows;
        this.dbg = spec.dbg;
    }

    // PROPERTIES ----------------------------------------------------------
    get minx() { return 0 };
    get maxx() { return this._maxx };
    get miny() { return 0 };
    get maxy() { return this._maxy };

    // METHODS -------------------------------------------------------------
    add(obj) {
        // handle grid assignment...
        this.grid.add(obj);
    }

    load() {
        // load level areas
        for (const xregion of this.xregions) {
            let region = new Region(Object.assign({
                assets: this.assets, 
                generator: this.generator,
                layerMap: this.layerMap,
                depthMap: this.depthMap,
                tileSize: this.tileSize,
            }, xregion));
            //for (const gzo of region.areas) this.add(gzo);
            //for (const gzo of region.objs) this.add(gzo);
        }
    }

    remove(obj) {
        // remove grid assignment
        this.grid.remove(obj);
    }

    update(ctx) {
        //console.log("lvl updated");
        return super.update(ctx);
    }

}