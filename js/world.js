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
        width: 4,
        height: 7,
        offx: 12,
        offy: 4,
        autoArea: true,
        layers: {
            main: {
                bg: [
                        "0000","0000","0000","0000",
                        "0000","002a","0000","0000",
                        "0010","0026","0011","0012",
                        "0010","0011","0011","0012",
                        "0010","0011","0011","0012",
                        "0000","0011","0000","0000", 
                ],
                fg: [   
                        "0000","0000","0000","0000",
                        "0016","0000","0017","0018",
                        "0021","0000","0000","0021",
                        "0021","0000","0000","0021",
                        "0023","0000","0000","0025",
                        "0028","0019","0030","0031", 
                ],
                fo: [   
                        "0000","0000","0000","0000",
                        "0000","0000","0000","0000",
                        "0000","0000","0000","0000",
                        "0000","0000","0000","0000",
                        "0000","0024","0024","0000",
                        "0000","0000","0000","0000", 
                ],
            },

            upper: {
                bg: [
                        "0000","0000","0000","0000",
                        "0000","0000","0000","0000",
                        "0013","0022","0014","0015",
                        "0013","0027","0014","0015",
                        "0013","0014","0014","0015",
                        "0000","0000","0000","0000",
                ],
                fg: [
                        "0000","0000","0000","0000",
                        "0032","0033","0033","0034",
                        "0021","0000","0000","0021",
                        "0021","0000","0005","0021",
                        "0035","0036","0037","0038",
                        "0039","0040","0041","0042",
                ],
            },

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

        }
    }

    static xlvl = {
        width: 32,
        height: 24,
        xregions: [
            this.genRegion({width: 32, height: 24, xlayers: [{ id: '0002' }]}),
            //this.house1,
            {
                width: 3,
                height: 3,
                offx: 6,
                offy: 4,
                layers: {
                    main: {
                        fg: [   
                            "0000","0000","0000",
                            "0000","0000","0000",
                            "0000","0001","0000",
                        ],
                    },
                },
            },

        ],
    };
}