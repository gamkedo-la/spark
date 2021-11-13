export { UxTutorial };

import { Keys }             from "./base/keys.js";
import { Util }             from "./base/util.js";
import { Templates }        from "./templates.js";
import { UxCtrl }           from "./base/uxCtrl.js";
import { Generator }        from "./base/generator.js";
import { Hierarchy }        from "./base/hierarchy.js";
import { Font }             from "./base/font.js";
import { Text }             from "./base/text.js";
import { PanToAction }      from "./actions/panTo.js";
import { Fmt } from "./base/fmt.js";
import { Config } from "./base/config.js";

class UxTutorial extends UxCtrl {

    /**
     * The pre-constructor: sets up data used by the constructor to build out the state, which includes building out the UI elements
     * and state management.
     * @param {*} spec 
     */
    cpre(spec) {
        super.cpre(spec);

    }

    // the post constructor.  called after the main constructor has been executed and is used to wire state specific logic
    cpost(spec) {
        super.cpost(spec);
        // pull UI state vars
        this.state = spec.state;
        // construct the UI elements
        this.view = Generator.generate({
            cls: "UxCanvas",
            ui: true,
            cvsid: "uicanvas",
            xchildren: [
                Templates.panel("tutorialPanel", { 
                    xxform: { border: .2 }, 
                    xchildren: [
                        Templates.menuText(null, "Tutorial", {xxform: {otop: 20, bottom: .85}}),
                        Templates.menuButton("skipButton", "skip", { xxform: { left: .1, right: .7, top: .875, bottom: .025 }}),
                        Templates.menuButton("nextButton", "next", { xxform: { left: .7, right: .1, top: .875, bottom: .025 }}),
                    ],
                }),
            ],
        });
        // lookup UI elements
        this.panel = Hierarchy.find(this.view, (v) => v.tag === "tutorialPanel");
        this.skipButton = Hierarchy.find(this.view, (v) => v.tag === "skipButton");
        this.nextButton = Hierarchy.find(this.view, (v) => v.tag === "nextButton");
        Util.bind(this, "onKeyDown", "onSkip", "onNext");
        Keys.evtKeyPressed.listen(this.onKeyDown);
        this.skipButton.evtClicked.listen(this.onSkip);
        this.nextButton.evtClicked.listen(this.onNext);
        this.font = spec.font || new Font({size:25});
        this.stageWelcome();
    }

    genModal(text, align, pointer) {
        if (this.modal) this.modal.destroy();
        let xxform;
        if (align === "left") {
            xxform = { left: .05, right: .55, top: .4, bottom: .6, height: 50 };
        } else if (align === "right") {
            xxform = { left: .55, right: .05, top: .4, bottom: .6, height: 50 };
        } else {
            xxform = { top: .4, bottom: .6, left: .1, right: .1, height: 50 };
        }
        let xmodal = Templates.panel(null, {
            xchildren: [
                Templates.panel("modalPanel", {
                    xsketch: { cls: "Media", tag: "buttonOff", xfitter: { cls: "FitToParent" }},
                    xxform: xxform,
                    xchildren: [
                        {
                            cls: "UxText",
                            tag: "modalText",
                            xtext: { color: Templates.playTextColor3, text: "replace", wrap: true, fit: false, font: this.font},
                            xxform: { otop: 15, oleft: 20, oright: 5 },
                        },
                    ],
                }),
            ],
        });
        if (pointer) {
            if (align === "left") {
                xmodal['xchildren'].unshift(Templates.panel(null, {
                    xsketch: { cls: "Media", tag: "markerRight", lockRatio: true },
                    xxform: { right: .535, left: .465, top: .45, bottom: .55, width: 32, height: 32 },
                }));
            } else {
                xmodal['xchildren'].unshift(Templates.panel(null, {
                    xsketch: { cls: "Media", tag: "markerLeft", lockRatio: true },
                    xxform: { left: .535, right: .465, top: .45, bottom: .55, width: 32, height: 32 },
                }));
            }
        }
        this.modal = Generator.generate(xmodal);
        this.panel.adopt(this.modal);
        let modalPanel = Hierarchy.find(this.modal, (v) => v.tag === "modalPanel");
        let modalText = Hierarchy.find(this.modal, (v) => v.tag === "modalText");
        let height = Text.measureWrapHeight(this.font, text, modalText.width) + 5;
        modalPanel.xform.height = height;
        modalText.text = text;
    }

    stageWelcome() {
        this.genModal("Welcome to Innis Fhaolain!!!", "left", false);
        this.nextStage = this.stageAletteShow;
    }

    stageAletteShow() {
        this.genModal( "This is Alette, your character.", "right", true);
        this.nextStage = this.stageAletteGuide;
    }

    stageAletteGuide() {
        this.genModal( "Your goal is to guide her in helping the gnomes to find their spark.", "right", false);
        this.nextStage = this.stageAletteMagic;
    }

    stageAletteMagic() {
        this.genModal( "Alette has powerful fairy magic that she casts with the Z key. This is Alette's Spark!", "center", false);
        this.nextStage = this.stageAletteOther;
    }

    stageAletteOther() {
        this.genModal( "The Z key will also be used to interact with the world, open doors, sit down, and talk to NPCs.  Watch the icon in the upper left to see the current available action.", "center", false);
        this.nextStage = this.stageRuneShow;
    }

    stageRuneShow() {
        let target = { x: this.state.fountainBase.x + 16, y: this.state.fountainBase.y - 16};
        let pan = new PanToAction({target: target});
        this.state.actions.push(pan);
        pan.evtDone.listen((evt) => {
            this.genModal( "Within the center of the fountain is a Spark rune... the source of a fairy's magic...", "right", true);
        });
        this.nextStage = this.stageRuneRing;
    }

    stageRuneRing() {
        let target = { x: this.state.fountainBase.x + this.state.fountainBase.range - 10, y: this.state.fountainBase.y - 16};
        let pan = new PanToAction({target: target});
        this.state.actions.push(pan);
        pan.evtDone.listen((evt) => {
            this.genModal( "Every Spark rune has a range, the influence of the rune brings beauty to the world and lifts the surrounding gloom.", "right", true);
        });
        this.nextStage = this.stageRuneRing2;
    }

    stageRuneRing2() {
        this.genModal( "Alette can only cast her spark within the influence of a Spark rune.", "right", false);
        this.nextStage = this.stageRuneRelay;
    }

    stageRuneRelay() {
        let target = { x: this.state.exampleRelay.x + 8, y: this.state.exampleRelay.y - 16};
        let pan = new PanToAction({target: target});
        this.state.actions.push(pan);
        pan.evtDone.listen((evt) => {
            this.genModal( "Some runes act as a relay. Casting your spark on these runes will temporarily expand the influence and range of your magic.", "right", true);
        });
        this.nextStage = this.stageRunesOther;
    }

    stageRunesOther() {
        this.genModal( "Some runes will only be activated by helping out each of the gnomes. Find how to make the gnomes happy to unlock their associated runes and expand the magical influence.", "center", true);
        this.nextStage = this.stageVendor;
    }

    stageVendor() {
        let target = { x: this.state.vendor.x, y: this.state.vendor.y};
        let pan = new PanToAction({target: target});
        this.state.actions.push(pan);
        pan.evtDone.listen((evt) => {
            this.genModal( "This is Aodhan, one of the gnomes of Innis Fhaolain. He's the vendor for the village. Wonder what could be bothering him?", "left", true);
        });
        this.nextStage = this.stageVendor2;
    }

    stageVendor2() {
        this.genModal( "Try speaking with him to get clues on how you could possibly help him. You can also click on any NPC to view their current morale and find hints if you get stuck.", "center", false);
        this.nextStage = this.stageSpark;
    }

    stageSpark() {
        let pan = new PanToAction({target: this.state.player});
        this.state.actions.push(pan);
        pan.evtDone.listen((evt) => {
            this.genModal( "Experiment, explore, and have fun! Who knows where your Spark of imagination and kindness may lead?", "center", true);
        });
        this.nextStage = undefined;
    }

    onSkip(evt) {
        this.destroy();
    }

    onNext(evt) {
        // tear down current modal (if any)
        this.modal.destroy();
        if (this.nextStage) {
            this.nextStage();
        } else {
            this.destroy();
        }
    }

    // the callback handler for a generic key press
    onKeyDown(evt) {
        // escape causes options menu to close
        if (evt.key === "Escape") {
            // tear down current view
            this.destroy();
        } else if (evt.key === "z") {
            this.onNext({});
        }
    }

    // destroy is automatically called when a state is being torn down (by the state manager)
    destroy() {
        // house keeping to ensure that we don't leave around defunct callbacks on global systems (like the key callbacks)
        Keys.evtKeyPressed.ignore(this.onKeyDown);
        this.view.destroy();
        super.destroy();
    }


}
