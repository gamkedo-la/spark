export { SparkAssets };

import { Collider }             from "./base/collider.js";
import { Direction }            from "./base/dir.js";
import { Fmt }                  from "./base/fmt.js";
import { ModelState }           from "./base/modelState.js";
import { Templates }            from "./templates.js";

const moveDuration = 90;

class SparkAssets {
    static init() {
        this.media = [
            { src: "snd/doorClosing.mp3", loader: "Audio", tag: "doorClosing" },
            { src: "snd/doorOpenning.mp3", loader: "Audio", tag: "doorOpening" },
            // FIXME: for now music would be added the same as normal audio, but using the "loop" variable
            //{ src: "snd/testsong.mp3", loader: "Audio", tag: "testsong", loop: true },
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
                Templates.varSpriteRef("sand", [[0,2], [1,2], [2,2], [3,2]], ),

            ]},
            Templates.overlayMedia("img/grass.png", "grass", {"height": 16, "width": 16}),
            Templates.overlayMedia("img/ocean.png", "ocean", {"height": 16, "width": 16}),
            Templates.overlayMedia("img/oceanMid.png", "oceanMid", {"height": 16, "width": 16}),
            Templates.overlayMedia("img/oceanDeep.png", "oceanDeep", {"height": 16, "width": 16}),
            Templates.wallMedia("img/stuccoWalls1.png", "stuccoWalls1", {"height": 16, "width": 16, offy:16}),
            Templates.wallMedia("img/stuccoWalls2.png", "stuccoWalls2", {"height": 16, "width": 16}),
            Templates.roofMedia("img/roof.png", "roof.l", "roof.r", "roof.f", "roof.b", {"height": 16, "width": 16}),

            { src: "img/terrain2.png", loader: "Sheet", refs: [
                { tag: "rock",      cls: "VarSprite", variations: [
                    { x: 16*0, y: 16*0, width: 16, height: 16 },
                    { x: 16*1, y: 16*0, width: 16, height: 16 },
                    { x: 16*2, y: 16*0, width: 16, height: 16 },
                    { x: 16*3, y: 16*0, width: 16, height: 16 },
                    { x: 16*4, y: 16*0, width: 16, height: 16 },
                    { x: 16*0, y: 16*1, width: 16, height: 16 },
                    { x: 16*1, y: 16*1, width: 16, height: 16 },
                    { x: 16*2, y: 16*1, width: 16, height: 16 },
                    { x: 16*3, y: 16*1, width: 16, height: 16 },
                    { x: 16*4, y: 16*1, width: 16, height: 16 }
                ]},
                { tag: "wildFlower",      cls: "VarSprite", variations: [
                    { x: 16*5, y: 16*0, width: 16, height: 16 },
                    { x: 16*5, y: 16*1, width: 16, height: 16 },
                    { x: 16*6, y: 16*0, width: 16, height: 16 },
                    { x: 16*6, y: 16*1, width: 16, height: 16 },
                ]},
                { tag: "shrub",      cls: "VarSprite", variations: [
                   // { x: 16*0, y: 16*2, width: 16, height: 16 },
                   // { x: 16*1, y: 16*2, width: 32, height: 32 },
                   // { x: 16*3, y: 16*2, width: 32, height: 32 },
                    { x: 16*5, y: 16*2, width: 32, height: 32 },
                    { x: 16*7, y: 16*2, width: 32, height: 32 }
                ]},
                { tag: "seaShell",      cls: "VarSprite", variations: [
                     { x: 16*0, y: 16*4, width: 16, height: 16 },
                     { x: 16*1, y: 16*4, width: 16, height: 16 },
                     { x: 16*2, y: 16*4, width: 16, height: 16 },
                     { x: 16*3, y: 16*4, width: 16, height: 16 },
                     { x: 16*4, y: 16*4, width: 16, height: 16 },
                     { x: 16*5, y: 16*4, width: 16, height: 16 },
                     { x: 16*6, y: 16*4, width: 16, height: 16 },
                     { x: 16*7, y: 16*4, width: 16, height: 16 },
                     { x: 16*8, y: 16*4, width: 16, height: 16 } 
                ]},
                { tag: "fern",      cls: "VarSprite", variations: [
                    { x: 16*4, y: 16*6, width: 32, height: 32 } 
               ]},

            ]},

            { src: "img/flowerpot1.png", loader: "Sheet", refs: [
                { tag: "flowerpot1.idle",  cls: "Sprite", x: 16*0, y: 16*0, width: 16*2, height: 16*2 },
                { tag: "flowerpot1.sparked", cls: "Animation", loop: false, cels: [
                    { x: 16*0, y: 16*0, width: 32, height: 32, ttl: 400 },
                    { x: 16*2, y: 16*0, width: 32, height: 32, ttl: 700 }, 
                    { x: 16*4, y: 16*0, width: 32, height: 32, ttl: 900 },
                    { x: 16*6, y: 16*0, width: 32, height: 32, ttl: 900 },
                    { x: 16*0, y: 16*2, width: 32, height: 32, ttl: 900 },
                    { x: 16*2, y: 16*2, width: 32, height: 32, ttl: 900 },
                    { x: 16*4, y: 16*2, width: 32, height: 32, ttl: 900 },
                    { x: 16*6, y: 16*2, width: 32, height: 32, ttl: 200 },
                ]},
            ]},

            { tag: "flowerpot1", 
                cls: "Animator", 
                animations: { 
                    [ModelState.idle]: { cls: "Media", tag: "flowerpot1.idle" }, 
                    [ModelState.sparked]: { cls: "Media", tag: "flowerpot1.sparked" }, 
                },
            },

            { src: "img/waves.png", loader: "Sheet", refs: [
                { tag: "waves", cls: "SyncAnimation", syncTag: "waves", loop: true, cels: [
                    { x: 16*0, y: 16*0, width: 16, height: 16, ttl: 200 },
                    { x: 16*1, y: 16*0, width: 16, height: 16, ttl: 200 },
                    { x: 16*2, y: 16*0, width: 16, height: 16, ttl: 200 },
                    { x: 16*3, y: 16*0, width: 16, height: 16, ttl: 200 },
                    { x: 16*4, y: 16*0, width: 16, height: 16, ttl: 200 },
                    { x: 16*5, y: 16*0, width: 16, height: 16, ttl: 200 },
                    { x: 16*6, y: 16*0, width: 16, height: 16, ttl: 200 },
                    { x: 16*7, y: 16*0, width: 16, height: 16, ttl: 200 },
                ]},
            ]},

            { src: "img/object1.png", loader: "Sheet", refs: [
                {tag: "stool", cls: "Sprite", width: 16*2, height: 16*3, x: 16*0, y: 16*0 },
                {tag: "table", cls: "Sprite", width: 16*2, height: 16*3, x: 16*2, y: 16*0 },
                {tag: "bed.empty", cls: "Sprite", width: 16*2, height: 16*4, x: 16*4, y: 16*0 },
                {tag: "bed.occupied", cls: "Sprite", width: 16*2, height: 16*4, x: 16*6, y: 16*0 },
                {tag: "basket", cls: "Sprite", width: 16*2, height: 16*4, x: 16*6, y: 16*0 },
                Templates.xsprite("basket", 8, 0, {width: 32, height: 48}),
                Templates.xsprite("barrel", 10, 0, {width: 32, height: 48}),
                Templates.xsprite("halfTable", 12, 0, {width: 32, height: 32}),
                Templates.xsprite("crate", 14, 0, {width: 16, height: 32}),
                Templates.xsprite("halfCrate", 15, 0, {width: 16, height: 32}),
                Templates.xsprite("apple", 12, 2),
                Templates.xsprite("strawberry", 13, 2),
                Templates.xsprite("shadow34", 14, 2),
                Templates.xsprite("shadow", 15, 2),
                Templates.xsprite("post", 0, 4, {height: 48}),
                Templates.xsprite("post.s", 1, 4, {height: 48}),
                Templates.xsprite("vendorBench",        2, 5, {width: 48, height: 32}),
                Templates.xsprite("postUpper.l",        0, 7, {width: 32 }),
                Templates.xsprite("postUpper.s",        2, 7),
                Templates.xsprite("postUpper.r",        3, 7, {width: 32 }),
                Templates.xsprite("sparkbase.idle",     5, 4, {width: 32, height: 48}),
                Templates.xsprite("sparkbase.sparked",  7, 4, {width: 32, height: 48}),
                Templates.xsprite("sparkbase.powered",  9, 4, {width: 32, height: 48}),
                Templates.xsprite("relay.idle",         11, 4, {width: 32, height: 48}),
                Templates.xsprite("relay.sparked",      13, 4, {width: 32, height: 48}),
                Templates.xsprite("relay.powered",      11, 7, {width: 32, height: 48}),
                Templates.xsprite("spark",              0, 3),
            ]},

            { src: "img/stuccoWalls1.png", loader: "Sheet", refs: [
                {tag: "woodDoor.close", cls: "Sprite", width: 16*4, height: 16*5, x: 16*11, y: 16*0 },
                {tag: "woodDoor.open", cls: "Sprite", width: 16*4, height: 16*5, x: 16*11, y: 16*6 },
            ]},

            { src: "img/stuccoWalls2.png", loader: "Sheet", refs: [
                {tag: "woodDoor.top", cls: "Sprite", width: 16*4, height: 16*2, x: 16*11, y: 16*1 },
            ]},

            { tag: "sparkbase", 
                cls: "Animator", 
                animations: { 
                    [ModelState.idle]: { cls: "Media", tag: "sparkbase.idle" }, 
                    [ModelState.sparked]: { cls: "Media", tag: "sparkbase.sparked" }, 
                    [ModelState.powered]: { cls: "Media", tag: "sparkbase.powered" }, 
                },
            },

            { tag: "relay", 
                cls: "Animator", 
                animations: { 
                    [ModelState.idle]: { cls: "Media", tag: "relay.idle" }, 
                    [ModelState.sparked]: { cls: "Media", tag: "relay.sparked" }, 
                    [ModelState.powered]: { cls: "Media", tag: "relay.powered" }, 
                },
            },

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
                {tag: "btnGoldTranS1", cls: "StretchSprite", width: 50, height: 50, x: 50*0, y: 50*1, border: 15 },
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

            { src: "img/fairy.png", loader: "Sheet", refs: [
                Templates.xsprite("fairy.static_south", 0, 0, {width: 48, height: 32}),
                Templates.anim("fairy.idle_south", {offx:0, offy: 0, width: 48, height:32, duration: 200, frames: 4}),
                Templates.anim("fairy.idle_north", {offx:48*1, offy: 0, width: 48, height:32, duration: 200, frames: 4}),
                Templates.anim("fairy.idle_west", {offx:48*2, offy: 0, width: 48, height:32, duration: 200, frames: 4}),
                Templates.anim("fairy.idle_east", {offx:48*3, offy: 0, width: 48, height:32, duration: 200, frames: 4}),
                Templates.anim("fairy.takeoff_south", {offx:48*4, offy: 0, width: 48, height:32, duration: 100, frames: 4, loop: false}),
                Templates.anim("fairy.takeoff_north", {offx:48*5, offy: 0, width: 48, height:32, duration: 100, frames: 4, loop: false}),
                Templates.anim("fairy.takeoff_west", {offx:48*6, offy: 0, width: 48, height:32, duration: 100, frames: 4, loop: false}),
                Templates.anim("fairy.takeoff_east", {offx:48*7, offy: 0, width: 48, height:32, duration: 100, frames: 4, loop: false}),
                Templates.anim("fairy.fly_south", {offx:48*8, offy: 0, width: 48, height:32, duration: 50, frames: 6}),
                Templates.anim("fairy.fly_north", {offx:48*9, offy: 0, width: 48, height:32, duration: 50, frames: 6}),
                Templates.anim("fairy.fly_west", {offx:48*10, offy: 0, width: 48, height:32, duration: 50, frames: 6}),
                Templates.anim("fairy.fly_east", {offx:48*11, offy: 0, width: 48, height:32, duration: 50, frames: 6}),
                Templates.anim("fairy.cast_south", {offx:48*12, offy: 0, width: 48, height:32, duration: 50, frames: 8, loop: false}),
                Templates.anim("fairy.cast_north", {offx:48*13, offy: 0, width: 48, height:32, duration: 50, frames: 8, loop: false}),
                Templates.anim("fairy.cast_west", {offx:48*14, offy: 0, width: 48, height:32, duration: 50, frames: 8, loop: false}),
                Templates.anim("fairy.cast_east", {offx:48*15, offy: 0, width: 48, height:32, duration: 50, frames: 8, loop: false}),
            ]},

            { tag: "fairy",               cls: "Animator", animations: {
                    [ModelState.idle]:         { cls: "Media", tag: "fairy.idle_south" },
                    [ModelState.idle_south]:   { cls: "Media", tag: "fairy.idle_south" },
                    [ModelState.idle_north]:   { cls: "Media", tag: "fairy.idle_north" },
                    [ModelState.idle_west]:    { cls: "Media", tag: "fairy.idle_west" },
                    [ModelState.idle_east]:    { cls: "Media", tag: "fairy.idle_east" },
                    [ModelState.walk_south]:   { cls: "Media", tag: "fairy.fly_south" },
                    [ModelState.walk_north]:   { cls: "Media", tag: "fairy.fly_north" },
                    [ModelState.walk_west]:    { cls: "Media", tag: "fairy.fly_west" },
                    [ModelState.walk_east]:    { cls: "Media", tag: "fairy.fly_east" },
                    [ModelState.cast_south]:   { cls: "Media", tag: "fairy.cast_south" },
                    [ModelState.cast_north]:   { cls: "Media", tag: "fairy.cast_north" },
                    [ModelState.cast_west]:    { cls: "Media", tag: "fairy.cast_west" },
                    [ModelState.cast_east]:    { cls: "Media", tag: "fairy.cast_east" },
                    [ModelState.sparked_south]:   { cls: "Media", tag: "fairy.idle_south" },
                    [ModelState.sparked_north]:   { cls: "Media", tag: "fairy.idle_north" },
                    [ModelState.sparked_west]:    { cls: "Media", tag: "fairy.idle_west" },
                    [ModelState.sparked_east]:    { cls: "Media", tag: "fairy.idle_east" },
                    'idle_south:walk_south':   { cls: "Media", tag: "fairy.takeoff_south" },
                    'idle_north:walk_north':   { cls: "Media", tag: "fairy.takeoff_north" },
                    'idle_east:walk_east':   { cls: "Media", tag: "fairy.takeoff_east" },
                    'idle_west:walk_west':   { cls: "Media", tag: "fairy.takeoff_west" },
            }},

        ];

        this.assets = [

            Templates.tile("002", "sand"),
            Templates.tile("003", "road"),
            Templates.tile("004", "brickFloor"),
            Templates.tile("005", "woodDoor.top", { offx: 24, offy: -8}),
            Templates.tile("006", "basket"),
            Templates.tile("007", "barrel", {xxform: {dx:8}}),
            Templates.tile("008", "halfTable", {xxform: {dx:8}}),
            Templates.tile("009", "crate", { xcollider: {} }),
            Templates.tile("00a", "halfCrate", { xcollider: {} }),
            Templates.tile("00b", "apple"),
            Templates.tile("00c", "strawberry"),
            Templates.tile("00d", "shadow34"),
            Templates.tile("00e", "shadow"),
            Templates.tile("00f", "post"),
            Templates.tile("00g", "post.l", { mediaTag: "post", offx: -6, offy: -16, xcollider: { width: 4, height: 16, offy: 16 } }),
            Templates.tile("00h", "post.r", { mediaTag: "post", offx: 5, offy: -16, xcollider: { width: 4, height: 16, offy: 16 } }),
            Templates.tile("00j", "post.sr", { mediaTag: "post.s", offx: 8, offy: -16, xcollider: { width: 4, height: 16, offy: 16 } }),
            Templates.tile("00l", "postUpper.l", { offx: 8 }),
            Templates.tile("00m", "postUpper.s", { offx: 8 }),
            Templates.tile("00n", "postUpper.r", { offx: 8 }),
            Templates.tile("00o", "rock"), 
            Templates.tile("00p", "shrub"),
            Templates.tile("00q", "flowerpot1", { xcollider: { width: 24, height: 24}, sparkable: true}),
            Templates.tile("00r", "wildFlower"), 
            Templates.tile("00s", "seaShell"),
            Templates.tile("00t", "waves"),
            Templates.tile("00u", "fern"),

            Templates.object("o00", "sparkbase", "SparkBase", { 
                powered: true,
                offy: -16, 
                xcollider: { width: 28, height: 32, offy: 4} 
            }),

            Templates.object("o01", "woodDoor", "Door", {
                offx: 24, offy: -32,
                xopenSfx: { cls: "Media", tag: "doorOpening"}, 
                xcloseSfx: { cls: "Media", tag: "doorClosing"}, 
                xcollider: { offy: 24, width:48, height:24 }, 
            }),

            Templates.object("o02", "stool", "Chair", {
                offx: 8, offy: -12,
                xcollider: { width: 14, height: 14 }, 
                occupiedDir: Direction.east, 
                occupiedOffX: 10, occupiedOffY: -14 
            }),

            Templates.tile("o03", "table", {
                offx: 8, offy: -8,
                xcollider: { width: 24, height: 24 }, 
            }),

            Templates.object("o04", "bed", "Bed", {
                offx: 8, offy: -24,
                reserveTag: "bob",
                xcollider: { width: 24, height: 48 }, 
                occupiedOffX: 8, occupiedOffY: -22,
            }),

            Templates.object("o05", "relay", "SparkRelay", { 
                offy: -16, 
                xcollider: {width:10, height:20, offy: 10}, 
            }),

            Templates.object("o06", "vendorBench", "Workstation", {
                offy: -8,
                occupiedDir: Direction.south, 
                occupiedOffX: 0, occupiedOffY: -24,
                approachOffsets: [
                    {x: 0, y: -32 },
                ],
                xcollider: { width: 32, height: 16 },
            }),

            { tag: "spark", cls: "SparkProjectile", 
                xcollider: { blocking: Collider.projectile, width:8, height:8, color: "rgba(0,0,127,.5)" },
                xsketch: { cls: "Media", tag: "spark"}, 
            },

            Templates.object("c01", "player", "Character", {
                mediaTag: "fairy",
                offy: -8,
                xcollider: { blocking: Collider.player, width:14, height:10, offy:8, color: "rgba(0,0,127,.5)" },
            }),

            Templates.object("c02", "npc", "Character", {
                mediaTag: "gnome",
                ctrlId: 0,
                offy: -16,
                bedTag: "bob",
                workstationTag: "bob",
                xcollider: { blocking: Collider.player, width:14, height:16, offy:16, color: "rgba(0,0,127,.5)" },
                xactivitySchedule: Templates.testSchedule,
                xai: { 
                    cls: "AiState",
                    xdirectives: [
                        Templates.aiWakeDirective,
                        Templates.aiWorkDirective,
                        Templates.aiRelaxDirective,
                        Templates.aiSleepDirective,
                    ],
                    xschemes: [
                        "WantBedScheme",
                        "FindScheme",
                        "MoveScheme",
                        "OccupyScheme",
                        "SleepAtBedScheme",
                        "WakeScheme",
                        "WantWorkstationScheme",
                        "WorkAtStationScheme",
                        "LeaveWorkstationScheme",
                    ]
                },
            }),

        ];

        this.assets = this.assets.concat(Templates.overlayTiles("01", "oceanDeep"));
        this.assets = this.assets.concat(Templates.overlayTiles("02", "grass"));
        this.assets = this.assets.concat(Templates.overlayTiles("03", "ocean"));
        this.assets = this.assets.concat(Templates.overlayTiles("04", "oceanMid"));
        this.assets = this.assets.concat(Templates.wallTiles("05", "stuccoWalls1", Templates.wallColliders()));
        this.assets = this.assets.concat(Templates.wallTiles("06", "stuccoWalls2"));
        this.assets = this.assets.concat(Templates.frontRoofTiles("rf", "roof.f"));
        this.assets = this.assets.concat(Templates.backRoofTiles("rb", "roof.b"));
        this.assets = this.assets.concat(Templates.leftRoofTiles("rl", "roof.l"));
        this.assets = this.assets.concat(Templates.rightRoofTiles("rr", "roof.r"));
    }
}