export { WorldOverrides };

import { Config }               from "./base/config.js";
import { WorldGen }             from "./worldGen.js";

class WorldOverrides {
    static wpos(v) {
        return v*Config.tileSize + Config.halfSize;
    }

    static overrides = [
        {
            predicate: (v) => false,
            spec: {}
        },

        // Aodhan (vendor) things
        {
            predicate: (v) => v.x === this.wpos(WorldGen.house1.offx + 2) && 
                              v.y === this.wpos(WorldGen.house1.offy + 7) &&
                              v.cls === "Bed",
            spec: {
                ownerTag: "Aodhan",
            }
        },
    ];

    static apply(spec) {
        for (const override of this.overrides) {
            if (override.predicate(spec)) {
                spec = Object.assign(spec, override.spec);
            }
        }
        return spec;
    }
}