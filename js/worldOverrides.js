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
                    occupiedDir: Direction.east, 
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
            // -- SPARK BASES
            {
                predicate: (v) => v.x === this.wpos(WorldGen.vendorHouse.offx + 7) && 
                                v.y === this.wpos(WorldGen.vendorHouse.offy + 4) &&
                                v.tag === "vhouse.rune",
                spec: {
                    ownerTag: "Aodhan",
                    powered: false,
                },
            },
            {
                predicate: (v) => v.x === this.wpos(WorldGen.vendor1.offx + 4) && 
                                v.y === this.wpos(WorldGen.vendor1.offy + 10) &&
                                v.tag === "floorRelay",
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
                predicate: (v) => v.x === this.wpos(WorldGen.inn.offx + 16) && 
                                v.y === this.wpos(WorldGen.inn.offy + 17) &&
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
                predicate: (v) => v.x === this.wpos(WorldGen.inn.offx + 6) && 
                                v.y === this.wpos(WorldGen.inn.offy + 3) &&
                                v.tag === "bar.work",
                spec: {
                    ownerTag: "Ciara",
                },
            },
            {
                predicate: (v) => v.x === this.wpos(WorldGen.inn.offx + 2) && 
                                v.y === this.wpos(WorldGen.inn.offy + 3) &&
                                v.tag === "bar.work",
                spec: {
                    ownerTag: "Ciara",
                },
            },
            {
                predicate: (v) => v.x === this.wpos(WorldGen.inn.offx + 13) && 
                                v.y === this.wpos(WorldGen.inn.offy + 9) &&
                                v.tag === "inn.wall.rune",
                spec: {
                    ownerTag: "Ciara",
                    powered: false,
                },
            },

            // ocean collider overrides
            {
                predicate: (v) => v.x === this.wpos(WorldGen.lvl12.offx + 14) && v.y === this.wpos(WorldGen.lvl12.offy + 9) && v.tag.startsWith("ocean"),
                spec: { xcollider: null },
            },
            {
                predicate: (v) => v.x === this.wpos(WorldGen.lvl12.offx + 15) && v.y === this.wpos(WorldGen.lvl12.offy + 9) && v.tag.startsWith("ocean"),
                spec: { xcollider: null },
            },
            {
                predicate: (v) => v.x === this.wpos(WorldGen.lvl12.offx + 15) && v.y === this.wpos(WorldGen.lvl12.offy + 10) && v.tag.startsWith("ocean"),
                spec: { xcollider: null },
            },

            {
                predicate: (v) => v.x === this.wpos(WorldGen.lvl22.offx + 0) && v.y === this.wpos(WorldGen.lvl22.offy + 10) && v.tag.startsWith("ocean"),
                spec: { xcollider: null },
            },
            {
                predicate: (v) => v.x === this.wpos(WorldGen.lvl22.offx + 1) && v.y === this.wpos(WorldGen.lvl22.offy + 10) && v.tag.startsWith("ocean"),
                spec: { xcollider: null },
            },
            {
                predicate: (v) => v.x === this.wpos(WorldGen.lvl22.offx + 2) && v.y === this.wpos(WorldGen.lvl22.offy + 10) && v.tag.startsWith("ocean"),
                spec: { xcollider: null },
            },
            {
                predicate: (v) => v.x === this.wpos(WorldGen.lvl22.offx + 3) && v.y === this.wpos(WorldGen.lvl22.offy + 10) && v.tag.startsWith("ocean"),
                spec: { xcollider: null },
            },
            {
                predicate: (v) => v.x === this.wpos(WorldGen.lvl22.offx + 3) && v.y === this.wpos(WorldGen.lvl22.offy + 11) && v.tag.startsWith("ocean"),
                spec: { xcollider: null },
            },
            {
                predicate: (v) => v.x === this.wpos(WorldGen.lvl22.offx + 4) && v.y === this.wpos(WorldGen.lvl22.offy + 11) && v.tag.startsWith("ocean"),
                spec: { xcollider: null },
            },
            {
                predicate: (v) => v.x === this.wpos(WorldGen.lvl22.offx + 5) && v.y === this.wpos(WorldGen.lvl22.offy + 11) && v.tag.startsWith("ocean"),
                spec: { xcollider: null },
            },
            {
                predicate: (v) => v.x === this.wpos(WorldGen.lvl22.offx + 5) && v.y === this.wpos(WorldGen.lvl22.offy + 12) && v.tag.startsWith("ocean"),
                spec: { xcollider: null },
            },
            {
                predicate: (v) => v.x === this.wpos(WorldGen.lvl22.offx + 6) && v.y === this.wpos(WorldGen.lvl22.offy + 12) && v.tag.startsWith("ocean"),
                spec: { xcollider: null },
            },
            {
                predicate: (v) => v.x === this.wpos(WorldGen.lvl22.offx + 6) && v.y === this.wpos(WorldGen.lvl22.offy + 13) && v.tag.startsWith("ocean"),
                spec: { xcollider: null },
            },
            {
                predicate: (v) => v.x === this.wpos(WorldGen.lvl22.offx + 7) && v.y === this.wpos(WorldGen.lvl22.offy + 13) && v.tag.startsWith("ocean"),
                spec: { xcollider: null },
            },
            {
                predicate: (v) => v.x === this.wpos(WorldGen.lvl22.offx + 7) && v.y === this.wpos(WorldGen.lvl22.offy + 14) && v.tag.startsWith("ocean"),
                spec: { xcollider: null },
            },
            {
                predicate: (v) => v.x === this.wpos(WorldGen.lvl22.offx + 7) && v.y === this.wpos(WorldGen.lvl22.offy + 15) && v.tag.startsWith("ocean"),
                spec: { xcollider: null },
            },

            {
                predicate: (v) => v.x === this.wpos(WorldGen.lvl23.offx + 7) && v.y === this.wpos(WorldGen.lvl23.offy + 0) && v.tag.startsWith("ocean"),
                spec: { xcollider: null },
            },
            {
                predicate: (v) => v.x === this.wpos(WorldGen.lvl23.offx + 8) && v.y === this.wpos(WorldGen.lvl23.offy + 0) && v.tag.startsWith("ocean"),
                spec: { xcollider: null },
            },
            {
                predicate: (v) => v.x === this.wpos(WorldGen.lvl23.offx + 8) && v.y === this.wpos(WorldGen.lvl23.offy + 1) && v.tag.startsWith("ocean"),
                spec: { xcollider: null },
            },
            {
                predicate: (v) => v.x === this.wpos(WorldGen.lvl23.offx + 8) && v.y === this.wpos(WorldGen.lvl23.offy + 2) && v.tag.startsWith("ocean"),
                spec: { xcollider: null },
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