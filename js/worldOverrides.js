export { WorldOverrides };

import { Config }               from "./base/config.js";
import { Direction } from "./base/dir.js";
import { WorkTimer }            from "./dirtySystem.js";
import { WorldGen }             from "./worldGen.js";

class WorldOverrides {
    static wpos(v) {
        return v*Config.tileSize + Config.halfSize;
    }

    static overrides = [];

    static init() {
        this.overrides = [
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
                },
            },
            {
                predicate: (v) => v.x === this.wpos(WorldGen.house1.offx + 8) && 
                                v.y === this.wpos(WorldGen.house1.offy + 8) &&
                                v.tag === "stool",
                spec: {
                    //ownerTag: "Aodhan",
                    occupiedDir: Direction.north, 
                },
            },

            {
                predicate: (v) => v.x === this.wpos(WorldGen.vendor1.offx + 1) && 
                                v.y === this.wpos(WorldGen.vendor1.offy + 5) &&
                                v.tag === "road",
                spec: {
                    //ownerTag: "Aodhan",
                    dirty: new WorkTimer(),
                },
            },

            {
                predicate: (v) => v.x === this.wpos(WorldGen.vendor1.offx + 5) && 
                                v.y === this.wpos(WorldGen.vendor1.offy + 4) &&
                                v.tag === "barrel",
                spec: {
                    ownerTag: "Aodhan",
                    //restock: new WorkTimer(),
                },
            },

        ];
    }

    static apply(spec) {
        for (const override of this.overrides) {
            if (override.predicate(spec)) {
                spec = Object.assign(spec, override.spec);
            }
        }
        return spec;
    }
}