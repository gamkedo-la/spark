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
            let layerTag = xlayer.tag || "l1";
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
        width: 10,
        height: 15,
        offx: 12,
        offy: 8,
        autoArea: true,
        layers: {
            l1: {
                bg: [
                        "0000","0000","0000","0000","0000","0000","0000","0000","0000","0000",
                        "0000","0000","0000","0000","0000","0000","0000","0000","0000","0000",
                        "0000","0000","0000","0000","0000","0000","0000","0000","0000","0000",
                        "0000","0000","0000","0000","0000","0000","0000","0000","0000","0000",
                        "0000","0004","0004","0004","0004","0004","0004","0004","0004","0000",
                        "0000","0004","0004","0004","0004","0004","0004","0004","0004","0000",
                        "0000","0004","0004","0004","0004","0004","0004","0004","0004","0000",
                        "0000","0004","0004","0004","0004","0004","0004","0004","0004","0000",
                        "0000","0004","0004","0004","0004","0004","0004","0004","0004","0000",
                        "0000","0004","0004","0004","0004","0004","0004","0004","0004","0000",
                        "0000","0004","0004","0004","0004","0004","0004","0004","0004","0000",
                        "0000","0004","0004","0004","0004","0004","0004","0004","0004","0000",
                        "0000","0004","0004","0004","0004","0004","0004","0004","0004","0000",
                ],

                fg: [   
                        "0000","0000","0000","0000","0000","0000","0000","0000","0000","0000",
                        "0000","0000","0000","0000","0000","0000","0000","0000","0000","0000",
                        "0000","0000","0000","0000","0000","0000","0000","0000","0000","0000",
                        "0000","005a","005b","005b","005b","005b","005b","005b","005c","0000",
                        "0000","005d","005e","005e","005e","005e","005e","005e","005f","0000",
                        "0000","005g","0000","0000","0000","0000","0000","0000","005h","0000",
                        "0000","005g","0000","0000","0000","0000","0000","0000","005h","0000",
                        "0000","005g","0000","0000","0000","0000","0000","0000","005h","0000",
                        "0000","005g","0000","0000","0000","0000","0000","0000","005h","0000",
                        "0000","005g","0000","0000","0000","0000","0000","0000","005h","0000",
                        "0000","005g","0000","0000","0000","0000","0000","0000","005h","0000",
                        "0000","005j","005b","0000","0000","0000","0000","005b","005i","0000",
                        "0000","005m","005e","0o01","0000","0000","0000","005e","005l","0000",
                ],

            },

            l2: {
                fg: [   
                        "0000","0000","0000","0000","0000","0000","0000","0000","0000","0000",
                        "0000","0000","0000","0000","0000","0000","0000","0000","0000","0000",
                        "0000","0000","0000","0000","0000","0000","0000","0000","0000","0000",
                        "0000","006a","006b","006b","006b","006b","006b","006b","006c","0000",
                        "0000","006d","006e","006e","006e","006e","006e","006e","006f","0000",
                        "0000","006g","0000","0000","0000","0000","0000","0000","006h","0000",
                        "0000","006g","0000","0000","0000","0000","0000","0000","006h","0000",
                        "0000","006g","0000","0000","0000","0000","0000","0000","006h","0000",
                        "0000","006g","0000","0000","0000","0000","0000","0000","006h","0000",
                        "0000","006g","0000","0000","0000","0000","0000","0000","006h","0000",
                        "0000","006g","0000","0000","0000","0000","0000","0000","006h","0000",
                        "0000","006j","006b","0000","0000","0000","0000","006b","006i","0000",
                        "0000","006m","006e","0000","0000","0000","0000","006e","006l","0000",
                ],
            },

            l3: {
                fg: [   
                        "0000","0000","0000","0000","0000","0000","0000","0000","0000","0000",
                        "0000","0000","0000","0000","0000","0000","0000","0000","0000","0000",
                        "0000","0000","0000","0000","0000","0000","0000","0000","0000","0000",
                        "0000","006a","006b","006b","006b","006b","006b","006b","006c","0000",
                        "0000","006d","006e","006e","006e","006e","006e","006e","006f","0000",
                        "0000","006g","0000","0000","0000","0000","0000","0000","006h","0000",
                        "0000","006g","0000","0000","0000","0000","0000","0000","006h","0000",
                        "0000","006g","0000","0000","0000","0000","0000","0000","006h","0000",
                        "0000","006g","0000","0000","0000","0000","0000","0000","006h","0000",
                        "0000","006g","0000","0000","0000","0000","0000","0000","006h","0000",
                        "0000","006g","0000","0000","0000","0000","0000","0000","006h","0000",
                        "0000","006j","006b","0000","0000","0000","0000","006b","006i","0000",
                        "0000","006m","006e","0005","0000","0000","0000","006e","006l","0000",
                ],
            },

            l4: {
                fg: [   
                        "0000","0000","0000","0000","0000","0000","0000","0000","0000","0000",
                        "0000","0000","0000","0000","0000","0000","0000","0000","0000","0000",
                        "0000","0000","0000","0000","0000","0000","0000","0000","0000","0000",
                        "0000","006a","006b","006b","006b","006b","006b","006b","006c","0000",
                        "0000","006d","006e","006e","006e","006e","006e","006e","006f","0000",
                        "0000","006g","0000","0000","0000","0000","0000","0000","006h","0000",
                        "0000","006g","0000","0000","0000","0000","0000","0000","006h","0000",
                        "0000","006g","0000","0000","0000","0000","0000","0000","006h","0000",
                        "0000","006g","0000","0000","0000","0000","0000","0000","006h","0000",
                        "0000","006g","0000","0000","0000","0000","0000","0000","006h","0000",
                        "0000","006g","0000","0000","0000","0000","0000","0000","006h","0000",
                        "0000","006j","006b","0000","0000","0000","0000","006b","006i","0000",
                        "0000","006m","006e","0000","0000","0000","0000","006e","006l","0000",
                ],
            },

            l5: {
                bg: [
                        "0000","0000","0000","0000","0000","0000","0000","0000","0000","0000",
                        "0000","0000","0000","0000","0000","0000","0000","0000","0000","0000",
                        "0000","0000","0000","0000","0000","0000","0000","0000","0000","0000",
                        "0000","0000","0000","0000","0000","0000","0000","0000","0000","0000",
                        "0000","0000","0000","0000","0000","0000","0000","0000","0000","0000",
                        "0000","0000","0000","0000","0000","0000","0000","0000","0000","0000",
                        "0000","0000","0000","0000","0000","0000","0000","0000","0000","0000",
                        "0000","0000","0000","0000","0000","0000","0000","0000","0000","0000",
                        "0000","0000","0000","0000","0000","0000","0000","0000","0000","0000",
                        "0000","0000","0000","0000","006e","006e","0000","0000","0000","0000",
                        "0000","0000","0000","006e","006e","006e","006e","0000","0000","0000",
                        "0000","0000","006e","006e","006e","006e","006e","006e","0000","0000",
                        "0000","006m","006e","006e","006e","006e","006e","006e","006l","0000",
                ],
                fg: [
                        "0000","0000","0000","0000","0rla","0rra","0000","0000","0000","0000",
                        "0000","0000","0000","0rla","0rlc","0rrb","0rra","0000","0000","0000",
                        "0000","0000","0rla","0rlc","0rlf","0rrc","0rrb","0rra","0000","0000",
                        "0000","0rla","0rlc","0rlf","0rlf","0rrc","0rrc","0rrb","0rra","0000",
                        "0rla","0rlc","0rlf","0rlf","0rlf","0rrc","0rrc","0rrc","0rrb","0rra",
                        "0rle","0rlf","0rlf","0rlf","0rlf","0rrc","0rrc","0rrc","0rrc","0rrd",
                        "0rle","0rlf","0rlf","0rlf","0rlf","0rrc","0rrc","0rrc","0rrc","0rrd",
                        "0rle","0rlf","0rlf","0rlf","0rlf","0rrc","0rrc","0rrc","0rrc","0rrd",
                        "0rle","0rlf","0rlf","0rlf","0rlo","0rrk","0rrc","0rrc","0rrc","0rrd",
                        "0rle","0rlf","0rlf","0rlo","0rlr","0rrl","0rrk","0rrc","0rrc","0rrd",
                        "0rle","0rlf","0rlo","0rlr","0000","0000","0rrl","0rrk","0rrc","0rrd",
                        "0rle","0rlo","0rlr","0000","0000","0000","0000","0rrl","0rrk","0rrd",
                        "0rlq","0rlr","0000","0000","0000","0000","0000","0000","0rrl","0rrm",
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
                    l1: {

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