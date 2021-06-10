export { World };

import { Bounds } from "./base/bounds.js";
import { Fmt } from "./base/fmt.js";

class World {

    static genData(width, height, id) {
        let n = width*height;
        let a = new Array(n);
        for (let i=0; i<n; i++) a[i] = id;
        return a;
    }

    static genRegion(spec={}) {
        let xregion = {
            tag: spec.tag || "tag",
            width: spec.width || 0,
            height: spec.height || 0,
            offx: spec.offx || 0,
            offy: spec.offy || 0,
            layers: {},
        };
        for (const xlayer of spec.xlayers) {
            let layerTag = xlayer.tag || "main";
            let lspec = {};
            let depthTag = xlayer.depthTag || "bg";
            let id = xlayer.id;
            if (id) {
                lspec[depthTag] = this.genData(spec.width, spec.height, id);
            }
            xregion.layers[layerTag] = lspec;

        }
        return xregion;
    }

    static house1 = {
        tag: "house1",
        width: 8,
        height: 12,
        offx: 12,
        offy: 8,
        autoArea: true,
        layers: {
            main: {
                bg: [
                        "0000","0000","0000","0000","0000","0000","0000","0000",
                        "0000","0000","0000","0000","0000","0000","0000","0000",
                        "0004","0004","0004","0004","0004","0004","0004","0004",
                        "0004","0004","0004","0004","0004","0004","0004","0004",
                        "0004","0004","0004","0004","0004","0004","0004","0004",
                        "0004","0004","0004","0004","0004","0004","0004","0004",
                        "0004","0004","0004","0004","0004","0004","0004","0004",
                        "0004","0004","0004","0004","0004","0004","0004","0004",
                        "0004","0004","0004","0004","0004","0004","0004","0004",
                        "0004","0004","0004","0004","0004","0004","0004","0004",
                        "0004","0004","0004","0004","0004","0004","0004","0004",
                        "0004","0004","0004","0004","0004","0004","0004","0004",
                ],

                fg: [   
                        "0000","0000","0000","0000","0000","0000","0000","0000",
                        "0000","0000","0000","0000","0000","0000","0000","0000",
                        "005a","005b","005b","005b","005b","005b","005b","005c",
                        "005d","005e","005e","005e","005e","005e","005e","005f",
                        "005g","005h","005h","005h","005h","005h","005h","005i",
                        "005t","0000","0000","0000","0000","0000","0000","005t",
                        "005t","0000","0000","0000","0000","0000","0000","005t",
                        "005t","0000","0000","0000","0000","0000","0000","005t",
                        "005t","0000","0000","0000","0000","0000","0000","005t",
                        "005k","005b","0000","0000","0000","0000","005b","005j",
                        "005n","005e","0000","0000","0000","0000","005e","005m",
                        "005r","005h","0o01","0000","0000","0000","005h","005q",
                ],

                /*
                fo: [   
                        "0000","0000","0000","0000",
                        "0000","0000","0000","0000",
                        "0000","0000","0000","0000",
                        "0000","0000","0000","0000",
                        "0000","0024","0024","0000",
                        "0000","0000","0000","0000", 
                ],
                */
            },

            upper2: {
                fg: [
                        "0000","0000","0000","0r01","0r03","0000","0000","0000",
                        "0000","0000","0r04","0r05","0r07","0r08","0000","0000",
                        "0000","0r01","0r05","0r10","0r12","0r07","0r03","0000",
                        "0r04","0r05","0r10","0r10","0r12","0r12","0r07","0r08",
                        "0r09","0r10","0r10","0r10","0r12","0r12","0r12","0r13",
                        "0r09","0r10","0r10","0r10","0r12","0r12","0r12","0r13",
                        "0r09","0r10","0r10","0r10","0r12","0r12","0r12","0r13",
                        "0r09","0r10","0r10","0r10","0r12","0r12","0r12","0r13",
                        "0000","0000","0000","0000","0000","0000","0000","0000",
                        "0000","0000","0000","0000","0000","0000","0000","0000",
                ],
            },

            /*
            upper2: {
                fg: [
                        "0000","0r01","0r02","0000",
                        "0r03","0r04","0r05","0r06",
                        "0r07","0r08","0r09","0r10",
                        "0r11","0r08","0r09","0r12",
                        "0r11","0r08","0r09","0r12",
                        "0r11","0r13","0r14","0r12",
                        "0r15","0000","0000","0r16",
                ],
            },
            */

        }
    }

    static xlvl = {
        width: 32,
        height: 24,
        xregions: [
            this.genRegion({width: 32, height: 24, xlayers: [{ id: '002j' }]}),
            this.house1,
            {
                width: 4,
                height: 4,
                offx: 6,
                offy: 4,
                layers: {
                    main: {

                        /*
                        bg: [   
                            "0003","0003","0003","0003",
                            "0003","0003","0003","0003",
                            "0003","0003","0003","0003",
                            "0003","0003","0003","0003",
                        ],

                        bgo: [   
                            "002n","002l","002l","002m",
                            "002g","0000","0000","002f",
                            "002g","0000","0000","002f",
                            "002i","002d","002d","002h",
                        ],
                        */

                        fg: [   
                            "0000","0000","0000","0000",
                            "0000","0000","0000","0000",
                            "0000","0000","0000","0000",
                            "0c01","0000","0000","0000",
                        ],
                    },
                },
            },

        ],
    };
}