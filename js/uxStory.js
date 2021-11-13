export { StoryFadeInAction, StoryFadeOutAction, StoryHideAction, StoryDialogAction, UxStory };

import { Action } from "./base/action.js";
import { Generator } from "./base/generator.js";
import { Hierarchy } from "./base/hierarchy.js";
import { Keys } from "./base/keys.js";
import { Util } from "./base/util.js";
import { UxCtrl } from "./base/uxCtrl.js";
import { Templates } from "./templates.js";
import { Text } from "./base/text.js";

class StoryFadeInAction extends Action {
    constructor(spec={}) {
        super(spec);
        this.xtarget = spec.xtarget; // should be one of main, actor1, actor2, dialog, overlay
        this.ttl = spec.ttl || 1000;
    }
    start(actor) {
        // actor is UxStory instance
        this.actor = actor;
        // lookup target
        this.target = actor[`${this.xtarget}Fader`];
        if (this.target) {
            this.target.maxFadeTTL = this.ttl;
            this.target.fadein = false;
            this.target.reset(true);
        }
    }
    update(ctx) {
        if (!this.target) {
            this.done = true;
        } else {
            this.done = this.target.faded;
        }
        return this.done;
    }
}

class StoryFadeOutAction extends Action {
    constructor(spec={}) {
        super(spec);
        this.xtarget = spec.xtarget; // should be one of main, actor1, actor2, dialog, overlay
        this.ttl = spec.ttl || 1000;
    }
    start(actor) {
        // actor is UxStory instance
        this.actor = actor;
        // lookup target
        this.target = actor[`${this.xtarget}Fader`];
        if (this.target) {
            this.target.maxFadeTTL = this.ttl;
            this.target.fadein = true;
            this.target.reset(true);
        }
    }
    update(ctx) {
        if (!this.target) {
            this.done = true;
        } else {
            this.done = this.target.faded;
        }
        return this.done;
    }
}

// hide all story elements
class StoryHideAction extends Action {
    constructor(spec={}) {
        super(spec);
        this.xtarget = spec.xtarget; // should be one of main, actor1, actor2, dialog
        this.ttl = spec.ttl || 1000;
    }
    start(actor) {
        // actor is UxStory instance
        this.story = actor;
        // hide all story elements except main fader
        this.story.actor1Chat.visible = false;
        this.story.actor2Chat.visible = false;
        this.story.dialogPanel.visible = false;
        this.story.skipButton.visible = false;
        this.story.actor1.visible = false;
        this.story.actor2.visible = false;
        this.story.dialogFader.visible = false;
        this.story.actor1Fader.visible = false;
        this.story.actor2Fader.visible = false;
        this.story.overlayFader.visible = false;
    }
    update(ctx) {
        this.done = true;
        return this.done;
    }
}

class StoryDialogAction extends Action {
    constructor(spec={}) {
        super(spec);
        this.speaker = spec.speaker; // should be actor1 or actor2
        this.ttl = spec.ttl || 5000;
        this.text = spec.text || "dialog";
        this.waitForDialogIn = true;
        this.waitForDialog = true;
        this.waitForDialogOut = true;
    }

    start(actor) {
        // actor is UxStory instance
        this.story = actor;
        // update dialog text
        this.story.dialogText.text = this.text;
        this.story.dialogText.sketch.color = (this.speaker === "actor1") ? this.story.actor1Color : this.story.actor2Color;
        // start by fading in dialog
        this.story.dialogFader.fadein = false;
        this.story.dialogFader.maxFadeTTL = 400;
        this.story.dialogFader.reset(true);
    }

    update(ctx) {
        let story = this.story;
        // wait for dialog to fade in...
        if (this.waitForDialogIn) {
            if (story.dialogFader.faded) {
                this.waitForDialogIn = false;
                // activate chat indicator
                if (this.speaker === "actor1") {
                    story.actor1Chat.visible = true;
                    story.actor2Chat.visible = false;
                } else {
                    story.actor1Chat.visible = false;
                    story.actor2Chat.visible = true;
                }
            }
        // wait for dialog delay
        } else if (this.waitForDialog) {
            this.ttl -= ctx.deltaTime;
            if (this.ttl <= 0) {
                this.waitForDialog = false;
                // hide chat indicator
                story.actor1Chat.visible = false;
                story.actor2Chat.visible = false;
                // fading out dialog
                story.dialogFader.fadein = true;
                story.dialogFader.maxFadeTTL = 400;
                story.dialogFader.reset(true);
            }
        } else if (this.waitForDialogOut) {
            if (story.dialogFader.faded) {
                this.waitForDialogOut = false;
                this.done = true;
            }
        }
        return this.done;
    }
}

class UxStory extends UxCtrl {
    
    cpost(spec) {
        super.cpost(spec);

        // construct the UI elements
        this.view = Generator.generate({
            cls: "UxCanvas",
            ui: true,
            cvsid: "uicanvas",
            xchildren: [
                Templates.fader("mainFader", true, {active: false}),
                Templates.panel(null, {xxform: {offset: 20, left: .1, right: .7, top: .5, bottom: .2}, xchildren: [
                    Templates.panel("actor1", { xsketch: {cls: "Media", tag: "fairy.right"}}),
                    Templates.fader("actor1Fader", true, {active: false}),
                ]}),
                Templates.panel("dialogPanel", { 
                    xxform: { left: .35, right: .35, top: .5, bottom: .5, height: 100 },
                    xchildren: [
                        Templates.panel(null, { xsketch: {cls: "Media", tag: "buttonDark"}}),
                        Templates.dialogText("dialogText"),
                        Templates.panel("actor1Chat", {xxform: {left: .4, right: .6, top: 1, bottom: 0, width: 32, height: 32}, xsketch: { cls: "Media", tag: "chatLeft"}, visible: false}),
                        Templates.panel("actor2Chat", {xxform: {left: .6, right: .4, top: 1, bottom: 0, width: 32, height: 32}, xsketch: { cls: "Media", tag: "chatRight"}, visible: false}),
                        Templates.fader("dialogFader", true, {xxform: {offset: -5}, active: false}),
                    ],
                }),
                Templates.panel(null, {xxform: {offset: 20, left: .7, right: .1, top: .5, bottom: .2}, xchildren: [
                    Templates.panel("actor2", { xsketch: {cls: "Media", tag: "fairyMother"}}),
                    Templates.fader("actor2Fader", true, {active: false}),
                ]}),
                Templates.menuButton("skipButton", "skip", { xxform: { left: .4, right: .4, top: .8, bottom: .15}}),
                Templates.fader("overlayFader", true, {active: false, visible: false}),
            ],
        });

        this.script = spec.script || [];
        this.actor1Color = "rgba(250,214,32,1)";
        this.actor2Color = Templates.playTextColor;

        // lookup UI elements
        this.dialogPanel = Hierarchy.find(this.view, (v) => v.tag === "dialogPanel");
        this.dialogText = Hierarchy.find(this.view, (v) => v.tag === "dialogText");
        this.skipButton = Hierarchy.find(this.view, (v) => v.tag === "skipButton");
        this.actor1Chat = Hierarchy.find(this.view, (v) => v.tag === "actor1Chat");
        this.actor2Chat = Hierarchy.find(this.view, (v) => v.tag === "actor2Chat");
        this.actor1 = Hierarchy.find(this.view, (v) => v.tag === "actor1");
        this.actor2 = Hierarchy.find(this.view, (v) => v.tag === "actor2");
        this.mainFader = Hierarchy.find(this.view, (v) => v.tag === "mainFader");
        this.dialogFader = Hierarchy.find(this.view, (v) => v.tag === "dialogFader");
        this.actor1Fader = Hierarchy.find(this.view, (v) => v.tag === "actor1Fader");
        this.actor2Fader = Hierarchy.find(this.view, (v) => v.tag === "actor2Fader");
        this.overlayFader = Hierarchy.find(this.view, (v) => v.tag === "overlayFader");
        // event handling...
        Util.bind(this, "onKeyDown", "onBack");
        Keys.evtKeyPressed.listen(this.onKeyDown);
        this.skipButton.evtClicked.listen(this.onBack);
    }

    updateScript(ctx) {
        // check if current action is done
        let updated = false;
        if (this.currentAction) {
            this.currentAction.update(ctx);
            if (this.currentAction.done) {
                //console.log(`finished action: ${this.currentAction}`);
                this.currentAction = undefined;
                updated = true;
            }
        }
        // prep next action from script
        if (!this.currentAction && this.script.length) {
            this.currentAction = this.script.shift();
            this.currentAction.start(this);
            //console.log(`started action: ${this.currentAction}`);
            updated = true;
        }
        // if no actions left in script, quit
        if (!this.currentAction) {
            this.onBack();
        }
        return updated;
    }

    updateDialog(ctx) {
        let updated = false;
        if (this.dialogText.text !== this.lastText) {
            this.lastText = this.dialogText.text;
            let height = Text.measureWrapHeight(this.font, this.dialogText.text, this.dialogText.width) + 25;
            this.dialogPanel.xform.height = height;
            updated = true;
        }
        return updated;
    }

    // EVENT CALLBACKS -----------------------------------------------------
    onKeyDown(evt) {
        if (evt.key === 'Escape' || evt.key === 'z') {
            this.onBack();
        }
    }

    onBack() {
        // tear down current view
        this.destroy();
    }

    // METHODS -------------------------------------------------------------
    destroy() {
        Keys.evtKeyPressed.ignore(this.onKeyDown);
        this.view.destroy();
        super.destroy();
    }

    iupdate(ctx) {
        this.updated |= this.updateScript(ctx);
        this.updated |= this.updateDialog(ctx);
        return false;
    }

}