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
            // -- BED
            {
                predicate: (v) => v.x === this.wpos(WorldGen.vendorHouse.offx + 2) && 
                                v.y === this.wpos(WorldGen.vendorHouse.offy + 6) &&
                                v.cls === "Bed",
                spec: {
                    ownerTag: "Aodhan",
                },
            },
            // -- STOOL/TABLE
            {
                predicate: (v) => v.x === this.wpos(WorldGen.vendorHouse.offx + 11) && 
                                v.y === this.wpos(WorldGen.vendorHouse.offy + 5) &&
                                v.tag === "stool",
                spec: {
                    ownerTag: "Aodhan",
                    occupiedDir: Direction.north, 
                },
            },
            // -- STOVE
            {
                predicate: (v) => v.x === this.wpos(WorldGen.house1.offx + 8) && 
                                v.y === this.wpos(WorldGen.house1.offy + 3) &&
                                v.cls === "Stove",
                spec: {
                    ownerTag: "Aodhan",
                },
            },
            // -- WORKSTATION
            {
                predicate: (v) => v.x === this.wpos(WorldGen.vendor1.offx + 4) && 
                                v.y === this.wpos(WorldGen.vendor1.offy + 8) &&
                                v.tag === "vendorBench",
                spec: {
                    ownerTag: "Aodhan",
                },
            },
            // -- SPARK BASE
            {
                predicate: (v) => v.x === this.wpos(WorldGen.vendorHouse.offx + 15) && 
                                v.y === this.wpos(WorldGen.vendorHouse.offy + 11) &&
                                v.tag === "sparkbase",
                spec: {
                    ownerTag: "Aodhan",
                    powered: false,
                },
            },

            // -- SWEEP locations
            {
                predicate: (v) => v.x === this.wpos(WorldGen.vendor1.offx + 2) && 
                                v.y === this.wpos(WorldGen.vendor1.offy + 7) &&
                                v.tag === "road",
                spec: { ownerTag: "Aodhan", dirty: new WorkTimer(), },
            },
            {
                predicate: (v) => v.x === this.wpos(WorldGen.vendor1.offx + 3) && 
                                v.y === this.wpos(WorldGen.vendor1.offy + 7) &&
                                v.tag === "road",
                spec: { ownerTag: "Aodhan", dirty: new WorkTimer(), },
            },
            {
                predicate: (v) => v.x === this.wpos(WorldGen.vendor1.offx + 3) && 
                                v.y === this.wpos(WorldGen.vendor1.offy + 6) &&
                                v.tag === "road",
                spec: { ownerTag: "Aodhan", dirty: new WorkTimer(), },
            },

            // -- STOCK locations
            {
                predicate: (v) => v.x === this.wpos(WorldGen.vendor1.offx + 0) && 
                                v.y === this.wpos(WorldGen.vendor1.offy + 6) &&
                                v.cls === "Stock",
                spec: { ownerTag: "Aodhan" },
            },
            {
                predicate: (v) => v.x === this.wpos(WorldGen.vendor1.offx + 6) && 
                                v.y === this.wpos(WorldGen.vendor1.offy + 7) &&
                                v.cls === "Stock",
                spec: { ownerTag: "Aodhan" },
            },
            {
                predicate: (v) => v.x === this.wpos(WorldGen.vendor1.offx + 7) && 
                                v.y === this.wpos(WorldGen.vendor1.offy + 7) &&
                                v.cls === "Stock",
                spec: { ownerTag: "Aodhan" },
            },

            // Ciara (innkeeper) things
            {
                predicate: (v) => v.x === this.wpos(WorldGen.house2.offx + 2) && 
                                v.y === this.wpos(WorldGen.house2.offy + 7) &&
                                v.cls === "Bed",
                spec: {
                    ownerTag: "Ciara",
                },
            },
            {
                predicate: (v) => v.x === this.wpos(WorldGen.house2.offx + 8) && 
                                v.y === this.wpos(WorldGen.house2.offy + 8) &&
                                v.tag === "stool",
                spec: {
                    ownerTag: "Ciara",
                    occupiedDir: Direction.north, 
                },
            },
            {
                predicate: (v) => v.x === this.wpos(WorldGen.work2.offx + 2) && 
                                v.y === this.wpos(WorldGen.work2.offy + 3) &&
                                v.tag === "vendorBench",
                spec: {
                    ownerTag: "Ciara",
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