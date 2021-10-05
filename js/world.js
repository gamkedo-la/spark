export { World };

import { Bounds } from "./base/bounds.js";
import { Fmt } from "./base/fmt.js";
import { WorldGen } from "./worldGen.js";

class World {

    static genData(columns, rows, id) {
        let n = columns*rows;
        let a = new Array(n);
        for (let i=0; i<n; i++) {
            //if (i%columns === 6) a[i] = id;
            a[i] = id;
        }
        return a;
    }

    static genRegion(spec={}) {
        let xregion = {
            tag: spec.tag || "tag",
            columns: spec.columns || 0,
            rows: spec.rows || 0,
            offx: spec.offx || 0,
            offy: spec.offy || 0,
            layers: {},
        };
        for (const xlayer of spec.xlayers) {
            let layerTag = xlayer.tag || "l1";
            let lspec = {};
            let depthTag = xlayer.depthTag || "bg";
            let id = xlayer.id;
            if (id) {
                lspec[depthTag] = this.genData(spec.columns, spec.rows, id);
            }
            xregion.layers[layerTag] = lspec;

        }
        return xregion;
    }

    static xlvl = {
        cls: "Level",
        columns: 64,
        rows: 64,
        xregions: [
            // row 1
            WorldGen.lvl00,
            WorldGen.lvl10,
            WorldGen.lvl20,
            WorldGen.lvl30,

            // row 2
            WorldGen.lvl01,
            WorldGen.lvl11,
            WorldGen.lvl21,
            WorldGen.lvl31,

            // row 3
            WorldGen.lvl02,
            WorldGen.lvl12,
            WorldGen.lvl22,
            WorldGen.lvl32,

            // row 4
            WorldGen.lvl03,
            WorldGen.lvl13,
            WorldGen.lvl23,
            WorldGen.lvl33,

            //this.genRegion({columns: 128, rows: 128, xlayers: [{ id: '002j' }]}),
            //WorldGen.patch1,
            //WorldGen.house1,
            //WorldGen.house2,
            //WorldGen.work2,
            WorldGen.fountain,
            WorldGen.vendor1,
            WorldGen.vendorHouse,
            WorldGen.inn,
            WorldGen.tower,
            WorldGen.gardenHouse,
            WorldGen.tinkerHouse,
            WorldGen.pier,
            /*
            {
                columns: 8,
                rows: 7,
                offx: 15,
                offy: 25,
                layers: {
                    l1: {
                        fg: [   
                            "0000","0000","000s","0000","000q","0000","000s","0000",
                            "000s","0000","0000","0000","0000","0000","0000","000s",
                            "000s","000s","0000","000r","0000","000v","0000","0000",
                            "0000","0000","0000","000o","000s","0000","0000","0o05",
                            "0000","0o06","0000","0000","0000","0000","0000","0000",
                            "0000","0000","0000","0000","0000","0000","0000","0000",
                            "0000","0000","0000","0000","0000","0000","0000","0000",
                        ],
                    },
                },
            },
            */

        ],
    };
}