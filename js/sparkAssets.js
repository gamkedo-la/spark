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
            Templates.overlaySprite("img/grass.png", "grass", {"height": 16, "width": 16}),
            Templates.wallSprite("img/stuccoHouse.png", "stuccoHouse", {"height": 16, "width": 16}),

            { src: "img/stuccoHouse.png", loader: "Sheet", refs: [
                {tag: "woodDoor.close", cls: "Sprite", width: 16*4, height: 16*5, x: 16*11, y: 16*0 },
                {tag: "woodDoor.open", cls: "Sprite", width: 16*4, height: 16*5, x: 16*11, y: 16*6 },
            ]},
            { tag: "woodDoor", 
                cls: "Animator", 
                animations: { 
                    [ModelState.close]: { cls: "Media", tag: "woodDoor.close" }, 
                    [ModelState.open]: { cls: "Media", tag: "woodDoor.open" }, 
                },
            },
            { src: "img/roof.png", loader: "Sheet", refs: [
                {tag: "roof.1", cls: "Sprite", width: 16, height: 16, x: 16*1, y: 16*0 },
                {tag: "roof.2", cls: "Sprite", width: 16, height: 16, x: 16*2, y: 16*0 },
                {tag: "roof.3", cls: "Sprite", width: 16, height: 16, x: 16*3, y: 16*0 },

                {tag: "roof.4", cls: "Sprite", width: 16, height: 16, x: 16*0, y: 16*1 },
                {tag: "roof.5", cls: "Sprite", width: 16, height: 16, x: 16*1, y: 16*1 },
                {tag: "roof.6", cls: "Sprite", width: 16, height: 16, x: 16*2, y: 16*1 },
                {tag: "roof.7", cls: "Sprite", width: 16, height: 16, x: 16*3, y: 16*1 },
                {tag: "roof.8", cls: "Sprite", width: 16, height: 16, x: 16*4, y: 16*1 },

                {tag: "roof.9", cls: "Sprite", width: 16, height: 16, x: 16*0, y: 16*2 },
                {tag: "roof.10", cls: "Sprite", width: 16, height: 16, x: 16*1, y: 16*2 },
                {tag: "roof.11", cls: "Sprite", width: 16, height: 16, x: 16*2, y: 16*2 },
                {tag: "roof.12", cls: "Sprite", width: 16, height: 16, x: 16*3, y: 16*2 },
                {tag: "roof.13", cls: "Sprite", width: 16, height: 16, x: 16*4, y: 16*2 },

                {tag: "roof.14", cls: "Sprite", width: 16, height: 16, x: 16*0, y: 16*3 },
                {tag: "roof.15", cls: "Sprite", width: 16, height: 16, x: 16*1, y: 16*3 },
                {tag: "roof.16", cls: "Sprite", width: 16, height: 16, x: 16*2, y: 16*3 },
                {tag: "roof.17", cls: "Sprite", width: 16, height: 16, x: 16*3, y: 16*3 },
                {tag: "roof.18", cls: "Sprite", width: 16, height: 16, x: 16*4, y: 16*3 },

                {tag: "roof.15", cls: "Sprite", width: 16, height: 16, x: 16*0, y: 16*4 },
                {tag: "roof.16", cls: "Sprite", width: 16, height: 16, x: 16*1, y: 16*4 },
                {tag: "roof.17", cls: "Sprite", width: 16, height: 16, x: 16*2, y: 16*4 },
                {tag: "roof.18", cls: "Sprite", width: 16, height: 16, x: 16*3, y: 16*4 },
                {tag: "roof.19", cls: "Sprite", width: 16, height: 16, x: 16*4, y: 16*4 },

            ]},

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
                {tag: "gnome.idle_south",    cls: "Sprite", width: 32, height: 64, x: 32*0, y: 64*7 },
                {tag: "gnome.idle_north",    cls: "Sprite", width: 32, height: 64, x: 32*1, y: 64*7 },
                {tag: "gnome.idle_west",     cls: "Sprite", width: 32, height: 64, x: 32*2, y: 64*7 },
                {tag: "gnome.idle_east",     cls: "Sprite", width: 32, height: 64, x: 32*3, y: 64*7 },
                Templates.anim("gnome.walk_south", {xoff:0, width: 32, height:64, duration: 70}),
                Templates.anim("gnome.walk_north", {xoff:32, width: 32, height:64, duration: 70}),
                Templates.anim("gnome.walk_west", {xoff:64, width: 32, height:64, duration: 70}),
                Templates.anim("gnome.walk_east", {xoff:96, width: 32, height:64, duration: 70}),
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
            }},

        ];

        this.assets = [

            Templates.tile("003", "road"),
            Templates.tile("004", "brickFloor"),

            { id: "o01", tag: "woodDoor", cls: "Door", xcollider: {}, xxform: {dx: 48}, xsketch: { cls: "Media", tag: "woodDoor"} },

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

            Templates.tile("r01", "roof.1"),
            Templates.tile("r02", "roof.2"),
            Templates.tile("r03", "roof.3"),
            Templates.tile("r04", "roof.4"),
            Templates.tile("r05", "roof.5"),
            Templates.tile("r06", "roof.6"),
            Templates.tile("r07", "roof.7"),
            Templates.tile("r08", "roof.8"),
            Templates.tile("r09", "roof.9"),
            Templates.tile("r10", "roof.10"),
            Templates.tile("r11", "roof.11"),
            Templates.tile("r12", "roof.12"),
            Templates.tile("r13", "roof.13"),
            Templates.tile("r14", "roof.14"),
            Templates.tile("r15", "roof.15"),
            Templates.tile("r16", "roof.16"),
            Templates.tile("r17", "roof.17"),
            Templates.tile("r18", "roof.18"),
            Templates.tile("r19", "roof.19"),

        ];

        this.assets = this.assets.concat(Templates.overlayTiles("02", "grass"));
        this.assets = this.assets.concat(Templates.wallTiles("05", "stuccoHouse"));
    }
}