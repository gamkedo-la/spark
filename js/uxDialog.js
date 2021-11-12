export { UxDialogCtrl };

import { Base } from "./base/base.js";
import { Color } from "./base/color.js";
import { Font } from "./base/font.js";
import { Generator } from "./base/generator.js";
import { Hierarchy } from "./base/hierarchy.js";
import { Keys } from "./base/keys.js";
import { Text } from "./base/text.js";
import { Util } from "./base/util.js";
import { UxCtrl } from "./base/uxCtrl.js";
import { Templates } from "./templates.js";

class UxDialogCtrl extends UxCtrl {
    
    cpost(spec) {
        super.cpost(spec);

        this.dialog = spec.dialog;
        this.responseColor = Templates.playTextColor;
        const titleColor = spec.titleColor || Templates.menuTextColor;
        const dialogColor = spec.dialogColor || Templates.playTextColor2;
        this.font = spec.font || new Font({size:25});
        this.media = spec.media || Base.instance.media;

        // construct the UI elements
        this.view = Generator.generate({
            cls: "UxCanvas",
            ui: true,
            cvsid: "uicanvas",
            xchildren: [
                {
                    cls: "UxPanel",
                    tag: "dialogPanel",
                    xsketch: Object.assign({}, this.media.get("buttonDark"), {xfitter: { cls: "FitToParent" }}),
                    xxform: { left: .2, right: .2, top: .5, bottom: .5, height: 100 },
                    xchildren: [
                        {
                            cls: "UxButton",
                            tag: "titleText",
                            xtext: { color: titleColor, text: "title", xfitter: {cls: "FitToParent", top: .2, bottom: .125} },
                            xxform: {top: 0, bottom:1, left: .35, right: .35, height: 35},
                            xunpressed: Object.assign({}, this.media.get("buttonOff.small")),
                            active: false,
                        },
                        {
                            cls: "UxText",
                            tag: "dialogText",
                            xtext: { color: dialogColor, text: "dialog", wrap: true, fit: false, font: this.font},
                            xxform: { otop: 45, oleft: 20, oright: 15 },
                        },
                    ],
                },
            ],
        });
        // lookup UI elements
        this.titleText = Hierarchy.find(this.view, (v) => v.tag === "titleText");
        this.dialogPanel = Hierarchy.find(this.view, (v) => v.tag === "dialogPanel");
        this.dialogText = Hierarchy.find(this.view, (v) => v.tag === "dialogText");
        this.responseButtons = [];
        // event handling...
        Util.bind(this, "onKeyDown");
        Keys.evtKeyPressed.listen(this.onKeyDown);
    }

    // METHODS -------------------------------------------------------------

    addResponseButton(parent, responseColor, response, left, right) {
        let bspec = {
            cls: "UxButton",
            dfltDepth: parent.depth + 1,
            dfltLayer: parent.layer,
            parent: parent,
            xxform: {parent: parent.xform, top: 1, bottom:0, left: left, right: right, height: 32},
            xpressed: { cls: 'Media', tag: "buttonPress.small" },
            xunpressed: { cls: 'Media', tag: "buttonOff.small" },
            xhighlight: { cls: 'Media', tag: "buttonHover.small" },
            xtext: {color: responseColor, text: response, xfitter: {cls: "FitToParent", top: .2, bottom: .15} },
        };
        let b = Generator.generate(bspec);
        if (b) {
            b.evtClicked.listen((evt) => { this.dialog.chooseResponse(response)});
            parent.adopt(b);
        }
        return b;
    }

    onKeyDown(evt) {
        if (evt.key === 'Escape' || evt.key === 'z') { // Z
            this.onBack();
        }
    }

    updateTitle(ctx) {
        if (this.dialog.title !== this.lastTitle) {
            this.lastTitle = this.dialog.title;
            this.titleText.text = this.dialog.title;
        }
    }

    updateDialog(ctx) {
        if (this.dialog.text !== this.lastText) {
            this.lastText = this.dialog.text;
            let height = Text.measureWrapHeight(this.font, this.dialog.text, this.dialogText.width) + 35;
            this.dialogPanel.xform.height = height;
            this.dialogText.text = this.dialog.text;
        }
    }

    updateResponses(ctx) {
        let responses = this.dialog.responses;
        if (!Util.arraysEqual(responses, this.lastResponses)) {
            this.lastResponses = responses.slice(0);
            for (const b of this.responseButtons) b.destroy();
            this.responseButtons = [];
            if (responses.length === 1) {
                this.responseButtons.push(this.addResponseButton(this.dialogPanel, this.responseColor, responses[0], .35, .35));
            } else if (responses.length === 2) {
                this.responseButtons.push(this.addResponseButton(this.dialogPanel, this.responseColor, responses[0], .15, .55));
                this.responseButtons.push(this.addResponseButton(this.dialogPanel, this.responseColor, responses[1], .55, .15));
            } else if (responses.length === 3) {
                this.responseButtons.push(this.addResponseButton(this.dialogPanel, this.responseColor, responses[0], .05, .7));
                this.responseButtons.push(this.addResponseButton(this.dialogPanel, this.responseColor, responses[1], .375, .375));
                this.responseButtons.push(this.addResponseButton(this.dialogPanel, this.responseColor, responses[2], .7, .05));
            }
        }
    }

    iupdate(ctx) {
        // check for dialog completion
        if (this.dialog.done) this.onBack();
        this.updateTitle(ctx);
        this.updateDialog(ctx);
        this.updateResponses(ctx);
    }

    // EVENT CALLBACKS -----------------------------------------------------
    onBack() {
        // restore game controller
        //ctrlSys.pop();
        // tear down current view
        this.destroy();
    }

    destroy() {
        this.dialog.done = true;
        Keys.evtKeyPressed.ignore(this.onKeyDown);
        this.view.destroy();
        super.destroy();
    }

}