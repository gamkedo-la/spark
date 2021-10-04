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
            { src: "snd/gameplayMusic.mp3", loader: "Audio", tag: "gameplayMusic", volume: .5, loop: true, kind: "music" },
            { src: "snd/doorClosing.mp3", loader: "Audio", tag: "doorClosing" },
            { src: "snd/doorOpenning.mp3", loader: "Audio", tag: "doorOpening" },
            { src: "snd/fairyChimes.mp3", loader: "Audio", tag: "chimes", volume: .1, loop: true },
            { src: "snd/chime-solid.mp3", loader: "Audio", tag: "chimesHigh", volume: .1, loop: true },
            { src: "snd/hoverIn.mp3", loader: "Audio", tag: "hoverIn", loop: false },
            { src: "snd/hoverOut.mp3", loader: "Audio", tag: "hoverOut", loop: false },
            { src: "snd/selected.mp3", loader: "Audio", tag: "selected", loop: false },
            { src: "snd/grumble-1.mp3", loader: "Audio", tag: "grumble1", loop: false },
            { src: "snd/grumble-2.mp3", loader: "Audio", tag: "grumble2", loop: false },
            { src: "snd/grumble-3.mp3", loader: "Audio", tag: "grumble3", loop: false },
            { src: "snd/bless_us_all.mp3", loader: "Audio", tag: "cheer1", loop: false },
            { src: "snd/happy_heart.mp3", loader: "Audio", tag: "cheer2", loop: false },
            { src: "snd/we_are_lucky.mp3", loader: "Audio", tag: "cheer3", loop: false },
            { src: "snd/pillar_activation.mp3", loader: "Audio", tag: "pillarActivation", loop: false },
            // FIXME: for now music would be added the same as normal audio, but using the "loop" variable
            //{ src: "snd/testsong.mp3", loader: "Audio", tag: "testsong", loop: true },
            { src: "img/dislike-indicator.png", loader: "Image", tag: "dislike" },
            { src: "img/like-indicator.png", loader: "Image", tag: "like" },
            { src: "img/fountain.png", loader: "Sheet", refs: [
                Templates.anim("fountain.water", {width: 16*7, height:16*7, duration: 250, frames: 8}),
            ]},
            { src: "img/terrain1.png", loader: "Sheet", refs: [
                Templates.xvarsprite("road", [[0,0], [1,0], [2,0], [3,0]], ),
                Templates.xvarsprite("brickFloor", [[0,1], [1,1], [2,1], [3,1]], ),
                Templates.xvarsprite("sand", [[0,2], [1,2], [2,2], [3,2]], ),
                Templates.xsprite("road.l", 4, 0),
                Templates.xsprite("road.r", 5, 0),
                Templates.xsprite("brickFloor.l", 4, 1),
                Templates.xsprite("brickFloor.r", 5, 1),
            ]},
            { src: "img/vendorHouse.png", loader: "Sheet", refs: [
                Templates.xvarsprite("greenWoodFloor", [[0,0], [1,0], [2,0], [3,0]], ),
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
                Templates.xsprite("vhouseDoor.close", 8, 7, {height: 16*6, width: 16*3}),
                Templates.xsprite("vhouseFront8", 11, 9, {height: 16*4}),
                Templates.xsprite("vhouseFront9", 12, 8, {height: 16*5}),
                Templates.xsprite("vhouseFront10", 13, 8, {height: 16*4}),
                Templates.xsprite("vhouseFront11", 14, 8, {height: 16*5}),
                Templates.xsprite("vhouseFront12", 15, 7, {height: 16*5}),
                Templates.xsprite("vhouseFront13", 16, 7, {height: 16*4}),

                Templates.xsprite("vhouseRoof1", 2, 13, {width: 16*15, height: 16*10}),
                Templates.xsprite("vhouseRoof2.idle", 2, 23, {width: 16*3, height: 16*2}),
                Templates.xsprite("vhouseRoof3", 5, 23, {width: 16*3, height: 16*2}),
                Templates.xsprite("vhouseDoor.top.close", 8, 23, {width: 16*3, height: 16*2}),
                Templates.xsprite("vhouseRoof4", 11, 23, {width: 16*3, height: 16*2}),
                Templates.xsprite("vhouseRoof5.idle", 14, 23, {width: 16*3, height: 16*2}),

                Templates.xsprite("vhousePorch1", 5, 25, {height: 16*2}),
                Templates.xsprite("vhousePorch2", 6, 25, {height: 16*3}),
                Templates.xsprite("vhousePorch3", 7, 25, {height: 16*4}),
                Templates.xsprite("vhousePorch4", 8, 25, {height: 16*4}),
                Templates.xsprite("vhousePorch5", 9, 25, {height: 16*4}),
                Templates.xsprite("vhousePorch6", 10, 25, {height: 16*4}),
                Templates.xsprite("vhousePorch7", 11, 25, {height: 16*4}),
                Templates.xsprite("vhousePorch8", 12, 25, {height: 16*3}),
                Templates.xsprite("vhousePorch9", 13, 25, {height: 16*2}),
                Templates.xsprite("vhouseBed.empty", 17, 0, {height: 16*5, width: 16*3}),
                Templates.xsprite("vhouseBed.occupied", 20, 0, {height: 16*5, width: 16*3}),
                Templates.xsprite("vhouseTable", 23, 0, {height: 16*5, width: 16*3}),
                Templates.xsprite("vhouseDoor.open", 26, 0, {height: 16*6, width: 16*3}),
                Templates.xsprite("vhouseDoor.top.open", 17, 5, {width: 16*3, height: 16*2}),

                Templates.anim("vhouseRoof2.sparked", {offx:16*29, offy: 0, width: 48, height:32, duration: 250, frames: 8, loop: false}),
                Templates.anim("vhouseRoof5.sparked", {offx:16*33, offy: 0, width: 48, height:32, duration: 250, frames: 8, loop: false}),

                Templates.xsprite("vhouse.rune.idle", 17, 20, {width: 16*3, height: 16*3}),
                Templates.xsprite("vhouse.rune.sparked", 20, 20, {width: 16*3, height: 16*3}),
                Templates.xsprite("vhouse.rune.powered", 23, 20, {width: 16*3, height: 16*3}),
            ]},

            { src: "img/inn_base.png", loader: "Sheet", refs: [
                Templates.xsprite("inn.base.tl", 1, 4, {height: 16*3, width: 16*1}),
                Templates.xvarsprite("inn.base.t", [[2,4], [3,4], [4,4]], {height: 16*3, width: 16*1} ),
                Templates.xsprite("inn.base.tj", 15, 4, {height: 16*3, width: 16*1}),
                Templates.xsprite("inn.base.tr", 22, 4, {height: 16*3, width: 16*1}),
                Templates.xvarsprite("inn.base.lr", [[1,7], [1,8], [1,9], [1,10]], {height: 16*1, width: 16*1} ),
                Templates.xsprite("inn.base.entry1", 15, 7, {height: 16*6, width: 16*1}),
                Templates.xsprite("inn.base.bl", 1, 13, {height: 16*3, width: 16*1}),
                Templates.xsprite("inn.base.entry2", 7, 13, {height: 16*4, width: 16*4}),
                Templates.xsprite("inn.base.stairs", 5, 16, {height: 16*4, width: 16*2}),
                Templates.xsprite("inn.base.stairs.base.1", 7, 17, {height: 16*3, width: 16*3}),
                Templates.xsprite("inn.base.stairs.base.2", 10, 17, {height: 16*3, width: 16*2}),
                Templates.xsprite("inn.base.stairs.rail", 5, 20, {height: 16*5, width: 16*6}),
                Templates.xsprite("inn.base.room.tl", 15, 12, {height: 16*4, width: 16*1}),
                Templates.xsprite("inn.base.room.bl", 15, 16, {height: 16*3, width: 16*1}),
                Templates.xsprite("inn.base.entry3", 17, 12, {height: 16*4, width: 16*4}),
                Templates.xsprite("inn.base.room.tr", 22, 12, {height: 16*4, width: 16*1}),
                Templates.xsprite("inn.base.room.br", 22, 16, {height: 16*3, width: 16*1}),
                Templates.xsprite("inn.base.tower.tl", 16, 16, {height: 16*3, width: 16*2}),
                Templates.xsprite("inn.base.tower.tr", 20, 16, {height: 16*3, width: 16*2}),
                Templates.xsprite("inn.base.tower.b.1", 15, 19, {height: 16*6, width: 16*2}),
                Templates.xsprite("inn.base.tower.b.2", 17, 19, {height: 16*6, width: 16*1}),
                Templates.xsprite("inn.base.tower.b.3", 20, 19, {height: 16*6, width: 16*1}),
                Templates.xsprite("inn.base.tower.b.4", 21, 19, {height: 16*6, width: 16*2}),
                Templates.xsprite("inn.base.tower.relay.idle",         23, 21, {width: 32, height: 64}),
                Templates.xsprite("inn.base.tower.relay.sparked",      25, 21, {width: 32, height: 64}),
                Templates.xsprite("inn.base.tower.relay.powered",      27, 21, {width: 32, height: 64}),
            ]},

            { src: "img/inn_lvl1.png", loader: "Sheet", refs: [
                Templates.xsprite("inn.lvl1.tl", 1, 2, {height: 16*3, width: 16*1}),
                Templates.xsprite("inn.lvl1.t", 2, 2, {height: 16*3, width: 16*1} ),
                Templates.xsprite("inn.lvl1.tj", 15, 2, {height: 16*3, width: 16*1}),
                Templates.xsprite("inn.lvl1.tr", 22, 2, {height: 16*3, width: 16*1}),
                Templates.xsprite("inn.lvl1.l", 1, 5, {height: 16*1, width: 16*1} ),
                Templates.xsprite("inn.lvl1.r", 22, 5, {height: 16*1, width: 16*1} ),
                Templates.xsprite("inn.lvl1.entry1.t", 15, 5, {height: 16*3, width: 16*1}),
                Templates.xsprite("inn.lvl1.entry1.b", 15, 8, {height: 16*2, width: 16*1}),
                Templates.xsprite("inn.lvl1.bl", 1, 11, {height: 16*3, width: 16*1}),
                Templates.xsprite("inn.lvl1.entry2.l", 7, 11, {height: 16*6, width: 16*1}),
                Templates.xsprite("inn.lvl1.door.b.close", 8, 12, {height: 16*5, width: 16*2}),
                Templates.xsprite("inn.lvl1.entry2.r", 10, 11, {height: 16*6, width: 16*1}),
                Templates.xsprite("inn.lvl1.room.tl", 15, 10, {height: 16*4, width: 16*1}),
                Templates.xsprite("inn.lvl1.room.bl", 15, 14, {height: 16*3, width: 16*1}),
                Templates.xsprite("inn.lvl1.entry3", 17, 10, {height: 16*3, width: 16*4}),
                Templates.xsprite("inn.lvl1.room.tr", 22, 10, {height: 16*4, width: 16*1}),
                Templates.xsprite("inn.lvl1.room.br", 22, 14, {height: 16*3, width: 16*1}),
                Templates.xsprite("inn.lvl1.tower.tl", 16, 14, {height: 16*3, width: 16*2}),
                Templates.xsprite("inn.lvl1.tower.tr", 20, 14, {height: 16*3, width: 16*2}),
                Templates.xsprite("inn.lvl1.tower.b", 15, 17, {height: 16*6, width: 16*8}),
                Templates.xsprite("inn.lvl1.b", 2, 11, {height: 16*3, width: 16*1} ),
                Templates.xsprite("inn.lvl1.stairs", 23, 0, {height: 16*5, width: 16*5} ),
                Templates.xsprite("inn.lvl1.stairs.rail", 23, 5, {height: 16*3, width: 16*3} ),
                Templates.xsprite("inn.lvl1.door.b.open", 28, 0, {height: 16*5, width: 16*2} ),
            ]},

            { src: "img/icons.png", loader: "Sheet", refs: [
                Templates.xanim("downArrow", 0, 0, {duration: [500, 500/7], loop: false}),
                Templates.xanim("upArrow", 1, 0, {duration: [500, 500/7], loop: false}),
            ]},

            { tag: "inn.lvl1.door.b", 
                cls: "Animator", 
                animations: { 
                    [ModelState.close]: { cls: "Media", tag: "inn.lvl1.door.b.close" }, 
                    [ModelState.open]: { cls: "Media", tag: "inn.lvl1.door.b.open" }, 
                },
            },

            { tag: "vhouseBed", 
                cls: "Animator", 
                animations: { 
                    [ModelState.idle]: { cls: "Media", tag: "vhouseBed.empty" }, 
                    [ModelState.occupied]: { cls: "Media", tag: "vhouseBed.occupied" }, 
                },
            },

            { tag: "vhouseRoof2", 
                cls: "Animator", 
                animations: { 
                    [ModelState.idle]: { cls: "Media", tag: "vhouseRoof2.idle" }, 
                    [ModelState.sparked]: { cls: "Media", tag: "vhouseRoof2.sparked" }, 
                },
            },

            { tag: "vhouseRoof5", 
                cls: "Animator", 
                animations: { 
                    [ModelState.idle]: { cls: "Media", tag: "vhouseRoof5.idle" }, 
                    [ModelState.sparked]: { cls: "Media", tag: "vhouseRoof5.sparked" }, 
                },
            },

            { tag: "vhouseDoor", 
                cls: "Animator", 
                animations: { 
                    [ModelState.close]: { cls: "Media", tag: "vhouseDoor.close" }, 
                    [ModelState.open]: { cls: "Media", tag: "vhouseDoor.open" }, 
                },
            },

            { tag: "vhouseDoor.top", 
                cls: "Animator", 
                animations: { 
                    [ModelState.idle]: { cls: "Media", tag: "vhouseDoor.top.close" }, 
                    [ModelState.close]: { cls: "Media", tag: "vhouseDoor.top.close" }, 
                    [ModelState.open]: { cls: "Media", tag: "vhouseDoor.top.open" }, 
                },
            },

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

            { src: "img/bar.png", loader: "Sheet", refs: [
                Templates.xsprite("plate", 1, 0),
            ]},

            { src: "img/object1.png", loader: "Sheet", refs: [
                Templates.xsprite("stool", 0, 0, {width: 32, height: 32}),
                Templates.xsprite("table", 2, 0, {width: 32, height: 48}),
                Templates.xsprite("bed.empty", 4, 0, {width: 16*2, height: 16*4}),
                Templates.xsprite("bed.occupied", 6, 0, {width: 16*2, height: 16*4}),
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
                Templates.xsprite("postUpper.l",        0, 7, {width: 32 }),
                Templates.xsprite("postUpper.s",        2, 7),
                Templates.xsprite("postUpper.r",        3, 7, {width: 32 }),
                Templates.xsprite("sparkbase.idle",     5, 4, {width: 32, height: 48}),
                Templates.xsprite("sparkbase.sparked",  7, 4, {width: 32, height: 48}),
                Templates.xsprite("sparkbase.powered",  9, 4, {width: 32, height: 48}),
                Templates.xsprite("relay.idle",         11, 4, {width: 32, height: 48}),
                Templates.xsprite("relay.sparked",      13, 4, {width: 32, height: 48}),
                Templates.xsprite("relay.powered",      11, 7, {width: 32, height: 48}),
                Templates.xsprite("rockRelay.idle",      5, 7, {width: 32, height: 32}),
                Templates.xsprite("rockRelay.sparked",   7, 7, {width: 32, height: 32}),
                Templates.xsprite("rockRelay.powered",  9, 7, {width: 32, height: 32}),
                Templates.xsprite("floorRelay.idle",      5, 9, {width: 32, height: 32}),
                Templates.xsprite("floorRelay.sparked",   7, 9, {width: 32, height: 32}),
                Templates.xsprite("floorRelay.powered",  9, 9, {width: 32, height: 32}),
                Templates.xsprite("spark",              0, 3),
                Templates.xsprite("stove",              0, 8, {width:32, height: 48}),
                Templates.xsprite("fountain",           0, 11, {width:16*7, height: 16*7}),
                Templates.xsprite("fountain.top",       7, 11, {width:16*5, height: 16*3}),
                Templates.xvarsprite("bar",             [[0,18], [1,18], [2,18], [3,18]], { height: 32 }),
                Templates.xsprite("bar.ljoin",          4, 18, { height: 32 }),
                Templates.xsprite("bar.rend",           5, 18, { height: 32 }),
                Templates.xsprite("bar.beerstand",      7, 15, { width: 16*3, height: 16*4 }),
                Templates.xsprite("bar.stand",          10, 17, { width: 16*3, height: 16*2 }),
                Templates.xsprite("bar.smtable",        0, 20, { width: 16*2, height: 16*3 }),
                Templates.xsprite("bar.lgtable",        2, 20, { width: 16*2, height: 16*4 }),
                Templates.xsprite("bar.sidetable",      4, 20, { width: 16*2, height: 16*3 }),
                Templates.xsprite("bar.beer.empty",     10, 16, { width: 16*1, height: 16*1 }),
                Templates.xsprite("bar.beer.full",      11, 16, { width: 16*1, height: 16*1 }),
            ]},

            { src: "img/tower.png", loader: "Sheet", refs: [
                Templates.xsprite("tower.stub",             2, 6, {width: 16*8, height: 16*9}),
            ]},

            { src: "img/vendor.png", loader: "Sheet", refs: [
                Templates.xsprite("barrel",             0, 0, {width: 32, height: 48}),
                Templates.xsprite("barrelCabbage",      2, 0, {width: 32, height: 48}),
                Templates.xsprite("crate",              4, 0, {width: 16, height: 32}),
                Templates.xsprite("crateApple",         5, 0, {width: 16, height: 32}),
                Templates.xsprite("crateBlueberry",     6, 0, {width: 16, height: 32}),
                Templates.xsprite("apple",              7, 0, {width: 16, height: 16}),
                Templates.xsprite("blueberry",          8, 0, {width: 16, height: 16}),
                Templates.xvarsprite("fish",          [[9,0], [10,0], [11,0]], { height: 32 }),
                Templates.xvarsprite("potato",        [[12,0], [13,0], [14,0]], ),
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
                Templates.xsprite("woodDoor.left.close", 8, 7, {width: 16*3, height: 16*4}),
                Templates.xsprite("woodDoor.left.open",  6, 12, {width: 16*3, height: 16*4}),
                Templates.xsprite("woodDoor.right.close",9, 12, {width: 16*3, height: 16*4}),
                Templates.xsprite("woodDoor.right.open", 12, 12, {width: 16*3, height: 16*4}),
            ]},

            { src: "img/stuccoWalls2.png", loader: "Sheet", refs: [
                {tag: "woodDoor.top.open", cls: "Sprite", width: 16*4, height: 16*2, x: 16*7, y: 16*1 },
                {tag: "woodDoor.top.close", cls: "Sprite", width: 16*4, height: 16*2, x: 16*11, y: 16*1 },
            ]},

            { tag: "sparkbase", 
                cls: "Animator", 
                animations: { 
                    [ModelState.idle]: { cls: "Media", tag: "sparkbase.idle" }, 
                    [ModelState.sparked]: { cls: "Media", tag: "sparkbase.sparked" }, 
                    [ModelState.powered]: { cls: "Media", tag: "sparkbase.powered" }, 
                },
            },

            { tag: "inn.base.tower.relay", 
                cls: "Animator", 
                animations: { 
                    [ModelState.idle]: { cls: "Media", tag: "inn.base.tower.relay.idle" }, 
                    [ModelState.sparked]: { cls: "Media", tag: "inn.base.tower.relay.sparked" }, 
                    [ModelState.powered]: { cls: "Media", tag: "inn.base.tower.relay.powered" }, 
                },
            },

            { tag: "vhouse.rune", 
                cls: "Animator", 
                animations: { 
                    [ModelState.idle]: { cls: "Media", tag: "vhouse.rune.idle" }, 
                    [ModelState.sparked]: { cls: "Media", tag: "vhouse.rune.sparked" }, 
                    [ModelState.powered]: { cls: "Media", tag: "vhouse.rune.powered" }, 
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

            { tag: "rockRelay", 
                cls: "Animator", 
                animations: { 
                    [ModelState.idle]: { cls: "Media", tag: "rockRelay.idle" }, 
                    [ModelState.sparked]: { cls: "Media", tag: "rockRelay.sparked" }, 
                    [ModelState.powered]: { cls: "Media", tag: "rockRelay.powered" }, 
                },
            },

            { tag: "floorRelay", 
                cls: "Animator", 
                animations: { 
                    [ModelState.idle]: { cls: "Media", tag: "floorRelay.idle" }, 
                    [ModelState.sparked]: { cls: "Media", tag: "floorRelay.sparked" }, 
                    [ModelState.powered]: { cls: "Media", tag: "floorRelay.powered" }, 
                },
            },

            { tag: "woodDoor", 
                cls: "Animator", 
                animations: { 
                    [ModelState.close]: { cls: "Media", tag: "woodDoor.close" }, 
                    [ModelState.open]: { cls: "Media", tag: "woodDoor.open" }, 
                },
            },

            { tag: "woodDoor.top", 
                cls: "Animator", 
                animations: { 
                    [ModelState.idle]: { cls: "Media", tag: "woodDoor.top.close" }, 
                    [ModelState.close]: { cls: "Media", tag: "woodDoor.top.close" }, 
                    [ModelState.open]: { cls: "Media", tag: "woodDoor.top.open" }, 
                },
            },

            { tag: "woodDoor.left", 
                cls: "Animator", 
                animations: { 
                    [ModelState.close]: { cls: "Media", tag: "woodDoor.left.close" }, 
                    [ModelState.open]: { cls: "Media", tag: "woodDoor.left.open" }, 
                },
            },

            { tag: "woodDoor.right", 
                cls: "Animator", 
                animations: { 
                    [ModelState.close]: { cls: "Media", tag: "woodDoor.right.close" }, 
                    [ModelState.open]: { cls: "Media", tag: "woodDoor.right.open" }, 
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

            { src: "img/buttonOff.png", loader: "Sheet", refs: [
                {tag: "buttonOff", cls: "StretchSprite", width: 253, height: 56, x: 50*0, y: 50*0, border: 16 },
            ]},
            { src: "img/buttonHover.png", loader: "Sheet", refs: [
                {tag: "buttonHover", cls: "StretchSprite", width: 253, height: 56, x: 50*0, y: 50*0, border: 16 },
            ]},

            // a sheet of images
            { src: "img/goldButtonFrames.png", loader: "Sheet", refs: [
                {tag: "btnGoldOpaqS1", cls: "StretchSprite", width: 50, height: 50, x: 50*0, y: 50*0, border: 15 },
                {tag: "btnGoldOpaqS2", cls: "StretchSprite", width: 50, height: 50, x: 50*1, y: 50*0, border: 15 },
                {tag: "btnGoldOpaqS3", cls: "StretchSprite", width: 50, height: 50, x: 50*2, y: 50*0, border: 15 },
                {tag: "btnGoldOpaqS4", cls: "StretchSprite", width: 50, height: 50, x: 50*3, y: 50*0, border: 15 },
                {tag: "btnGoldTranS1", cls: "StretchSprite", width: 50, height: 50, x: 50*0, y: 50*1, border: 15 },
                {tag: "btnGoldTranS2", cls: "StretchSprite", width: 50, height: 50, x: 50*1, y: 50*1, border: 15 },
                {tag: "btnGoldTranS3", cls: "StretchSprite", width: 50, height: 50, x: 50*2, y: 50*1, border: 15 },
                {tag: "btnGoldTranS4", cls: "StretchSprite", width: 50, height: 50, x: 50*3, y: 50*1, border: 15 },
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

            { src: "img/innkeeper.png", loader: "Sheet", refs: [
                {tag: "innkeeper.idle_south",    cls: "Sprite", width: 32, height: 64, x: 32*0, y: 64*7 },
                {tag: "innkeeper.idle_north",    cls: "Sprite", width: 32, height: 64, x: 32*1, y: 64*7 },
                {tag: "innkeeper.idle_west",     cls: "Sprite", width: 32, height: 64, x: 32*2, y: 64*7 },
                {tag: "innkeeper.idle_east",     cls: "Sprite", width: 32, height: 64, x: 32*3, y: 64*7 },
                Templates.anim("innkeeper.walk_south", {offx:0, width: 32, height:64, duration: 70}),
                Templates.anim("innkeeper.walk_north", {offx:32, width: 32, height:64, duration: 70}),
                Templates.anim("innkeeper.walk_west", {offx:64, width: 32, height:64, duration: 70}),
                Templates.anim("innkeeper.walk_east", {offx:96, width: 32, height:64, duration: 70}),
                {tag: "innkeeper.sleep_south",    cls: "Sprite", width: 32, height: 64, x: 32*4, y: 64*0 },
                {tag: "innkeeper.seated_south",    cls: "Sprite", width: 32, height: 64, x: 32*8, y: 64*0 },
                {tag: "innkeeper.seated_north",    cls: "Sprite", width: 32, height: 64, x: 32*9, y: 64*0 },
                {tag: "innkeeper.seated_west",     cls: "Sprite", width: 32, height: 64, x: 32*10, y: 64*0 },
                {tag: "innkeeper.seated_east",     cls: "Sprite", width: 32, height: 64, x: 32*11, y: 64*0 },
                Templates.anim("innkeeper.eating_south", {frames: 9, offx:32*12, width: 32, height:64, duration: 70}),
                Templates.anim("innkeeper.eating_north", {frames: 9, offx:32*13, width: 32, height:64, duration: 70}),
                Templates.anim("innkeeper.eating_west", {frames: 9, offx:32*14, width: 32, height:64, duration: 70}),
                Templates.anim("innkeeper.eating_east", {frames: 9, offx:32*15, width: 32, height:64, duration: 70}),
            ]},

            { tag: "innkeeper",               cls: "Animator", animations: {
                    [ModelState.idle]:        { cls: "Media", tag: "innkeeper.idle_south" },
                    [ModelState.idle_south]:   { cls: "Media", tag: "innkeeper.idle_south" },
                    [ModelState.idle_north]:   { cls: "Media", tag: "innkeeper.idle_north" },
                    [ModelState.idle_west]:    { cls: "Media", tag: "innkeeper.idle_west" },
                    [ModelState.idle_east]:    { cls: "Media", tag: "innkeeper.idle_east" },
                    [ModelState.walk_south]:   { cls: "Media", tag: "innkeeper.walk_south" },
                    [ModelState.walk_north]:   { cls: "Media", tag: "innkeeper.walk_north" },
                    [ModelState.walk_west]:    { cls: "Media", tag: "innkeeper.walk_west" },
                    [ModelState.walk_east]:    { cls: "Media", tag: "innkeeper.walk_east" },
                    [ModelState.sleep_south]:  { cls: "Media", tag: "innkeeper.sleep_south" },
                    [ModelState.seated_south]: { cls: "Media", tag: "innkeeper.seated_south" },
                    [ModelState.seated_north]: { cls: "Media", tag: "innkeeper.seated_north" },
                    [ModelState.seated_west]: { cls: "Media", tag: "innkeeper.seated_west" },
                    [ModelState.seated_east]: { cls: "Media", tag: "innkeeper.seated_east" },
                    [ModelState.eating_south]: { cls: "Media", tag: "innkeeper.eating_south" },
                    [ModelState.eating_north]: { cls: "Media", tag: "innkeeper.eating_north" },
                    [ModelState.eating_west]:  { cls: "Media", tag: "innkeeper.eating_west" },
                    [ModelState.eating_east]:  { cls: "Media", tag: "innkeeper.eating_east" },
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
            // NOTE: do not assign objects to "000": reserved for empty index
            Templates.tile("001", "brickFloor.l"),
            Templates.tile("002", "sand"),
            Templates.tile("003", "road"),
            Templates.tile("004", "brickFloor"),
            Templates.tile("005", "woodDoor.top", { offx: 24, offy: -8, linkDstTag: "woodDoor"}),
            Templates.tile("006", "roundBasket"),
            Templates.tile("007", "brickFloor.r"),
            Templates.tile("008", "halfTable", {xxform: {dx:8}}),
            Templates.tile("009", "road.l"),
            Templates.tile("00a", "road.r"),
            //Templates.tile("00b", "apple"),
            Templates.tile("00c", "strawberry"),
            Templates.tile("00d", "shadow34"),
            Templates.tile("00e", "shadow"),
            Templates.tile("00f", "post"),
            Templates.tile("00g", "post.l", { mediaTag: "post", offx: -6, offy: -16, xcollider: { tag: Collider.sparkthru, width: 4, height: 12, offy: 18 } }),
            Templates.tile("00h", "post.r", { mediaTag: "post", offx: 5, offy: -16, xcollider: { tag: Collider.sparkthru, width: 4, height: 12, offy: 18 } }),
            Templates.tile("00j", "post.sr", { mediaTag: "post.s", offx: 8, offy: -16, xcollider: { tag: Collider.sparkthru, width: 4, height: 12, offy: 18 } }),
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
            Templates.tile("00G", "lamppostRight", {offx: 8, offy: -24, xcollider: { width: 10, height: 10, offy: 24, offx: -8 }, sparkable: true}),
            Templates.tile("00H", "lamppostLeft", {offx: -8, offy: -24, xcollider: { width: 10, height: 10, offy: 24, offx: 8}, sparkable: true}),
            Templates.tile("00I", "sack", {offx: 8, offy: -8, xcollider: { width: 28, height: 16, offy: 4 }}),
            Templates.tile("00J", "table1x2", {offy: -16}),
            Templates.tile("00K", "basket", {offx: 8, offy: -8 }),
            Templates.tile("00L", "table2x1", {offx: 8, offy: -8}),
            Templates.tile("00M", "largePost", {offy: -16, xcollider: { tag: Collider.sparkthru, width: 10, height: 10, offy: 16 }}),
            Templates.tile("00N", "smallPostBCross", {offy: -16, xcollider: { tag: Collider.sparkthru, width: 10, height: 10, offy: 16 }}),
            Templates.tile("00O", "smallPostFCross", {offy: -16, xcollider: { tag: Collider.sparkthru, width: 10, height: 10, offy: 16 }}),
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
            Templates.tile("011", "vhouseBack1", {offy: -32, xcollider: {offx: 4, offy: 8, width: 8, height:62}}),
            Templates.tile("012", "vhouseBack2", {offy: -40, xcollider: {offy: 8, height: 70}}),
            Templates.tile("013", "vhouseBack3", {offy: -40, xcollider: {offy: -4, height: 70}}),
            Templates.tile("014", "vhouseBack4", {offy: -40, xcollider: {offy: -8, height: 70}}),
            Templates.tile("015", "vhouseBack5", {offy: -40, xcollider: {offy: 4, height: 70}}),
            Templates.tile("016", "vhouseBack6", {offy: -40, xcollider: {offy: 4, height: 70}}),
            Templates.tile("017", "vhouseBack7", {offy: -40, xcollider: {offy: 4, height: 70}}),
            Templates.tile("018", "vhouseBack8", {offy: -40, xcollider: {offy: 4, height: 70}}),
            Templates.tile("019", "vhouseBack9", {offy: -40, xcollider: {offy: 4, height: 70}}),
            Templates.tile("01a", "vhouseBack10", {offy: -40, xcollider: {offy: 4, height: 70}}),
            Templates.tile("01b", "vhouseBack11", {offy: -40, xcollider: {offy: 4, height: 70}}),
            Templates.tile("01c", "vhouseBack12", {offy: -40, xcollider: {offy: -8, height: 70}}),
            Templates.tile("01d", "vhouseBack13", {offy: -40, xcollider: {offy: -4, height: 70}}),
            Templates.tile("01e", "vhouseBack14", {offy: -40, xcollider: {offy: 8, height: 70}}),
            Templates.tile("01f", "vhouseBack15", {offy: -32, xcollider: {offx: -4, offy: 8, width: 8, height: 62}}),
            Templates.tile("01g", "vhouseFront1", {offy: -24, xcollider: {offx: 4, width: 8, height: 46}}),
            Templates.tile("01h", "vhouseFront2", {offy: -32, xcollider: {offy: 8, height: 46}}),
            Templates.tile("01i", "vhouseFront3", {offy: -32, xcollider: {offy: 8, height: 68}, linkSrcTag: "vhouse.flowers.l", sparkable: true}),
            Templates.tile("01j", "vhouseFront4", {offy: -24, xcollider: {offy: 16, height: 30}}),
            Templates.tile("01k", "vhouseFront5", {offy: -32, xcollider: {offy: 16, height: 30}}),
            Templates.tile("01l", "vhouseFront6", {offy: -24, xcollider: {offy: 8, height: 30}}),
            Templates.tile("01n", "vhouseFront8", {offy: -24, xcollider: {offy: 8, height: 30}}),
            Templates.tile("01o", "vhouseFront9", {offy: -32, xcollider: {offy: 16, height: 30}}),
            Templates.tile("01p", "vhouseFront10", {offy: -24, xcollider: {offy: 16, height: 30}}),
            Templates.tile("01q", "vhouseFront11", {offy: -32, xcollider: {offy: 8, height: 68}, linkSrcTag: "vhouse.flowers.r", sparkable: true}),
            Templates.tile("01r", "vhouseFront12", {offy: -32, xcollider: {offy: 8, height: 46}}),
            Templates.tile("01s", "vhouseFront13", {offy: -24, xcollider: {offx: -4, width: 8, height: 46}}),

            Templates.tile("01t", "vhouseRoof1", {offx: 112, offy: -72}),

            Templates.tile("01u", "vhousePorch1", {offy: -8, xcollider: { offy: -8, height: 14}}),
            Templates.tile("01v", "vhousePorch2", {offy: -16, xcollider: { offy: 2, height: 14}}),
            Templates.tile("01w", "vhousePorch3", {offy: -24, xcollider: {offy: 4, height: 14}}),
            Templates.tile("01x", "vhousePorch4", {offy: -24}),
            Templates.tile("01y", "vhousePorch5", {offy: -24}),
            Templates.tile("01z", "vhousePorch6", {offy: -24}),
            Templates.tile("01A", "vhousePorch7", {offy: -24, xcollider: {offy: -8, height: 14}}),
            Templates.tile("01B", "vhousePorch8", {offy: -16, xcollider: {offy: 2, height: 14}}),
            Templates.tile("01C", "vhousePorch9", {offy: -8, xcollider: {offy: 4, height: 14}}),
            Templates.tile("01D", "vhouseTable", {offx: 16, offy: -32, xcollider: {offy: 8, height: 48}}),

            Templates.tile("01E", "vhouseRoof2", {offx: 16, offy: -8, sparkable: true, linkDstTag: "vhouse.flowers.l"}),
            Templates.tile("01F", "vhouseRoof3", {offx: 16, offy: -8}),
            Templates.tile("01G", "vhouseRoof5", {offx: 16, offy: -8, sparkable: true, linkDstTag: "vhouse.flowers.r"}),
            Templates.tile("01H", "fountain", {
                offx: 48, offy: -48,
                xcollider: { cls: "ColliderSet", xitems: [
                    {width: 76, height: 40, offx: 48, offy: -50},
                    {width: 40, height: 76, offx: 48, offy: -50},
                    {width: 60, height: 60, offx: 48, offy: -50},
                ]},
            }),
            Templates.tile("01I", "fountain.top", {offx: 32, offy: -16}),
            Templates.tile("01J", "fountain.water", {offx: 48, offy: -48}),
            Templates.tile("01K", "vhouseRoof4", {offx: 16, offy: -8}),
            Templates.tile("01L", "vhouseDoor.top", {offx: 16, offy: -8, linkDstTag: "vhouseDoor"}),

            Templates.tile("01M", "inn.base.tl", {offx: 0, offy: -16}),
            Templates.tile("01N", "inn.base.t", {offx: 0, offy: -16, xcollider: {offy: 8}}),
            Templates.tile("01O", "inn.base.tj", {offx: 0, offy: -16}),
            Templates.tile("01P", "inn.base.tr", {offx: 0, offy: -16}),
            Templates.tile("01Q", "inn.base.lr", {offx: 0, offy: 0}),
            Templates.tile("01R", "inn.base.entry1", {offx: 0, offy: -32}),
            Templates.tile("01S", "inn.base.bl", {offx: 0, offy: -16, xcollider: {width: 8, height: 32, offy: 0}}),
            Templates.tile("01T", "inn.base.entry2", {offx: 24, offy: -24}),

            Templates.tile("01U", "inn.base.stairs.base.1", {
                offx: 16, offy: -16,
                xcollider: { width: 48, height: 24, offy: 12},
            }),
            Templates.tile("01V", "inn.base.stairs.base.2", {
                offx: 8, offy: -16,
                xcollider: { width: 16, height: 48, offx: -8},
            }),

            Templates.tile("01X", "inn.base.stairs.rail", {offx: 40, offy: -32}),
            Templates.tile("01Y", "inn.base.room.tl", {offx: 0, offy: -24, xcollider: {width: 8, height: 64}}),
            Templates.tile("01Z", "inn.base.entry3", {offx: 24, offy: -24}),
            Templates.tile("020", "inn.base.room.tr", {offx: 0, offy: -24, xcollider: {width: 8, height: 64}}),
            Templates.tile("021", "inn.base.tower.tl", {offx: 8, offy: -16, xcollider: {offy: 8, width: 28, height: 16}}),
            Templates.tile("022", "inn.base.tower.tr", {offx: 8, offy: -16, xcollider: {offy: 8, width: 28, height: 16}}),
            Templates.tile("023", "inn.base.tower.b.1", {
                offx: 8, offy: -40,
                xcollider: {width: 24, height: 80, offy: -8},
            }),
            Templates.tile("02d", "inn.base.tower.b.2", {
                offy: -40,
                xcollider: {height: 40, offy: 20},
            }),
            Templates.tile("02B", "inn.base.tower.b.3", {
                offy: -40,
                xcollider: {height: 40, offy: 20},
            }),
            Templates.tile("02w", "inn.base.tower.b.4", {
                offx: 8, offy: -40,
                xcollider: {width: 24, height: 80, offy: -8},
            }),

            Templates.tile("024", "inn.lvl1.tl",        {offx: 0, offy: -16, xcollider: {offy: 8, width: 8, height: 16}}),
            Templates.tile("025", "inn.lvl1.t",         {offx: 0, offy: -16, xcollider: {offy: 8, height: 16}}),
            Templates.tile("026", "inn.lvl1.tj",        {offx: 0, offy: -16, xcollider: {offy: 8, height: 16}}),
            Templates.tile("027", "inn.lvl1.tr",        {offx: 0, offy: -16, xcollider: {offy: 8, width: 8, height: 16}}),
            Templates.tile("028", "inn.lvl1.l",         {offx: 0, offy: 0, xcollider: {width: 8}}),
            Templates.tile("029", "inn.lvl1.r",         {offx: 0, offy: 0, xcollider: {width: 8}}),
            Templates.tile("02a", "inn.lvl1.entry1.t",  {offx: 0, offy: -16, xcollider: {width: 8, height: 48, offy: -4}}),
            Templates.tile("02b", "inn.lvl1.bl",        {offx: 0, offy: -16, xcollider: {offy: 8, height: 16, width: 8}}),
            Templates.tile("02c", "inn.lvl1.entry2.l",  {offx: 0, offy: -40, }),
            // -- 02d taken
            Templates.tile("02e", "inn.lvl1.entry2.r",  {offx: 0, offy: -40, xcollider: {width: 8, offy: 12, height: 68}}),
            Templates.tile("02f", "inn.lvl1.room.tl",    {offx: 0, offy: -24, xcollider: {height: 70, width: 8}}),
            Templates.tile("02g", "inn.lvl1.entry3",    {
                offx: 24, offy: -16,
                xcollider: { cls: "ColliderSet", xitems: [
                    {width: 8, height: 32},
                    {offx: 48, width: 8, height: 32},
                ]},
            }),
            Templates.tile("02h", "inn.lvl1.room.tr",   {offx: 0, offy: -24, xcollider: {height: 64, width: 8}}),
            Templates.tile("02i", "inn.lvl1.tower.tl",  {offx: 8, offy: -16, xcollider: {width: 48, height: 32}}),
            Templates.tile("02j", "inn.lvl1.tower.tr",  {offx: 8, offy: -16}),
            Templates.tile("02k", "inn.lvl1.tower.b",   {offx: 56, offy: -40}),
            Templates.tile("02l", "inn.lvl1.b",         {offx: 0, offy: -16, xcollider: {offy: 8, height: 16 }}),
            Templates.tile("02m", "inn.lvl1.entry1.b",  {offx: 0, offy: -8}),
            Templates.tile("02n", "inn.lvl1.room.bl",   {offx: 0, offy: -16}),
            Templates.tile("02o", "inn.lvl1.room.br",   {offx: 0, offy: -16}),

            Templates.tile("02p", "inn.base.room.bl",   {offx: 0, offy: -16, xcollider: {width: 8, height: 32 }}),
            Templates.tile("02q", "inn.base.room.br",   {offx: 0, offy: -16, xcollider: {width: 8, height: 32}}),

            Templates.tile("02r", "inn.lvl1.stairs",    {offx: 32, offy: -32}),
            Templates.tile("02s", "inn.lvl1.stairs.rail", {offx: 16, offy: -32}),

            Templates.tile("02t", "bar",                {offy: -8, xcollider: {offy:8, height: 14}}),
            // -- 02w taken
            Templates.tile("02u", "bar.ljoin",          {offy: -8, xcollider: {width: 8, height:32}}),
            Templates.tile("02v", "bar.rend",           {offy: -8, xcollider: {offy:8}}),
            Templates.tile("02x", "bar.smtable",        {offx: 8, offy: -16, xcollider: {width: 20, offy:-4}}),
            Templates.tile("02y", "bar.stand",          {offx: 16, offy: -12, xcollider: {width:48}}),
            Templates.tile("02z", "bar.lgtable",        {offx: 8, offy: -24, xcollider: {width: 30, height: 48, offy:0}}),
            Templates.tile("02A", "bar.sidetable",      {offx: 8, offy: -16, xcollider: {width: 20, height: 40, offy:-4}}),
            // -- 02B taken
            Templates.tile("02C", "tower.stub",         {offx: 56, offy: -64, xcollider: {}}),


            Templates.object("o00", "sparkbase", "SparkBase", { 
                powered: true,
                offy: -16, 
                xcollider: { width: 28, height: 32, offy: 4} 
            }),

            Templates.object("o01", "woodDoor", "Door", {
                offx: 8, offy: -32,
                approachOffsets: [{x:0, y:16},  {x:16, y:16},  {x:0, y:-32}, {x:16, y:-32}],
                exitOffsets:     [{x:0, y:-32}, {x:16, y:-32}, {x:0, y:16},  {x:16, y:16}],
                xopenSfx: { cls: "Media", tag: "doorOpening"}, 
                xcloseSfx: { cls: "Media", tag: "doorClosing"}, 
                xcollider: { offy: 24, width:48, height:24 }, 
                linkSrcTag: "woodDoor",
            }),

            Templates.object("o02", "stool", "Chair", {
                offx: 8, offy: -8,
                xcollider: { offy: 4, width: 14, height: 14 }, 
                occupiedDir: Direction.east, 
                occupiedOffX: 10, occupiedOffY: -14, occupiedOffD: 1,
                approachOffsets: [{x:-16, y:0},  {x:32, y:0},  {x:0, y:16}, {x:16, y:16}, {x:0, y:-32}, {x:16, y:-32}],
            }),

            Templates.tile("o03", "table", {
                offx: 8, offy: -8,
                xcollider: { width: 24, height: 24 }, 
            }),

            Templates.object("o04", "bed", "Bed", {
                offx: 8, offy: -24,
                xcollider: { width: 24, height: 48 }, 
                occupiedOffX: 8, occupiedOffY: -22, occupiedOffD: 1,
                approachOffsets: [{x:-16, y:-16},  {x:-16, y:-32},  {x:32, y:-16}, {x:32, y:-32}],
            }),

            Templates.object("o05", "relay", "SparkRelay", { 
                offy: -16, 
                xcollider: {width:10, height:20, offy: 10}, 
            }),

            Templates.object("o06", "rockRelay", "SparkRelay", { 
                offy: 0, 
                xcollider: {width:10, height:10, offy: 10}, 
            }),

            Templates.object("o07", "stove", "Stove", {
                offx: 8, offy: -24,
                xcollider: { width: 32, height: 40, offy: -4 }, 
                occupiedOffX: 8, occupiedOffY: -22,
                approachOffsets: [{x:0, y:16},  {x:16, y:16}],
            }),

            Templates.object("o08", "cabbagePotatoCluster", "Stock", {
                offx: 12, offy: -24, 
                xcollider: {width: 32, height: 40, offy: 8},
                approachOffsets: [
                    {x: -16, y: -16 },
                    {x: 16, y: 16 },
                    {x: 32, y: 16 },
                ],
            }),
            Templates.object("o09", "vendorBench", "Workstation", {
                offx: 8, offy: -16,
                occupiedDir: Direction.south, 
                occupiedOffX: 0, occupiedOffY: -24,
                approachOffsets: [
                    {x: 0, y: -32 },
                ],
                xcollider: { width: 32, height: 16, offy: 8 },
            }),
            Templates.object("o0a", "appleBlueberryBench", "Stock", {
                offy: -24, 
                xcollider: {width: 12, height: 40},
                approachOffsets: [
                    {x: -16, y: -16 },
                    {x: -16, y: -32 },
                    {x: 16, y: -16 },
                    {x: 16, y: -32 },
                ],
            }),
            Templates.object("o0b", "postFishline", "Stock", {
                offx: 32, offy: -24, 
                xcollider: { cls: "ColliderSet", xitems: [{width: 10, height: 10}, {width: 10, height: 10, offx: 64}]},
                approachOffsets: [
                    {x: 16, y: 0},
                    {x: 32, y: 0 },
                    {x: 48, y: 0 },
                ],
            }),

            Templates.object("o0c", "vhouseDoor", "Door", {
                offx: 0, offy: -40,
                approachOffsets: [{x:0, y:16}, {x:0, y: -32}],
                exitOffsets:     [{x:0, y:-32}, {x:0, y: 16}],
                xopenSfx: { cls: "Media", tag: "doorOpening"}, 
                xcloseSfx: { cls: "Media", tag: "doorClosing"}, 
                xcollider: { offy: 32, width:32, height:16 }, 
                linkSrcTag: "vhouseDoor"
            }),

            Templates.object("o0d", "vhouseBed", "Bed", {
                offx: 16, offy: -48,
                xcollider: { width: 24, height: 48 }, 
                occupiedOffX: 15, occupiedOffY: -30, occupiedOffD: 1,
                approachOffsets: [{x:48, y:-16}, {x:48, y:-32}],
            }),

            Templates.object("o0e", "sparkbase.fountain", "SparkBase", { 
                mediaTag: "sparkbase",
                powered: true,
                offx: 16,
                offy: -26, 
                xcollider: { width: 28, height: 32, offy: 4} 
            }),

            Templates.object("o0f", "floorRelay", "SparkBase", { 
                offx: 8, 
                offy: -8, 
                powered: false,
            }),

            Templates.object("o0g", "inn.lvl1.door.b", "Door", {
                offx: 8, offy: -32,
                approachOffsets: [{x:0, y:16},  {x:16, y:16},  {x:0, y:-32}, {x:16, y:-32}],
                exitOffsets:     [{x:0, y:-32}, {x:16, y:-32}, {x:0, y:16},  {x:16, y:16}],
                xopenSfx: { cls: "Media", tag: "doorOpening"}, 
                xcloseSfx: { cls: "Media", tag: "doorClosing"}, 
                xcollider: { offy: 24, width:48, height:24 }, 
                linkSrcTag: "inn.lvl1.door",
            }),

            Templates.object("o0h", "inn.base.stairs", "Ramp", {
                offx: 8, offy: -24,
                right: true,
                traverse: .7,
                xactivator: { width: 8, height: 32, offx: 8, offy: -24 },
                xcollider: { cls: "ColliderSet", xitems: [
                    {width: 32, height: 8, offx: 8, offy: 4},
                    {width: 16, height: 8, offx: 16, offy: -4},
                ]},
            }),

            //Templates.tile("02t", "bar",                {offy: -8, xcollider: {offy:8}}),
            Templates.object("o0i", "bar.work", "Workstation", {
                mediaTag: "bar",
                offy: -8,
                occupiedDir: Direction.south, 
                occupiedOffX: 0, occupiedOffY: -24,
                approachOffsets: [
                    {x: 0, y: -16 },
                ],
                xcollider: { offy: 8, height: 14 },
            }),

            Templates.object("o0j", "bed.ciara", "Bed", {
                mediaTag: "bed",
                offx: 12, offy: -24,
                xcollider: { width: 24, height: 48 }, 
                occupiedOffX: 12, occupiedOffY: -24, occupiedOffD: 1,
                approachOffsets: [{x:-16, y:-16},  {x:-16, y:-32},  {x:32, y:-16}, {x:32, y:-32}],
            }),

            Templates.object("o0k", "bar.stool", "MealService", {
                mediaTag: "stool",
                beerOffY: -36, beerOffX: -2,
                foodOffY: -31, foodOffX: 8,
                serveOffX: 8, serveOffY: -40,
                offx: 8, offy: -8,
                xcollider: { offy: 4, width: 14, height: 14 }, 
                occupiedDir: Direction.north, 
                occupiedOffX: 8, occupiedOffY: -14, occupiedOffD: 1,
                approachOffsets: [{x:-16, y:0},  {x:32, y:0},  {x:0, y:16}, {x:16, y:16}, {x:0, y:-32}, {x:16, y:-32}],
                serviceApproachOffsets: [{x:16, y:-32}],
            }),


            Templates.object("o0l", "bar.beerstand", "Keg", {
                gatherDir: Direction.north,
                gatherOffX: 8,
                gatherOffY: 8,
                offx: 16, offy: -28,
                xcollider: { width: 48, offy: 16 }, 
                approachOffsets: [{x:0, y:16}],
            }),

            Templates.object("o0m", "bar.beer", "Food", {
                mediaTag: "bar.beer.full",
            }),

            Templates.object("o0n", "plate", "Food", {
            }),

            Templates.object("o0o", "inn.base.tower.relay", "SparkRelay", { 
                offy: -24, 
                offx: 8,
                xcollider: {width:32, height:40, offy: 4}, 
            }),

            Templates.object("o0p", "vhouse.rune", "SparkBase", { 
                powered: false,
                offx: 16, offy: -16, 
            }),

            Templates.object("o0q", "woodDoor.left", "Door", {
                offx: 16, offy: -24,
                approachOffsets: [{x:-16, y:0},  {x:16, y:0}],
                exitOffsets:     [{x:16, y:0}, {x:-16, y:0}],
                xopenSfx: { cls: "Media", tag: "doorOpening"}, 
                xcloseSfx: { cls: "Media", tag: "doorClosing"}, 
                xcollider: { offx: -16, width: 8, offy: 24, height:24 }, 
            }),

            Templates.object("o0r", "woodDoor.right", "Door", {
                offx: 8, offy: -32,
                approachOffsets: [{x:0, y:16},  {x:16, y:16},  {x:0, y:-32}, {x:16, y:-32}],
                exitOffsets:     [{x:0, y:-32}, {x:16, y:-32}, {x:0, y:16},  {x:16, y:16}],
                xopenSfx: { cls: "Media", tag: "doorOpening"}, 
                xcloseSfx: { cls: "Media", tag: "doorClosing"}, 
                xcollider: { offy: 24, width:48, height:24 }, 
            }),

            // ------------------------------------------------------------------------------

            { tag: "spark", cls: "SparkProjectile", 
                xcollider: { tag: Collider.projectile, blocking: Collider.object|Collider.npc, width:8, height:8, color: "rgba(0,0,127,.5)" },
                xsketch: { cls: "Media", tag: "spark"}, 
            },

            Templates.object("c01", "player", "Character", {
                name: "Alette",
                hoverable: true,
                mediaTag: "fairy",
                ctrlId: 1,
                offy: -8,
                xcollider: { tag: Collider.player, blocking: Collider.object, width:14, height:10, offy:8, color: "rgba(0,0,127,.5)" },
                xstateSfxs: {
                    [ModelState.walk]: { cls: "Media", tag: "chimes"}, 
                    [ModelState.enlightenedWalk]: { cls: "Media", tag: "chimesHigh"}, 
                }
            }),

            Templates.object("c02", "aodhan", "Character", {
                name: "Aodhan",
                mediaTag: "gnome",
                ctrlId: 0,
                offy: -16,
                ownerTag: "Aodhan",
                maxFedTTL: 30000,
                hoverable: true,
                xcollider: { tag: Collider.npc, blocking: Collider.projectile|Collider.object, width:14, height:12, offy:16, color: "rgba(0,0,127,.5)" },
                xactivitySchedule: Templates.testSchedule,
                sparkable: true,
                chatable: true,
                maxSparkTTL: 500,
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
                        "EatAtServiceScheme",
                        "FindScheme",
                        "GatherScheme",
                        "LeaveScheme",
                        "MoveScheme",
                        "OccupyScheme",
                        "OpenAtStationScheme",
                        "SleepAtBedScheme",
                        "RestockAtStockScheme",
                        "SweepAtDirtyScheme",
                        "WaitAtServiceScheme",
                        "WantBedScheme",
                        "WantChairScheme",
                        "WantDirtyScheme",
                        "WantServiceScheme",
                        "WantStockScheme",
                        "WantStoveScheme",
                        "WantWorkstationScheme",
                        "WorkAtStationScheme",
                    ]
                },
                xmorale: {
                    cls: "Morale",
                    likes: { "spark": 2 },
                    dislikes: { 
                        "chat.neutral": 1,
                        "chat.insult": 2,
                     },
                },
                xdialogs: [
                    { tag: "test", predicate: (actor, npc) => true},
                ],
            }),

            Templates.object("c03", "ciara", "Character", {
                name: "Ciara",
                mediaTag: "innkeeper",
                ctrlId: 0,
                offy: -16,
                ownerTag: "Ciara",
                hoverable: true,
                chatable: true,
                maxFedTTL: 30000,
                xcollider: { tag: Collider.npc, blocking: Collider.projectile|Collider.object, width:14, height:12, offy:16, color: "rgba(0,0,127,.5)" },
                xactivitySchedule: Templates.innSchedule,
                xai: { 
                    cls: "AiState",
                    xdirectives: [
                        Templates.aiWakeDirective,
                        Templates.aiWorkDirective,
                        Templates.aiRelaxDirective,
                        Templates.aiRestDirective,
                    ],
                    xschemes: [
                        "ClearBeerScheme",
                        "ClearFoodScheme",
                        "CloseAtStationScheme",
                        "EatAtChairScheme",
                        "FindScheme",
                        "GatherScheme",
                        "LeaveScheme",
                        "MoveScheme",
                        "OccupyScheme",
                        "OpenAtStationScheme",
                        "ServeBeerScheme",
                        "ServeFoodScheme",
                        "SleepAtBedScheme",
                        "RestockAtStockScheme",
                        "SweepAtDirtyScheme",
                        "TakeBeerOrderScheme",
                        "TakeFoodOrderScheme",
                        "WantBedScheme",
                        "WantBeerClearScheme",
                        "WantBeerOrderScheme",
                        "WantChairScheme",
                        "WantDirtyScheme",
                        "WantFoodClearScheme",
                        "WantFoodOrderScheme",
                        "WantPrepBeerServiceScheme",
                        "WantPrepFoodServiceScheme",
                        "WantServeBeerScheme",
                        "WantServeFoodScheme",
                        "WantStockScheme",
                        "WantStoveScheme",
                        "WantWorkstationScheme",
                        "WorkAtStationScheme",
                    ]
                },
                xmorale: {
                    cls: "Morale",
                    likes: { "spark": 2 },
                    dislikes: { 
                        "chat.insult": 2,
                        "chat.neutral": 1,
                    },
                },
                xdialogs: [
                    { tag: "test", predicate: (actor, npc) => true},
                ],
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