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
        columns: 128,
        rows: 128,
        xregions: [
            WorldGen.lvl00,
            WorldGen.lvl10,
            WorldGen.lvl20,
            WorldGen.lvl30,
            WorldGen.lvl40,
            WorldGen.lvl50,
            /*
            WorldGen.lvl60,
            WorldGen.lvl70,
            */

            WorldGen.lvl01,
            WorldGen.lvl11,
            WorldGen.lvl21,
            WorldGen.lvl31,
            WorldGen.lvl41,
            WorldGen.lvl51,
            /*
            WorldGen.lvl61,
            WorldGen.lvl71,
            */

            WorldGen.lvl02,
            WorldGen.lvl12,
            WorldGen.lvl22,
            WorldGen.lvl32,
            WorldGen.lvl42,
            /*
            WorldGen.lvl52,
            WorldGen.lvl62,
            WorldGen.lvl72,
            */

            /*
            WorldGen.lvl03,
            WorldGen.lvl13,
            WorldGen.lvl23,
            WorldGen.lvl33,
            WorldGen.lvl43,
            WorldGen.lvl53,
            WorldGen.lvl63,
            WorldGen.lvl73,

            WorldGen.lvl04,
            WorldGen.lvl14,
            WorldGen.lvl24,
            WorldGen.lvl34,
            WorldGen.lvl44,
            WorldGen.lvl54,
            WorldGen.lvl64,
            WorldGen.lvl74,

            WorldGen.lvl05,
            WorldGen.lvl15,
            WorldGen.lvl25,
            WorldGen.lvl35,
            WorldGen.lvl45,
            WorldGen.lvl55,
            WorldGen.lvl65,
            WorldGen.lvl75,

            WorldGen.lvl06,
            WorldGen.lvl16,
            WorldGen.lvl26,
            WorldGen.lvl36,
            WorldGen.lvl46,
            WorldGen.lvl56,
            WorldGen.lvl66,
            WorldGen.lvl76,

            WorldGen.lvl07,
            WorldGen.lvl17,
            WorldGen.lvl27,
            WorldGen.lvl37,
            WorldGen.lvl47,
            WorldGen.lvl57,
            WorldGen.lvl67,
            WorldGen.lvl77,
            */

            //this.genRegion({columns: 128, rows: 128, xlayers: [{ id: '002j' }]}),
            //WorldGen.patch1,
            //WorldGen.house1,
            WorldGen.house2,
            WorldGen.work2,
            WorldGen.fountain,
            WorldGen.vendor1,
            WorldGen.vendorHouse,
            {
                columns: 8,
                rows: 7,
                offx: 60,
                offy: 15,
                layers: {
                    l1: {
                        fg: [   
                            "0o00","0000","000s","0000","000q","0000","000s","0000",
                            "000s","0000","0000","0000","0000","0000","0000","000s",
                            "000s","000s","0000","000r","0000","000v","0000","0000",
                            "0000","0000","0000","000o","000s","0000","0000","0o05",
                            "0000","0o06","0000","0000","0o0f","0000","0000","0000",
                            "0000","0000","0000","0000","0000","0000","0000","0000",
                            "0000","0000","0000","0000","0000","0000","0000","0000",
                        ],
                    },
                },
            },

        ],
    };
}