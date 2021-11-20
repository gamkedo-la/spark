export { WorldOverrides };

import { Collider } from "./base/collider.js";
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
                predicate: (v) => v.x === this.wpos(WorldGen.vendorHouse.offx + 8) && 
                                v.y === this.wpos(WorldGen.vendorHouse.offy + 3) &&
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
                    dirty: new WorkTimer({maxTTL: 30000}),
                },
            },

            // -- SWEEP locations
            {
                predicate: (v) => v.x === this.wpos(WorldGen.vendor1.offx + 2) && 
                                v.y === this.wpos(WorldGen.vendor1.offy + 2) &&
                                v.tag === "road",
                spec: { 
                    ownerTag: "Aodhan", 
                    dirty: new WorkTimer({maxTTL: 30000}),
                },
            },
            {
                predicate: (v) => v.x === this.wpos(WorldGen.vendor1.offx + 5) && 
                                v.y === this.wpos(WorldGen.vendor1.offy + 5) &&
                                v.tag === "road",
                spec: { 
                    ownerTag: "Aodhan", 
                    dirty: new WorkTimer({maxTTL: 30000}),
                },
            },
            {
                predicate: (v) => v.x === this.wpos(WorldGen.vendor1.offx + 3) && 
                                v.y === this.wpos(WorldGen.vendor1.offy + 7) &&
                                v.tag === "road",
                spec: { 
                    ownerTag: "Aodhan", 
                    dirty: new WorkTimer({maxTTL: 30000}),
                },
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
                predicate: (v) => v.x === this.wpos(WorldGen.inn.offx + 11) && 
                                v.y === this.wpos(WorldGen.inn.offy + 1) &&
                                v.tag === "stool",
                spec: {
                    occupiedDir: Direction.east, 
                    interactTag: false,
                },
            },
            {
                predicate: (v) => v.x === this.wpos(WorldGen.inn.offx + 11) && 
                                v.y === this.wpos(WorldGen.inn.offy + 7) &&
                                v.tag === "stool",
                spec: {
                    ownerTag: "Ciara",
                    occupiedDir: Direction.east, 
                },
            },
            {
                predicate: (v) => v.x === this.wpos(WorldGen.inn.offx + 13) && 
                                v.y === this.wpos(WorldGen.inn.offy + 3) &&
                                v.tag === "stool",
                spec: {
                    occupiedDir: Direction.north, 
                },
            },
            {
                predicate: (v) => v.x === this.wpos(WorldGen.inn.offx + 6) && 
                                v.y === this.wpos(WorldGen.inn.offy + 7) &&
                                v.tag === "stool",
                spec: {
                    occupiedDir: Direction.west, 
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

            // Finn (gardener) things
            // -- BED
            {
                predicate: (v) => v.x === this.wpos(WorldGen.gardenHouse.offx + 4) && 
                                v.y === this.wpos(WorldGen.gardenHouse.offy + 7) &&
                                v.cls === "Bed",
                spec: {
                    ownerTag: "Finn",
                    approachOffsets: [{x:-16, y:0}],
                },
            },
            // -- STOOL/TABLE
            {
                predicate: (v) => v.x === this.wpos(WorldGen.gardenHouse.offx + 2) && 
                                v.y === this.wpos(WorldGen.gardenHouse.offy + 5) &&
                                v.tag === "stool",
                spec: {
                    ownerTag: "Finn",
                    occupiedDir: Direction.north, 
                },
            },
            // -- RUNES
            {
                predicate: (v) => v.x === this.wpos(WorldGen.lvl32.offx + 6) && 
                                v.y === this.wpos(WorldGen.lvl32.offy + 15) &&
                                v.tag === "rockRelay",
                spec: {
                    ownerTag: "Finn",
                    powered: false,
                    range: Config.tileSize * 16,
                },
            },

            // Nessa (tinkerer) things
            // -- RUNES
            {
                predicate: (v) => v.x === this.wpos(WorldGen.lvl02.offx + 5) && 
                                v.y === this.wpos(WorldGen.lvl02.offy + 14) &&
                                v.cls === "SparkBase",
                spec: {
                    ownerTag: "Nessa",
                    powered: false,
                    range: Config.tileSize * 16,
                },
            },
            {
                predicate: (v) => v.x === this.wpos(WorldGen.pier.offx + 6) && 
                                v.y === this.wpos(WorldGen.pier.offy + 7) &&
                                v.cls === "SparkBase",
                spec: {
                    ownerTag: "Nessa",
                    powered: false,
                    range: Config.tileSize * 12,
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

            // pier collider overrides
            {
                predicate: (v) => v.x === this.wpos(WorldGen.pier.offx + 1) && v.y === this.wpos(WorldGen.pier.offy + 10) && v.tag.startsWith("lamppost"),
                spec: { xcollider: {tag: Collider.sparkthru, width: 8, height: 32, offx: -4}},
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