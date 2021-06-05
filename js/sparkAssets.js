export { SparkAssets };

import { Direction }            from "./base/dir.js";
import { Fmt } from "./base/fmt.js";
import { ModelState }           from "./base/modelState.js";
import { Templates }            from "./templates.js";

const moveDuration = 90;

class SparkAssets {
    static init() {
        this.media = [
            { src: "img/terrain1.png", loader: "Sheet", refs: [
                { tag: "grass",      cls: "VarSprite", variations: [
                    { x: 16*0, y: 16*2, width: 16, height: 16 },
                    { x: 16*1, y: 16*2, width: 16, height: 16 },
                    { x: 16*2, y: 16*2, width: 16, height: 16 },
                    { x: 16*3, y: 16*2, width: 16, height: 16 },
                    { x: 16*4, y: 16*2, width: 16, height: 16 },
                    { x: 16*5, y: 16*2, width: 16, height: 16 },
                ]},
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
            { id: "001",    tag: "player", cls: "Character", 
                            xsketch: { cls: "Media", tag: "gnome" },
                            xcollider: { width:15, height:16, color: "rgba(0,0,127,.5)" }, },
            { id: "002",    tag: "grass", cls: "Tile", xsketch: { cls: "Media", tag: "grass" }},

            { id: "003",    tag: "npc", cls: "Character", 
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
    }
}