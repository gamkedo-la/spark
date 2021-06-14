export { SparkAssets };

import { Direction }            from "./base/dir.js";
import { Fmt }                  from "./base/fmt.js";
import { ModelState }           from "./base/modelState.js";
import { Templates }            from "./templates.js";

const moveDuration = 90;

class SparkAssets {
    static init() {
        this.media = [
            { src: "img/terrain1.png", loader: "Sheet", refs: [
                { tag: "road",      cls: "VarSprite", variations: [
                    { x: 16*0, y: 16*0, width: 16, height: 16 },
                    { x: 16*1, y: 16*0, width: 16, height: 16 },
                    { x: 16*2, y: 16*0, width: 16, height: 16 },
                    { x: 16*3, y: 16*0, width: 16, height: 16 },
                ]},
                { tag: "brickFloor",      cls: "VarSprite", variations: [
                    { x: 16*0, y: 16*1, width: 16, height: 16 },
                    { x: 16*1, y: 16*1, width: 16, height: 16 },
                    { x: 16*2, y: 16*1, width: 16, height: 16 },
                    { x: 16*3, y: 16*1, width: 16, height: 16 },
                ]},

            ]},
            Templates.overlayMedia("img/grass.png", "grass", {"height": 16, "width": 16}),
            Templates.wallMedia("img/stuccoWalls1.png", "stuccoWalls1", {"height": 16, "width": 16, offy:16}),
            Templates.wallMedia("img/stuccoWalls2.png", "stuccoWalls2", {"height": 16, "width": 16}),
            Templates.roofMedia("img/roof.png", "roof.l", "roof.r", "roof.f", "roof.b", {"height": 16, "width": 16}),

            { src: "img/object1.png", loader: "Sheet", refs: [
                {tag: "stool", cls: "Sprite", width: 16*2, height: 16*3, x: 16*0, y: 16*0 },
                {tag: "table", cls: "Sprite", width: 16*2, height: 16*3, x: 16*2, y: 16*0 },
                {tag: "bed.empty", cls: "Sprite", width: 16*2, height: 16*4, x: 16*4, y: 16*0 },
                {tag: "bed.occupied", cls: "Sprite", width: 16*2, height: 16*4, x: 16*6, y: 16*0 },
                {tag: "basket", cls: "Sprite", width: 16*2, height: 16*4, x: 16*6, y: 16*0 },
                Templates.xsprite("basket", 8, 0, {tileSize: 16, width: 32, height: 48}),
                Templates.xsprite("barrel", 10, 0, {tileSize: 16, width: 32, height: 48}),
                Templates.xsprite("halfTable", 12, 0, {tileSize: 16, width: 32, height: 32}),
                Templates.xsprite("crate", 14, 0, {tileSize: 16, width: 16, height: 32}),
                Templates.xsprite("halfCrate", 15, 0, {tileSize: 16, width: 16, height: 32}),
                Templates.xsprite("apple", 12, 2, {tileSize: 16}),
                Templates.xsprite("strawberry", 13, 2, {tileSize: 16}),
                Templates.xsprite("shadow34", 14, 2, {tileSize: 16}),
                Templates.xsprite("shadow", 15, 2, {tileSize: 16}),
                Templates.xsprite("post", 0, 4, {tileSize: 16, height: 48}),
                Templates.xsprite("post.s", 1, 4, {tileSize: 16, height: 48}),
                Templates.xsprite("vendorBench", 2, 5, {tileSize: 16, width: 48, height: 32}),
                Templates.xsprite("postUpper.l", 0, 7, {tileSize: 16, width: 32 }),
                Templates.xsprite("postUpper.s", 2, 7, {tileSize: 16}),
                Templates.xsprite("postUpper.r", 3, 7, {tileSize: 16, width: 32 }),
            ]},

            { src: "img/stuccoWalls1.png", loader: "Sheet", refs: [
                {tag: "woodDoor.close", cls: "Sprite", width: 16*4, height: 16*5, x: 16*11, y: 16*0 },
                {tag: "woodDoor.open", cls: "Sprite", width: 16*4, height: 16*5, x: 16*11, y: 16*6 },
            ]},

            { src: "img/stuccoWalls2.png", loader: "Sheet", refs: [
                {tag: "woodDoor.top", cls: "Sprite", width: 16*4, height: 16*2, x: 16*11, y: 16*1 },
            ]},

            { tag: "woodDoor", 
                cls: "Animator", 
                animations: { 
                    [ModelState.close]: { cls: "Media", tag: "woodDoor.close" }, 
                    [ModelState.open]: { cls: "Media", tag: "woodDoor.open" }, 
                },
            },

            { tag: "bed", 
                cls: "Animator", 
                animations: { 
                    [ModelState.idle]: { cls: "Media", tag: "bed.empty" }, 
                    [ModelState.occupied]: { cls: "Media", tag: "bed.occupied" }, 
                },
            },

            // a sheet of images
            { src: "img/goldButtonFrames.png", loader: "Sheet", refs: [
                {tag: "btnGoldOpaqS1", cls: "StretchSprite", width: 50, height: 50, x: 50*0, y: 50*0, border: 30 },
                {tag: "btnGoldOpaqS2", cls: "StretchSprite", width: 50, height: 50, x: 50*1, y: 50*0, border: 30 },
                {tag: "btnGoldOpaqS3", cls: "StretchSprite", width: 50, height: 50, x: 50*2, y: 50*0, border: 30 },
                {tag: "btnGoldOpaqS4", cls: "StretchSprite", width: 50, height: 50, x: 50*3, y: 50*0, border: 30 },
                {tag: "btnGoldTranS1", cls: "StretchSprite", width: 50, height: 50, x: 50*0, y: 50*1, border: 30 },
                {tag: "btnGoldTranS2", cls: "StretchSprite", width: 50, height: 50, x: 50*1, y: 50*1, border: 30 },
                {tag: "btnGoldTranS3", cls: "StretchSprite", width: 50, height: 50, x: 50*2, y: 50*1, border: 30 },
                {tag: "btnGoldTranS4", cls: "StretchSprite", width: 50, height: 50, x: 50*3, y: 50*1, border: 30 },
            ]},

            { src: "img/gnome.png", loader: "Sheet", refs: [
                {tag: "gnome.idle_south",    cls: "Sprite", width: 32, height: 64, x: 32*0, y: 64*0 },
                {tag: "gnome.idle_north",    cls: "Sprite", width: 32, height: 64, x: 32*1, y: 64*0 },
                {tag: "gnome.idle_west",     cls: "Sprite", width: 32, height: 64, x: 32*2, y: 64*0 },
                {tag: "gnome.idle_east",     cls: "Sprite", width: 32, height: 64, x: 32*3, y: 64*0 },
                Templates.anim("gnome.walk_south", {offx:0, offy: 64, width: 32, height:64, duration: 70}),
                Templates.anim("gnome.walk_north", {offx:32, offy: 64, width: 32, height:64, duration: 70}),
                Templates.anim("gnome.walk_west", {offx:64, offy: 64, width: 32, height:64, duration: 70}),
                Templates.anim("gnome.walk_east", {offx:96, offy: 64, width: 32, height:64, duration: 70}),
                {tag: "gnome.sleep_south",    cls: "Sprite", width: 32, height: 64, x: 32*0, y: 64*9 },
            ]},

            { tag: "gnome",               cls: "Animator", animations: {
                    [ModelState.idle]:        { cls: "Media", tag: "gnome.idle_south" },
                    [ModelState.idle_south]:   { cls: "Media", tag: "gnome.idle_south" },
                    [ModelState.idle_north]:   { cls: "Media", tag: "gnome.idle_north" },
                    [ModelState.idle_west]:    { cls: "Media", tag: "gnome.idle_west" },
                    [ModelState.idle_east]:    { cls: "Media", tag: "gnome.idle_east" },
                    [ModelState.walk_south]:   { cls: "Media", tag: "gnome.walk_south" },
                    [ModelState.walk_north]:   { cls: "Media", tag: "gnome.walk_north" },
                    [ModelState.walk_west]:    { cls: "Media", tag: "gnome.walk_west" },
                    [ModelState.walk_east]:    { cls: "Media", tag: "gnome.walk_east" },
                    [ModelState.sleep_south]:  { cls: "Media", tag: "gnome.sleep_south" },
            }},

        ];

        this.assets = [

            Templates.tile("003", "road"),
            Templates.tile("004", "brickFloor"),
            Templates.tile("005", "woodDoor.top", {xxform: {dx:24}}),
            Templates.tile("006", "basket"),
            Templates.tile("007", "barrel", {xxform: {dx:8}}),
            Templates.tile("008", "halfTable", {xxform: {dx:8}}),
            Templates.tile("009", "crate"),
            Templates.tile("00a", "halfCrate"),
            Templates.tile("00b", "apple"),
            Templates.tile("00c", "strawberry"),
            Templates.tile("00d", "shadow34"),
            Templates.tile("00e", "shadow"),
            Templates.tile("00f", "post"),
            Templates.tile("00g", "post.l", { mediaTag: "post", xxform: {dx: -6} }),
            Templates.tile("00h", "post.r", { mediaTag: "post", xxform: {dx: 5} }),
            Templates.tile("00i", "post.s"),
            Templates.tile("00j", "post.sr", { mediaTag: "post.s", xxform: {dx:8} }),
            Templates.tile("00k", "vendorBench"),
            Templates.tile("00l", "postUpper.l", { xxform: {dx:8} }),
            Templates.tile("00m", "postUpper.s", { xxform: {dx:8} }),
            Templates.tile("00n", "postUpper.r", { xxform: {dx:8} }),

            { id: "o01", tag: "woodDoor", cls: "Door", xcollider: {}, xxform: {dx: 24}, xsketch: { cls: "Media", tag: "woodDoor"} },
            { id: "o02", tag: "stool", cls: "Chair", 
                xxform: {dx:8}, 
                xsketch: { cls: "Media", tag: "stool"}, 
                occupiedDir: Direction.east, 
                occupiedOffX: 10, 
                occupiedOffY: -10 
            },

            //{ id: "o03", tag: "table", cls: "Tile", xsketch: { cls: "Media", tag: "table"} },
            //Templates.tile("o02", "stool", {xxform: {dx:16}}),
            Templates.tile("o03", "table", {xxform: {dx:8}}),
            //Templates.tile("o04", "bed", {xxform: {dx:16}}),
            { id: "o04", tag: "bed", cls: "Bed", 
                xxform: {dx:8}, 
                xsketch: { cls: "Media", tag: "bed"}, 
                occupiedOffX: 8, 
                occupiedOffY: -14 
            },

            { id: "c01",    tag: "player", cls: "Character", 
                            xsketch: { cls: "Media", tag: "gnome" },
                            xcollider: { width:15, height:16, color: "rgba(0,0,127,.5)" }, },
            { id: "c02",    tag: "npc", cls: "Character", 
                            ctrlId: 0,
                            bedTag: "bob",
                            xai: { 
                                cls: "AiState",
                                xdirectives: [
                                    Templates.aiSleepDirective,
                                    Templates.aiIdleDirective,
                                ],
                                xschemes: [
                                    "FindBedScheme",
                                    "MoveScheme",
                                    "SleepBedScheme",
                                    "WakeFromBedScheme",
                                ]
                            },
                            xsketch: { cls: "Media", tag: "wizard" },
                            xactivitySchedule: Templates.testSchedule,
                            xcollider: { width:15, height:16, color: "rgba(0,0,127,.5)" }, },

        ];

        this.assets = this.assets.concat(Templates.overlayTiles("02", "grass"));
        this.assets = this.assets.concat(Templates.wallTiles("05", "stuccoWalls1"));
        this.assets = this.assets.concat(Templates.wallTiles("06", "stuccoWalls2"));
        this.assets = this.assets.concat(Templates.frontRoofTiles("rf", "roof.f"));
        this.assets = this.assets.concat(Templates.backRoofTiles("rb", "roof.b"));
        this.assets = this.assets.concat(Templates.leftRoofTiles("rl", "roof.l"));
        this.assets = this.assets.concat(Templates.rightRoofTiles("rr", "roof.r"));
    }
}