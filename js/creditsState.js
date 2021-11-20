export { CreditsState };

import { State }            from "./base/state.js";
import { Keys }             from "./base/keys.js";
import { Text }             from "./base/text.js";
import { Templates }        from "./templates.js";
import { Color }            from "./base/color.js";
import { Font }             from "./base/font.js";
import { Base } from "./base/base.js";

class CreditsState extends State {
    static credits = [
        {title: "Credits", text: "Thanks for playing!  Please scroll through all the contributors to the project without whose help this wouldn't have been possible!  Thanks one and all!"},
        {title: "Tylor Allison", text: "Core gameplay, project lead, AI behaviors, main artist, primary writer, tutorial, UI framework and primitives, performance optimizations, environment design, building/furniture art, NPC and object interactions, pathfinding, fairy/gnome sprites, custom editor, particles, input handling, asset management, hints system"},
        {title: "Vince McKeown", text: "Bar assets (including game cards), floor rune relay, rock relay integration, runes, vendor house flower pot update, spark flower animations, mute refactor, stairs, assorted beach shells, electric zap sound, plants (fern, wild flowers, large leaf plant, shrubs), door open/close sounds, rocks"},
        {title: "Patrick McKeown", text: "Tree, flower pot (including animation), sounds (fairy wings, wind chimes, silver and gold bells, gnome grumbling variations, cheers, sparks), additional sprite integration, gnome chatter, gloom and enlightened walk states, various scenery decoration improvements (vendor, plant variations, seashells, palm tree)"},
        {title: "Alan Zaring", text: "Music"},
        {title: "Vaan Hope Khani", text: "Initial main menu functionality, options state, button sounds, music and sound volume sliders, door opening sound, additional level editing"},
        {title: "Chris DeLeon", text: "Pillar activation sound, vendor sounds, gnome sweeping animation, action UI icons"},
        {title: "Christer \"McFunkypants\" Kaitila", text: "Title screen decoration, minor tutorial editing, lamp post sound hookup"},
        {title: "Abhishek @akhmin_ak", text: "Story and dialog work (incl. Ciara, the barkeeper), updates to map areas for vendor and tower"},
        {title: "Philip Greene", text: "NPC morale and like/dislike indicators, indicators sprite sheet"}
    ];
    static fontSize = 24;

    // CONSTRUCTOR ---------------------------------------------------------
    cpre(spec) {
        super.cpre(spec);
        const dialogColor = spec.dialogColor || Templates.playTextColor2;
        let font = new Font({size: CreditsState.fontSize});

        // construct the UI elements
        spec.xview = {
            cls: "UxCanvas",
            cvsid: "canvas",
            xchildren: [
                Templates.panel("mainPanel", { xxform: { origx: 0, origy: 0 }, xchildren: [
                    Templates.menuText("titleText", " credits ", {xxform: { top: .01, bottom: .9 }}),
                    Templates.panel("dialogPanel", { 
                        xxform: { left: .1, right: .1, top: .5, bottom: .5, height: 50}, 
                        xsketch: { cls: 'Rect', color: new Color(30,30,30,.55) },
                        xchildren: [
                            {
                                cls: "UxText",
                                tag: "dialogText",
                                xtext: { color: dialogColor, text: "text", align: "center", wrap: true, fit: false, font: font},
                                xxform: { otop: 30, oleft: 10, oright: 5 },
                            },
                        ],
                    }),
                    Templates.menuButton("backButton", "back", { xxform: { top: .85, bottom: .1, left: .1, right: .7 }}),
                    Templates.menuButton("prevButton", "prev", { xxform: { top: .85, bottom: .1, left: .4, right: .4 }}),
                    Templates.menuButton("nextButton", "next", { xxform: { top: .85, bottom: .1, left: .7, right: .1 }}),
                ]}),
            ],
        };
    }

    cpost(spec) {
        super.cpost(spec);
        this.index = 0;
        this.credits = spec.credits || this.constructor.credits;
        this.font = spec.font || new Font({size: CreditsState.fontSize});

        // lookup UI elements
        this.titleText = this.findFirst((v) => v.tag === "titleText");
        this.dialogPanel = this.findFirst((v) => v.tag === "dialogPanel");
        this.dialogText = this.findFirst((v) => v.tag === "dialogText");
        this.backButton = this.findFirst((v) => v.tag === "backButton");
        this.prevButton = this.findFirst((v) => v.tag === "prevButton");
        this.nextButton = this.findFirst((v) => v.tag === "nextButton");

        // event handlers
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onBack = this.onBack.bind(this);
        this.onNext = this.onNext.bind(this);
        this.onPrev = this.onPrev.bind(this);
        this.backButton.evtClicked.listen(this.onBack);
        this.nextButton.evtClicked.listen(this.onNext);
        this.prevButton.evtClicked.listen(this.onPrev);
        Keys.evtKeyPressed.listen(this.onKeyDown);
    }

    // EVENT CALLBACKS -----------------------------------------------------
    onBack(evt) {
        Base.instance.stateMgr.pop();
        this.destroy();
    }

    onNext(evt) {
        this.index++;
        if (this.index > this.credits.length-1) this.index = this.credits.length - 1;
    }
    onPrev(evt) {
        this.index--;
        if (this.index < 0) this.index = 0;
    }

    onKeyDown(evt) {
        if (evt.key === 'Escape') {
            this.onBack();
        }
        if (evt.key === 'Space') {
            this.index++;
            if (this.index >= this.credits.length) {
                this.onBack();
            }
        }
    }

    // METHODS -------------------------------------------------------------
    updateDialog(ctx) {
        if (this.index !== this.lastIndex) {
            if (this.index === 0) {
                this.prevButton.visible = false;
                this.prevButton.active = false;
            } else {
                this.prevButton.visible = true;
                this.prevButton.active = true;
            }

            if (this.index === this.credits.length-1) {
                this.nextButton.visible = false;
                this.nextButton.active = false;
            } else {
                this.nextButton.visible = true;
                this.nextButton.active = true;
            }

            this.lastIndex = this.index;
            let title = this.credits[this.index].title;
            let dialog = this.credits[this.index].text;
            let height = Text.measureWrapHeight(this.font, dialog, this.dialogText.width);
            this.dialogPanel.xform.height = height;

            //let height = Text.measureWrapHeight(this.font, this.dialog.text, this.dialogText.width);
            //this.dialogPanel.xform.height = height;

            this.titleText.text = title;
            this.dialogText.text = dialog;
        }
    }

    iupdate(ctx) {
        super.iupdate(ctx);
        // check for dialog completion
        this.updateDialog(ctx);
    }

    // destroy is automatically called when a state is being torn down (by the state manager)
    destroy() {
        // house keeping to ensure that we don't leave around defunct callbacks on global systems (like the key callbacks)
        Keys.evtKeyPressed.ignore(this.onKeyDown);
        super.destroy();
    }

}