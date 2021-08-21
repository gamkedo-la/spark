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
            { src: "snd/gameplayMusic.mp3", loader: "Audio", tag: "gameplayMusic", volume: .5, loop: true },
            { src: "snd/doorClosing.mp3", loader: "Audio", tag: "doorClosing" },
            { src: "snd/doorOpenning.mp3", loader: "Audio", tag: "doorOpening" },
            { src: "snd/fairyChimes.mp3", loader: "Audio", tag: "chimes", volume: .1, loop: true },
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
            { src: "img/vendorHouse.png", loader: "Sheet", refs: [
                Templates.varSpriteRef("greenWoodFloor", [[0,0], [1,0], [2,0], [3,0]], ),
                Templates.xsprite("vhouseBack1", 2, 2, {height: 16*5}),
                Templates.xsprite("vhouseBack2", 3, 1, {height: 16*6}),
                Templates.xsprite("vhouseBack3", 4, 1, {height: 16*6}),
                Templates.xsprite("vhouseBack4", 5, 1, {height: 16*6}),
                Templates.xsprite("vhouseBack5", 6, 0, {height: 16*6}),
                Templates.xsprite("vhouseBack6", 7, 0, {height: 16*6}),
                Templates.xsprite("vhouseBack7", 8, 0, {height: 16*6}),
                Templates.xsprite("vhouseBack8", 9, 0, {height: 16*6}),
                Templates.xsprite("vhouseBack9", 10, 0, {height: 16*6}),
                Templates.xsprite("vhouseBack10", 11, 0, {height: 16*6}),
                Templates.xsprite("vhouseBack11", 12, 0, {height: 16*6}),
                Templates.xsprite("vhouseBack12", 13, 1, {height: 16*6}),
                Templates.xsprite("vhouseBack13", 14, 1, {height: 16*6}),
                Templates.xsprite("vhouseBack14", 15, 1, {height: 16*6}),
                Templates.xsprite("vhouseBack15", 16, 2, {height: 16*5}),
                Templates.xsprite("vhouseFront1", 2, 7, {height: 16*4}),
                Templates.xsprite("vhouseFront2", 3, 7, {height: 16*5}),
                Templates.xsprite("vhouseFront3", 4, 8, {height: 16*5}),
                Templates.xsprite("vhouseFront4", 5, 8, {height: 16*4}),
                Templates.xsprite("vhouseFront5", 6, 8, {height: 16*5}),
                Templates.xsprite("vhouseFront6", 7, 9, {height: 16*4}),
                Templates.xsprite("vhouseDoor.close", 8, 8, {height: 16*5, width: 16*3}),
                Templates.xsprite("vhouseFront8", 11, 9, {height: 16*4}),
                Templates.xsprite("vhouseFront9", 12, 8, {height: 16*5}),
                Templates.xsprite("vhouseFront10", 13, 8, {height: 16*4}),
                Templates.xsprite("vhouseFront11", 14, 8, {height: 16*5}),
                Templates.xsprite("vhouseFront12", 15, 7, {height: 16*5}),
                Templates.xsprite("vhouseFront13", 16, 7, {height: 16*4}),

                Templates.xsprite("vhouseRoof", 2, 13, {width: 16*15, height: 16*12}),

                Templates.xsprite("vhousePorch1", 5, 25, {height: 16*2}),
                Templates.xsprite("vhousePorch2", 6, 25, {height: 16*3}),
                Templates.xsprite("vhousePorch3", 7, 25, {height: 16*4}),
                Templates.xsprite("vhousePorch4", 8, 25, {height: 16*4}),
                Templates.xsprite("vhousePorch5", 9, 25, {height: 16*4}),
                Templates.xsprite("vhousePorch6", 10, 25, {height: 16*4}),
                Templates.xsprite("vhousePorch7", 11, 25, {height: 16*4}),
                Templates.xsprite("vhousePorch8", 12, 25, {height: 16*3}),
                Templates.xsprite("vhousePorch9", 13, 25, {height: 16*2}),

            ]},

            Templates.overlayMedia("img/grass.png", "grass", {"height": 16, "width": 16, kw: ["overlay"]}),
            Templates.overlayMedia("img/ocean.png", "ocean", {"height": 16, "width": 16, kw: ["overlay"]}),
            Templates.overlayMedia("img/oceanMid.png", "oceanMid", {"height": 16, "width": 16, kw: ["overlay"]}),
            Templates.overlayMedia("img/oceanDeep.png", "oceanDeep", {"height": 16, "width": 16, kw: ["overlay"]}),
            Templates.wallMedia("img/stuccoWalls1.png", "stuccoWalls1", {"height": 16, "width": 16, offy:16, kw: ["wall"]}),
            Templates.wallMedia("img/stuccoWalls2.png", "stuccoWalls2", {"height": 16, "width": 16, kw: ["wall"]}),
            Templates.roofMedia("img/roof.png", "roof.l", "roof.r", "roof.f", "roof.b", {"height": 16, "width": 16, kw: ["roof"]}),
            Templates.wallMedia("img/stoneWalls.png", "stoneWalls", {"height": 16, "width": 16, kw: ["wall"]}),

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
               { tag: "stairs",      cls: "VarSprite", variations: [
                { x: 16*0, y: 16*6, width: 48, height: 32 } 
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
                //{tag: "basket", cls: "Sprite", width: 16*2, height: 16*4, x: 16*6, y: 16*0 },
                Templates.xsprite("roundBasket", 8, 0, {width: 32, height: 48}),
                //Templates.xsprite("barrel", 10, 0, {width: 32, height: 48}),
                //Templates.xsprite("halfTable", 12, 0, {width: 32, height: 32}),
                //Templates.xsprite("crate", 14, 0, {width: 16, height: 32}),
                //Templates.xsprite("halfCrate", 15, 0, {width: 16, height: 32}),
                //Templates.xsprite("apple", 12, 2),
                Templates.xsprite("strawberry", 13, 2),
                Templates.xsprite("shadow34", 14, 2),
                Templates.xsprite("shadow", 15, 2),
                Templates.xsprite("post", 0, 4, {height: 48}),
                Templates.xsprite("post.s", 1, 4, {height: 48}),
                //Templates.xsprite("vendorBench",        2, 5, {width: 48, height: 32}),
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
                Templates.xsprite("stove",              0, 8, {width:32, height: 48}),
            ]},

            { src: "img/vendor.png", loader: "Sheet", refs: [
                Templates.xsprite("barrel",             0, 0, {width: 32, height: 48}),
                Templates.xsprite("barrelCabbage",      2, 0, {width: 32, height: 48}),
                Templates.xsprite("crate",              4, 0, {width: 16, height: 32}),
                Templates.xsprite("crateApple",         5, 0, {width: 16, height: 32}),
                Templates.xsprite("crateBlueberry",     6, 0, {width: 16, height: 32}),
                Templates.xsprite("apple",              7, 0, {width: 16, height: 16}),
                Templates.xsprite("blueberry",          8, 0, {width: 16, height: 16}),
                Templates.varSpriteRef("fish",          [[9,0], [10,0], [11,0]], { height: 32 }),
                Templates.varSpriteRef("potato",        [[12,0], [13,0], [14,0]], ),
                Templates.xsprite("lampOff",            15, 0, {width: 16, height: 16}),
                Templates.xsprite("lampOn",             16, 0, {width: 16, height: 16}),
                Templates.xsprite("fishTail",           17, 0, {width: 16, height: 32}),
                Templates.xsprite("bread",              7, 1, {width: 16, height: 16}),
                Templates.xsprite("halfcrate",          4, 2, {width: 16, height: 32}),
                Templates.xsprite("halfcrateApple",     5, 2, {width: 16, height: 32}),
                Templates.xsprite("halfcrateBlueberry", 6, 2, {width: 16, height: 32}),
                Templates.xsprite("bag",                7, 2, {width: 16, height: 32}),
                Templates.xsprite("lamppostRightOn",    8, 2, {width: 32, height: 64}),
                Templates.xsprite("lamppostRightOff",   10, 2, {width: 32, height: 64}),
                Templates.xsprite("lamppostLeftOn",     12, 2, {width: 32, height: 64}),
                Templates.xsprite("lamppostLeftOff",    14, 2, {width: 32, height: 64}),
                Templates.xsprite("sack",               0, 3, {width: 32, height: 32}),
                Templates.xsprite("table1x2",           2, 3, {width: 16, height: 48}),
                Templates.xsprite("basket",             3, 4, {width: 32, height: 32}),
                Templates.xsprite("basketPotatoes",     5, 4, {width: 32, height: 32}),
                Templates.xsprite("table2x1",           0, 5, {width: 32, height: 32}),
                Templates.xsprite("largePost",          0, 7, {width: 16, height: 48}),
                Templates.xsprite("smallPostBCross",    1, 7, {width: 16, height: 48}),
                Templates.xsprite("postLine",           2, 7, {width: 80, height: 64}),
                Templates.xsprite("smallPostFCross",    1, 10, {width: 16, height: 48}),
                Templates.xsprite("vendorRoof",         2, 15, {width: 16*8, height: 16*8}),
                Templates.xsprite("crateCluster",       18, 0, {width: 16*5, height: 16*4}),
                Templates.xsprite("barrelCluster",      23, 0, {width: 16*4, height: 16*4}),
                Templates.xsprite("cabbagePotatoCluster", 27, 0, {width: 16*3, height: 16*4}),
                Templates.xsprite("vendorBench",        30, 0, {width: 16*2, height: 16*3}),
                Templates.xsprite("appleBlueberryBench", 32, 0, {width: 16, height: 16*4}),
                Templates.xsprite("postFishline",       33, 0, {width: 16*5, height: 16*4}),
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

            { tag: "lamp", 
                cls: "Animator", 
                animations: { 
                    [ModelState.idle]: { cls: "Media", tag: "lampOff" }, 
                    [ModelState.sparked]: { cls: "Media", tag: "lampOn" }, 
                },
            },

            { tag: "lamppostLeft", 
                cls: "Animator", 
                animations: { 
                    [ModelState.idle]: { cls: "Media", tag: "lamppostLeftOff" }, 
                    [ModelState.sparked]: { cls: "Media", tag: "lamppostLeftOn" }, 
                },
            },

            { tag: "lamppostRight", 
                cls: "Animator", 
                animations: { 
                    [ModelState.idle]: { cls: "Media", tag: "lamppostRightOff" }, 
                    [ModelState.sparked]: { cls: "Media", tag: "lamppostRightOn" }, 
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
                {tag: "gnome.idle_south",    cls: "Sprite", width: 32, height: 64, x: 32*0, y: 64*7 },
                {tag: "gnome.idle_north",    cls: "Sprite", width: 32, height: 64, x: 32*1, y: 64*7 },
                {tag: "gnome.idle_west",     cls: "Sprite", width: 32, height: 64, x: 32*2, y: 64*7 },
                {tag: "gnome.idle_east",     cls: "Sprite", width: 32, height: 64, x: 32*3, y: 64*7 },
                Templates.anim("gnome.walk_south", {offx:0, width: 32, height:64, duration: 70}),
                Templates.anim("gnome.walk_north", {offx:32, width: 32, height:64, duration: 70}),
                Templates.anim("gnome.walk_west", {offx:64, width: 32, height:64, duration: 70}),
                Templates.anim("gnome.walk_east", {offx:96, width: 32, height:64, duration: 70}),
                {tag: "gnome.sleep_south",    cls: "Sprite", width: 32, height: 64, x: 32*4, y: 64*0 },
                {tag: "gnome.seated_south",    cls: "Sprite", width: 32, height: 64, x: 32*8, y: 64*0 },
                {tag: "gnome.seated_north",    cls: "Sprite", width: 32, height: 64, x: 32*9, y: 64*0 },
                {tag: "gnome.seated_west",     cls: "Sprite", width: 32, height: 64, x: 32*10, y: 64*0 },
                {tag: "gnome.seated_east",     cls: "Sprite", width: 32, height: 64, x: 32*11, y: 64*0 },
                Templates.anim("gnome.eating_south", {frames: 9, offx:32*12, width: 32, height:64, duration: 70}),
                Templates.anim("gnome.eating_north", {frames: 9, offx:32*13, width: 32, height:64, duration: 70}),
                Templates.anim("gnome.eating_west", {frames: 9, offx:32*14, width: 32, height:64, duration: 70}),
                Templates.anim("gnome.eating_east", {frames: 9, offx:32*15, width: 32, height:64, duration: 70}),
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
                    [ModelState.seated_south]: { cls: "Media", tag: "gnome.seated_south" },
                    [ModelState.seated_north]: { cls: "Media", tag: "gnome.seated_north" },
                    [ModelState.seated_west]: { cls: "Media", tag: "gnome.seated_west" },
                    [ModelState.seated_east]: { cls: "Media", tag: "gnome.seated_east" },
                    [ModelState.eating_south]: { cls: "Media", tag: "gnome.eating_south" },
                    [ModelState.eating_north]: { cls: "Media", tag: "gnome.eating_north" },
                    [ModelState.eating_west]:  { cls: "Media", tag: "gnome.eating_west" },
                    [ModelState.eating_east]:  { cls: "Media", tag: "gnome.eating_east" },
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
            Templates.tile("006", "roundBasket"),
            Templates.tile("008", "halfTable", {xxform: {dx:8}}),
            //Templates.tile("009", "crate", { xcollider: {} }),
            //Templates.tile("00a", "halfCrate", { xcollider: {} }),
            //Templates.tile("00b", "apple"),
            Templates.tile("00c", "strawberry"),
            Templates.tile("00d", "shadow34"),
            Templates.tile("00e", "shadow"),
            Templates.tile("00f", "post"),
            Templates.tile("00g", "post.l", { mediaTag: "post", offx: -6, offy: -16, xcollider: { width: 4, height: 12, offy: 18 } }),
            Templates.tile("00h", "post.r", { mediaTag: "post", offx: 5, offy: -16, xcollider: { width: 4, height: 12, offy: 18 } }),
            Templates.tile("00j", "post.sr", { mediaTag: "post.s", offx: 8, offy: -16, xcollider: { width: 4, height: 12, offy: 18 } }),
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
            Templates.tile("00v", "stairs"),

            Templates.tile("00w", "crate", {offy: -8, xcollider: { width: 12, height: 12, offy: 4 }}),
            Templates.tile("00x", "apple"),
            Templates.tile("00y", "blueberry"),
            Templates.tile("00z", "fish", {offy: -8}),
            Templates.tile("00A", "potato"),
            Templates.tile("00B", "lamp"),
            Templates.tile("00C", "fishTail", {offy: -8}),
            Templates.tile("00D", "bread"),
            Templates.tile("00E", "halfcrate", {offy: -8, xcollider: { width: 12, height: 12, offy: 4 }}),
            Templates.tile("00F", "bag", {offy: -8}),
            Templates.tile("00G", "lamppostRight", {offx: 8, offy: -24, xcollider: { width: 10, height: 10, offy: 24, offx: -8 }}),
            Templates.tile("00H", "lamppostLeft", {offx: -8, offy: -24, xcollider: { width: 10, height: 10, offy: 24, offx: 8}}),
            Templates.tile("00I", "sack", {offx: 8, offy: -8, xcollider: { width: 28, height: 16, offy: 4 }}),
            Templates.tile("00J", "table1x2", {offy: -16}),
            Templates.tile("00K", "basket", {offx: 8, offy: -8 }),
            Templates.tile("00L", "table2x1", {offx: 8, offy: -8}),
            Templates.tile("00M", "largePost", {offy: -16, xcollider: { width: 10, height: 10, offy: 16 }}),
            Templates.tile("00N", "smallPostBCross", {offy: -16, xcollider: { width: 10, height: 10, offy: 16 }}),
            Templates.tile("00O", "smallPostFCross", {offy: -16, xcollider: { width: 10, height: 10, offy: 16 }}),
            Templates.tile("00P", "postLine", {offx: 32, offy: -24, xcollider: { cls: "ColliderSet", xitems: [{width: 10, height: 10}, {width: 10, height: 10, offx: 64}] }}),
            Templates.tile("00Q", "vendorRoof", {offx: 56, offy: -56}),

            Templates.tile("00R", "crateCluster", {offx: 32, offy: -24, xcollider: { width: 64, height: 32, offx: -4, offy: 4 }}),
            Templates.tile("00S", "barrelCluster", {offx: 24, offy: -24, xcollider: { width: 48, height: 40, offx: -4 }}),

            Templates.tile("00T", "barrel", { offx: 8, offy: -16, xcollider: { width: 24, height: 20, offy: 4 }}),
            Templates.tile("00U", "barrelCabbage", { offx: 8, offy: -16, xcollider: { width: 24, height: 20, offy: 4 }}),
            Templates.tile("00V", "crateApple", { offy: -8, xcollider: { width: 12, height: 12, offy: 4 }}),
            Templates.tile("00W", "crateBlueberry", { offy: -8, xcollider: { width: 12, height: 12, offy: 4 }}),
            Templates.tile("00X", "halfcrateApple", { offy: -8, xcollider: { width: 12, height: 12, offy: 4 }}),
            Templates.tile("00Y", "halfcrateBlueberry", { offy: -8, xcollider: { width: 12, height: 12, offy: 4 }}),
            Templates.tile("00Z", "basketPotatoes", { offx: 8, offy: -8, xcollider: { width: 24, height: 20, offy: 4 }}),

            Templates.tile("010", "greenWoodFloor"),
            Templates.tile("011", "vhouseBack1", {offy: -32}), //2, 2, {height: 16*5}),
            Templates.tile("012", "vhouseBack2", {offy: -40}), //3, 1, {height: 16*6}),
            Templates.tile("013", "vhouseBack3", {offy: -40}), //4, 1, {height: 16*6}),
            Templates.tile("014", "vhouseBack4", {offy: -40}), //5, 1, {height: 16*6}),
            Templates.tile("015", "vhouseBack5", {offy: -40}), //6, 0, {height: 16*6}),
            Templates.tile("016", "vhouseBack6", {offy: -40}), //7, 0, {height: 16*6}),
            Templates.tile("017", "vhouseBack7", {offy: -40}), //8, 0, {height: 16*6}),
            Templates.tile("018", "vhouseBack8", {offy: -40}), //9, 0, {height: 16*6}),
            Templates.tile("019", "vhouseBack9", {offy: -40}), //10, 0, {height: 16*6}),
            Templates.tile("01a", "vhouseBack10", {offy: -40}), //11, 0, {height: 16*6}),
            Templates.tile("01b", "vhouseBack11", {offy: -40}), //12, 0, {height: 16*6}),
            Templates.tile("01c", "vhouseBack12", {offy: -40}), //13, 1, {height: 16*6}),
            Templates.tile("01d", "vhouseBack13", {offy: -40}), //14, 1, {height: 16*6}),
            Templates.tile("01e", "vhouseBack14", {offy: -40}), //15, 1, {height: 16*6}),
            Templates.tile("01f", "vhouseBack15", {offy: -32}), //16, 0, {height: 16*5}),
            Templates.tile("01g", "vhouseFront1", {offy: -24}), //2, 7, {height: 16*4}),
            Templates.tile("01h", "vhouseFront2", {offy: -32}), //3, 7, {height: 16*5}),
            Templates.tile("01i", "vhouseFront3", {offy: -32}), //4, 8, {height: 16*5}),
            Templates.tile("01j", "vhouseFront4", {offy: -24}), //5, 8, {height: 16*4}),
            Templates.tile("01k", "vhouseFront5", {offy: -32}), //6, 8, {height: 16*4}),
            Templates.tile("01l", "vhouseFront6", {offy: -24}), //7, 9, {height: 16*3}),
            Templates.tile("01m", "vhouseDoor.close", {offx: 16, offy: -32}), //8, 8, {height: 16*4, width: 16*3}),
            Templates.tile("01n", "vhouseFront8", {offy: -24}), //11, 9, {height: 16*3}),
            Templates.tile("01o", "vhouseFront9", {offy: -32}), //12, 8, {height: 16*4}),
            Templates.tile("01p", "vhouseFront10", {offy: -24}), //13, 8, {height: 16*4}),
            Templates.tile("01q", "vhouseFront11", {offy: -32}), //14, 8, {height: 16*5}),
            Templates.tile("01r", "vhouseFront12", {offy: -32}), //15, 7, {height: 16*5}),
            Templates.tile("01s", "vhouseFront13", {offy: -24}), //16, 7, {height: 16*4}),

            Templates.tile("01t", "vhouseRoof", {offx: 112, offy: -88}), //2, 13, {width: 16*15, height: 16*12}),

            Templates.tile("01u", "vhousePorch1", {offy: -8}), //5, 25, {height: 16*2}),
            Templates.tile("01v", "vhousePorch2", {offy: -16}), //6, 25, {height: 16*3}),
            Templates.tile("01w", "vhousePorch3", {offy: -24}), //7, 25, {height: 16*4}),
            Templates.tile("01x", "vhousePorch4", {offy: -24}), //8, 25, {height: 16*4}),
            Templates.tile("01y", "vhousePorch5", {offy: -24}), //9, 25, {height: 16*4}),
            Templates.tile("01z", "vhousePorch6", {offy: -24}), //10, 25, {height: 16*4}),
            Templates.tile("01A", "vhousePorch7", {offy: -24}), //11, 25, {height: 16*4}),
            Templates.tile("01B", "vhousePorch8", {offy: -16}), //12, 25, {height: 16*3}),
            Templates.tile("01C", "vhousePorch9", {offy: -8}), //13, 25, {height: 16*2}),

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
                xcollider: { width: 24, height: 48 }, 
                occupiedOffX: 8, occupiedOffY: -22,
            }),

            Templates.object("o05", "relay", "SparkRelay", { 
                offy: -16, 
                xcollider: {width:10, height:20, offy: 10}, 
            }),

            Templates.object("o06", "xvendorBench", "Workstation", {
                offy: -8,
                occupiedDir: Direction.south, 
                occupiedOffX: 0, occupiedOffY: -24,
                approachOffsets: [
                    {x: 0, y: -32 },
                ],
                xcollider: { width: 32, height: 16 },
            }),

            Templates.object("o07", "stove", "Stove", {
                offx: 8, offy: -24,
                xcollider: { width: 32, height: 48 }, 
                occupiedOffX: 8, occupiedOffY: -22,
            }),

            Templates.object("o08", "cabbagePotatoCluster", "Stock", {offx: 12, offy: -24, xcollider: {width: 32, height: 40, offy: 8}}),
            Templates.object("o09", "vendorBench", "Workstation", {
                offx: 8, offy: -16,
                occupiedDir: Direction.south, 
                occupiedOffX: 0, occupiedOffY: -24,
                approachOffsets: [
                    {x: 0, y: -32 },
                ],
                xcollider: { width: 32, height: 20, offy: 4 },
            }),
            Templates.object("o0a", "appleBlueberryBench", "Stock", {offy: -24, xcollider: {width: 12, height: 40}}),
            Templates.object("o0b", "postFishline", "Stock", {offx: 32, offy: -24, xcollider: { cls: "ColliderSet", xitems: [{width: 10, height: 10}, {width: 10, height: 10, offx: 64}]}}),

            { tag: "spark", cls: "SparkProjectile", 
                xcollider: { blocking: Collider.projectile, width:8, height:8, color: "rgba(0,0,127,.5)" },
                xsketch: { cls: "Media", tag: "spark"}, 
            },

            Templates.object("c01", "player", "Character", {
                mediaTag: "fairy",
                ctrlId: 1,
                offy: -8,
                xcollider: { blocking: Collider.player, width:14, height:10, offy:8, color: "rgba(0,0,127,.5)" },
                xstateSfxs: {
                    [ModelState.walk]: { cls: "Media", tag: "chimes"}, 
                }
            }),

            Templates.object("c02", "npc", "Character", {
                mediaTag: "gnome",
                ctrlId: 0,
                offy: -16,
                ownerTag: "Aodhan",
                maxFedTTL: 30000,
                xcollider: { blocking: Collider.player, width:14, height:14, offy:18, color: "rgba(0,0,127,.5)" },
                xactivitySchedule: Templates.testSchedule,
                xai: { 
                    cls: "AiState",
                    xdirectives: [
                        Templates.aiWakeDirective,
                        Templates.aiWorkDirective,
                        Templates.aiRelaxDirective,
                        Templates.aiRestDirective,
                    ],
                    xschemes: [
                        "CloseAtStationScheme",
                        "EatAtChairScheme",
                        "FindScheme",
                        "GatherScheme",
                        "LeaveScheme",
                        //"LeaveWorkstationScheme",
                        "MoveScheme",
                        "OccupyScheme",
                        "OpenAtStationScheme",
                        "SleepAtBedScheme",
                        //"WakeScheme",
                        "RestockAtStockScheme",
                        "SweepAtDirtyScheme",
                        "WantBedScheme",
                        "WantChairScheme",
                        "WantDirtyScheme",
                        "WantStockScheme",
                        "WantStoveScheme",
                        "WantWorkstationScheme",
                        "WorkAtStationScheme",
                    ]
                },
            }),

        ];

        this.assets = this.assets.concat(Templates.overlayTiles("X1", "oceanDeep"));
        this.assets = this.assets.concat(Templates.overlayTiles("X2", "grass"));
        this.assets = this.assets.concat(Templates.overlayTiles("X3", "ocean"));
        this.assets = this.assets.concat(Templates.overlayTiles("X4", "oceanMid"));
        this.assets = this.assets.concat(Templates.wallTiles("X5", "stuccoWalls1", Templates.wallColliders()));
        this.assets = this.assets.concat(Templates.wallTiles("X6", "stuccoWalls2"));
        this.assets = this.assets.concat(Templates.wallTiles("X7", "stoneWalls"));
        this.assets = this.assets.concat(Templates.frontRoofTiles("rf", "roof.f"));
        this.assets = this.assets.concat(Templates.backRoofTiles("rb", "roof.b"));
        this.assets = this.assets.concat(Templates.leftRoofTiles("rl", "roof.l"));
        this.assets = this.assets.concat(Templates.rightRoofTiles("rr", "roof.r"));
    }
}