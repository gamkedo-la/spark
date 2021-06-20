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
            let depthTag = xlayer.depthTag || "bb";
            let id = xlayer.id;
            if (id) {
                lspec[depthTag] = this.genData(spec.width, spec.height, id);
            }
            xregion.layers[layerTag] = lspec;

        }
        return xregion;
    }

    static vendor1 = {
        tag: "vendor1",
        width: 8,
        height: 7,
        offx: 5,
        offy: 13,
        autoArea: true,
        layers: {
            l1: {
                bb: [   
                    "0003","0003","0003","0003","0003","0003","0003","0003",
                    "0003","0003","0003","0003","0003","0003","0003","0003",
                    "0003","0003","0003","0003","0003","0003","0003","0003",
                    "0003","0003","0003","0003","0003","0003","0003","0003",
                    "0003","0003","0003","0003","0003","0003","0003","0003",
                    "0003","0003","0003","0003","0003","0003","0003","0003",
                    "0003","0003","0003","0003","0003","0003","0003","0003",
                ],
                bm: [   
                    "002n","002l","002l","002l","002l","002l","002l","002m",
                    "002g","0000","0000","0000","0000","0000","0000","002f",
                    "002g","0000","0000","0000","0000","0000","0000","002f",
                    "002g","0000","0000","0000","0000","0000","0000","002f",
                    "002g","0000","0000","0000","0000","0000","0000","002f",
                    "002g","0000","0000","0000","0000","0000","0000","002f",
                    "002i","002d","002d","002d","002d","002d","002d","002h",
                ],
                fb: [   
                    "0000","000g","0000","000j","0000","0000","000h","0000",
                    "0000","0000","0000","0000","0009","0008","0000","0000",
                    "0000","0000","0000","0000","0000","0000","0000","0000",
                    "0000","000g","000k","000j","0000","0007","000h","0000",
                ],
                fm: [   
                    "0000","0000","0000","0000","0000","0000","0000","0000",
                    "0000","0000","0000","0000","0000","000a","0000","0000",
                    "0000","0000","0000","0000","0000","0000","0000","0000",
                    "0000","0000","0000","0000","0000","0000","0000","0000",
                ],
            },

            l2: {
                fb: [   
                    "0000","000e","000e","000e","000e","000e","000e","0000",
                    "0000","000e","000e","000e","000e","000e","000e","0000",
                    "0000","000e","000e","000e","000e","000e","000e","0000",
                    "0000","000d","000d","000d","000d","000d","000d","0000",
                ],
                fo: [   
                    "0000","0000","0000","0000","0000","0000","0000","0000",
                    "0000","0000","0000","0000","0000","0000","0000","0000",
                    "0000","000l","0000","000m","0000","000n","0000","0000",
                    "0000","0000","0000","0000","0000","0000","0000","0000",
                ]

            },

            l3: {
                fb: [   
                    "0000","0rbm","0rbn","0rbn","0rbn","0rbn","0rbo","0000",
                    "0000","0rfa","0rfb","0rfb","0rfb","0rfb","0rfc","0000",
                    "0000","0rfd","0rfe","0rfe","0rfe","0rfe","0rff","0000",
                    "0000","0rfm","0rfm","0rfm","0rfm","0rfm","0rfm","0000",
                ],
            },

        },
    }

    static house1 = {
        tag: "house1",
        width: 10,
        height: 15,
        offx: 20,
        offy: 4,
        autoArea: true,
        layers: {
            l1: {
                bb: [
                        "0000","0000","0000","0000","0000","0000","0000","0000","0000","0000",
                        "0000","0000","0000","0000","0000","0000","0000","0000","0000","0000",
                        "0000","0000","0000","0000","0000","0000","0000","0000","0000","0000",
                        "0000","0000","0000","0000","0000","0000","0000","0000","0000","0000",
                        "0004","0004","0004","0004","0004","0004","0004","0004","0004","0004",
                        "0004","0004","0004","0004","0004","0004","0004","0004","0004","0004",

                        "0004","0004","0004","0004","0004","0004","0004","0004","0004","0004",
                        "0004","0004","0004","0004","0004","0004","0004","0004","0004","0004",
                        "0004","0004","0004","0004","0004","0004","0004","0004","0004","0004",
                        "0004","0004","0004","0004","0004","0004","0004","0004","0004","0004",
                        "0004","0004","0004","0004","0004","0004","0004","0004","0004","0004",
                        "0004","0004","0004","0004","0004","0004","0004","0004","0004","0004",
                        "0004","0004","0004","0004","0004","0004","0004","0004","0004","0004",
                        "0004","0004","0004","0004","0004","0004","0004","0004","0004","0004",
                ],
                bm: [
                        "0000","0000","0000","0000","0000","0000","0000","0000","0000","0000",
                        "0000","0000","0000","0000","0000","0000","0000","0000","0000","0000",
                        "0000","0000","0000","0000","0000","0000","0000","0000","0000","0000",
                        "0000","0000","0000","0000","0000","0000","0000","0000","0000","0000",
                        "002n","002l","002l","002l","002l","002l","002l","002l","002l","002m",
                        "002g","0000","0000","0000","0000","0000","0000","0000","0000","002f",
                        "002g","0000","0000","0000","0000","0000","0000","0000","0000","002f",
                        "002g","0000","0000","0000","0000","0000","0000","0000","0000","002f",
                        "002g","0000","0000","0000","0000","0000","0000","0000","0000","002f",
                        "002g","0000","0000","0000","0000","0000","0000","0000","0000","002f",
                        "002g","0000","0000","0000","0000","0000","0000","0000","0000","002f",
                        "002g","0000","0000","0000","0000","0000","0000","0000","0000","002f",
                        "002g","0000","0000","0000","0000","0000","0000","0000","0000","002f",
                        "002i","002d","002d","002d","002d","002d","002d","002d","002d","002h",
                ],

                fb: [   
                        "0000","0000","0000","0000","0000","0000","0000","0000","0000","0000",
                        "0000","0000","0000","0000","0000","0000","0000","0000","0000","0000",
                        "0000","0000","0000","0000","0000","0000","0000","0000","0000","0000",
                        "0000","005a","005b","005b","005b","005b","005b","005b","005c","0000",
                        "0000","005d","005e","005e","005e","005e","005e","005e","005f","0000",
                        "0000","005g","0000","0000","0000","0000","0000","0000","005h","0000",
                        "0000","005g","0000","0000","0o02","0000","0o03","0000","005h","0000",
                        "0000","005g","0o04","0000","0000","0000","0000","0000","005h","0000",
                        "0000","005g","0000","0000","0000","0000","0000","0000","005h","0000",
                        "0000","005g","0000","0000","0000","0000","0000","0000","005h","0000",
                        "0000","005g","0000","0000","0000","0000","0000","0000","005h","0000",
                        "0000","005j","005b","0000","0000","0000","0000","005b","005i","0000",
                        "0000","005m","005e","0o01","0000","0000","0000","005e","005l","0000",
                ],

            },

            l2: {
                fb: [   
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
                fb: [   
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
                fb: [   
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
                bb: [
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
                fb: [
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

        }
    }

    static xxlvl = {
        cls: "Level",
        width: 32,
        height: 24,
        xregions: [
            {
                width: 4,
                height: 5,
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
        width: 32,
        height: 24,
        xregions: [
            this.genRegion({width: 32, height: 24, xlayers: [{ id: '002j' }]}),
            this.house1,
            //this.vendor1,
            {
                width: 8,
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

                        fb: [   
                            "0o00","0000","0000","0000","0000","0000","0000","0000",
                            "0000","0000","0000","0000","0000","0000","0000","0000",
                            "0000","0000","0000","0000","0000","0000","0000","0000",
                            "0c01","0000","0000","0000","0000","0000","0000","0o05",
                        ],
                    },
                },
            },

        ],
    };
}