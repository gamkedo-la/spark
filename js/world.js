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

    static xxlvl = {
        cls: "Level",
        columns: 32,
        rows: 24,
        xregions: [
            {
                columns: 4,
                rows: 5,
                layers: {

                    l1: {
                        bb: [   
                            "0000","0000","0000","0000",
                            "0000","002j","0000","0000",
                            "0000","0000","0000","0000",
                            "0000","0000","0000","0000",
                        ],
                        /*
                            "002j","002j","002j","002j",
                            "002j","002j","002j","002j",
                            "002j","002j","002j","002j",
                            "002j","002j","002j","002j",
                            "002j","002j","002j","002j",
                        ],
                        fm: [   
                            "0000","0000","0000","0000",
                            "0000","0000","0000","0000",
                            "0000","0000","0000","0000",
                            "0000","000j","0c01","0000",
                            "0000","0000","0000","0000",
                        ],
                        */
                    },

                    l2: {
                        /*
                        fg: [   
                            "0000","0000","0000","0000",
                            "0000","0000","0000","0000",
                            "000b","0000","000b","0000",
                            "0000","0000","0000","0000",
                        ],
                        fo: [   
                            "0000","0000","0000","0000",
                            "0000","0004","0004","0004",
                            "0000","0004","0004","0004",
                            "0000","0000","0000","0000",
                        ],
                        */
                    },

                },
            },
        ],
    };

    static xlvl = {
        cls: "Level",
        columns: 64,
        rows: 48,
        xregions: [
            this.genRegion({columns: 64, rows: 48, xlayers: [{ id: '002j' }]}),
            WorldGen.patch1,
            WorldGen.house1,
            WorldGen.vendor1,
            {
                columns: 8,
                rows: 4,
                offx: 6,
                offy: 6,
                layers: {
                    l1: {
                        fg: [   
                            "0o00","0000","000s","0000","000q","0000","000s","0000",
                            "000s","0000","0000","0000","0000","0000","0000","000s",
                            "000s","000s","0c02","000r","0000","000u","0000","0000",
                            "0c01","0000","0000","000o","000s","0000","0000","0o05",
                        ],
                    },
                },
            },

        ],
    };
}