export { UxTutorial };

import { Keys }             from "./base/keys.js";
import { Util }             from "./base/util.js";
import { Templates }        from "./templates.js";
import { UxCtrl }           from "./base/uxCtrl.js";
import { Generator }        from "./base/generator.js";
import { Hierarchy }        from "./base/hierarchy.js";
import { Font }             from "./base/font.js";
import { Text }             from "./base/text.js";

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
                        Templates.menuText(null, "tutorial", {xxform: {otop: 20, bottom: .85}}),
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

    stageWelcome() {
        let xmodal = {
            cls: "UxPanel",
            xsketch: { cls: "Media", tag: "buttonLight" },
            xxform: { left: .2, right: .2, top: .4, bottom: .4 },
            xchildren: [
                Templates.playText(null, "welcome to Innis Fhaolain!!!", {xxform: { offset: 15 }}),
            ]
        };
        this.modal = Generator.generate(xmodal);
        this.panel.adopt(this.modal);
        this.nextStage = this.stageAletteShow;
    }

    stageAletteShow() {
        let xmodal = Templates.panel(null, {
            xchildren: [
                Templates.panel(null, {
                    xsketch: { cls: "Media", tag: "markerLeft", lockRatio: true },
                    xxform: { left: .535, right: .465, top: .45, bottom: .55, width: 32, height: 32 },
                }),
                Templates.panel(null, {
                    xsketch: { cls: "Media", tag: "buttonLight" },
                    xxform: { left: .55, right: .05, top: .3, bottom: .5 },
                    xchildren: [
                        Templates.playText(null, "this is Alette, your character", {xxform: { offset: 15 }}),
                    ],
                }),
            ],
        });
        this.modal = Generator.generate(xmodal);
        this.panel.adopt(this.modal);
        this.nextStage = this.stageAletteGuide;
    }

    stageAletteGuide() {
        let text = "guide her to help the gnomes find their spark";
        let xmodal = Templates.panel(null, {
            xchildren: [
                Templates.panel(null, {
                    xsketch: { cls: "Media", tag: "buttonLight" },
                    xxform: { left: .55, right: .05, top: .4, bottom: .6, height: 100 },
                    xchildren: [
                        {
                            cls: "UxText",
                            tag: "modalText",
                            xtext: { color: Templates.playTextColor, text: "replace", wrap: true, fit: false, font: this.font},
                            xxform: { otop: 15, oleft: 20, oright: 5 },
                        },
                    ],
                }),
            ],
        });
        this.modal = Generator.generate(xmodal);
        this.panel.adopt(this.modal);
        this.modalText = Hierarchy.find(this.modal, (v) => v.tag === "modalText");
        let height = Text.measureWrapHeight(this.font, text, this.modalText.width) + 25;
        this.modal.xform.height = height;
        this.modalText.text = text;
        this.nextStage = this.stageAletteMagic;
    }

    stageAletteMagic() {
        let text = "Alette has powerful fairy magic that she casts with the Z key, this is Alette's Spark!";
        let xmodal = Templates.panel(null, {
            xchildren: [
                Templates.panel("modalPanel", {
                    xsketch: { cls: "Media", tag: "buttonLight", xfitter: { cls: "FitToParent" }},
                    xxform: { top: .4, bottom: .6, left: .1, right: .1, height: 50 },
                    xchildren: [
                        {
                            cls: "UxText",
                            tag: "modalText",
                            xtext: { color: Templates.playTextColor, text: "replace", wrap: true, fit: false, font: this.font},
                            xxform: { otop: 15, oleft: 20, oright: 5 },
                        },
                    ],
                }),
            ],
        });
        this.modal = Generator.generate(xmodal);
        this.panel.adopt(this.modal);
        this.modalPanel = Hierarchy.find(this.modal, (v) => v.tag === "modalPanel");
        this.modalText = Hierarchy.find(this.modal, (v) => v.tag === "modalText");
        let height = Text.measureWrapHeight(this.font, text, this.modalText.width) + 5;
        this.modalPanel.xform.height = height;
        this.modalText.text = text;
        this.nextStage = undefined;
    }

    stageRuneShow() {
        // FIXME:
        /*
        this.actions.push(new PanToAction({target: this.fountainBase}));

        let text = "Alette has powerful fairy magic that she casts with the Z key, this is Alette's Spark!";
        let xmodal = Templates.panel(null, {
            xchildren: [
                Templates.panel("modalPanel", {
                    xsketch: { cls: "Media", tag: "buttonLight", xfitter: { cls: "FitToParent" }},
                    xxform: { top: .4, bottom: .6, left: .1, right: .1, height: 50 },
                    xchildren: [
                        {
                            cls: "UxText",
                            tag: "modalText",
                            xtext: { color: Templates.playTextColor, text: "replace", wrap: true, fit: false, font: this.font},
                            xxform: { otop: 15, oleft: 20, oright: 5 },
                        },
                    ],
                }),
            ],
        });
        this.modal = Generator.generate(xmodal);
        this.panel.adopt(this.modal);
        this.modalPanel = Hierarchy.find(this.modal, (v) => v.tag === "modalPanel");
        this.modalText = Hierarchy.find(this.modal, (v) => v.tag === "modalText");
        let height = Text.measureWrapHeight(this.font, text, this.modalText.width) + 5;
        this.modalPanel.xform.height = height;
        this.modalText.text = text;
        this.nextStage = undefined;
        */
    }

    onSkip(evt) {
        console.log("onSkip");
        this.destroy();
    }

    onNext(evt) {
        console.log("onNext");
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
