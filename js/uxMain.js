export { UxMainCtrl };

import { UxPlayCtrl }   from "./uxPlay.js";
import { UxCtrl }       from "./base/uxCtrl.js";
import { Color }        from "./base/color.js";
import { Hierarchy }    from "./base/hierarchy.js";

class UxMainCtrl extends UxCtrl {
    cpre(spec) {
        super.cpre(spec);
        const assets = spec.assets || this.base.assets;
        const buttonTemplate = {
            cls: "UxButton",
            //mouseEnteredSound: assets.generate("beepUp"),
            //mouseLeftSound: assets.generate("beepDown"),
            xunpressed: assets.get("btnGoldOpaqS2"),
        }
        spec.xview = {
            cls: "UxCanvas",
            cvsid: "canvas",
            tag: "cvs.0",
            xchildren: [
                {
                    cls: "UxPanel",
                    tag: "menuPanel",
                    xsketch: assets.get("btnGoldTranS1"),
                    xxform: { top: .1, bottom: .1, left: .25, right: .25 },
                    xchildren: [
                        {
                            cls: "UxText",
                            tag: "titleText",
                            xxform: { top: .05, bottom: .875},
                            xtext: {
                                color: new Color(255,0,0,.75),
                                text: "SPARK",
                            },
                        },
                        {
                            cls: "UxPanel",
                            tag: "buttonPanel",
                            xsketch: {},
                            xxform: { top: .15, bottom: .05, left: .15, right: .15},
                            xchildren: [
                                Object.assign({}, buttonTemplate, {
                                    tag: "startButton",
                                    xxform: { left: .2, top:.15, bottom: .75, right: .2},
                                    xtext: { text: "Start" },
                                }), 
                                Object.assign({}, buttonTemplate, {
                                    tag: "optionsButton",
                                    xxform: { left: .2, top:.35, bottom: .55, right: .2},
                                    xtext: { text: "Options" },
                                }),
                                Object.assign({}, buttonTemplate, {
                                    tag: "creditsButton",
                                    xxform: { left: .2, top:.55, bottom: .35, right: .2},
                                    xtext: { text: "Credits" },
                                }),
                            ],
                        },
                    ],
                },
            ]
        };
    }
    cpost(spec) {
        super.cpost(spec);
        // lookup UI elements
        this.startButton = Hierarchy.find(this.view, (v) => v.tag === "startButton");
        this.optionsButton = Hierarchy.find(this.view, (v) => v.tag === "optionsButton");
        this.creditsButton = Hierarchy.find(this.view, (v) => v.tag === "creditsButton");
        // hook actions
        this.startButton.evtClicked.listen(this.onStart.bind(this));
        this.optionsButton.evtClicked.listen(this.onOptions.bind(this));
        this.creditsButton.evtClicked.listen(this.onCredits.bind(this));
    }

    onStart(evt) {
        console.log("onStart");
        let ctrl = new UxPlayCtrl();
        this.base.ctrlMgr.replace(ctrl);
    }

    onOptions(evt) {
        console.log("onOptions");
    }

    onCredits(evt) {
        console.log("onCredits");
    }

}
