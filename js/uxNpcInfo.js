export { UxNpcInfo };

import { Color } from "./base/color.js";
import { Generator } from "./base/generator.js";
import { Hierarchy } from "./base/hierarchy.js";
import { Keys } from "./base/keys.js";
import { Util } from "./base/util.js";
import { UxCtrl } from "./base/uxCtrl.js";
import { Templates } from "./templates.js";

class UxNpcInfo extends UxCtrl {
    
    cpost(spec) {
        super.cpost(spec);

        this.npc = spec.npc;

        // fields needed for UI
        let npcName = (this.npc && this.npc.name) ? this.npc.name : "<name>";
        let bio = (this.npc && this.npc.bio) ? this.npc.bio.info : "<bio>";
        let job = (this.npc && this.npc.bio) ? this.npc.bio.job : "<job>";
        let likes = (this.npc && this.npc.bio) ? this.npc.bio.likes : "<likes>";
        let dislikes = (this.npc && this.npc.bio) ? this.npc.bio.dislikes : "<dislikes>";
        let portraitTag = (this.npc && this.npc.portraitTag) ? this.npc.portraitTag : "gnome.portrait";

        // construct the UI elements
        this.view = Generator.generate({
            cls: "UxCanvas",
            ui: true,
            cvsid: "uicanvas",
            xchildren: [
                {
                    cls: "UxPanel",
                    tag: "infoPanel",
                    xsketch: {cls: "Media", tag: "buttonOff"},
                    xxform: { left: .2, right: .2, top: .3, bottom: .3 },
                    xchildren: [
                        Templates.panel(null, {xxform: { bottom: .2, right: .6, offset: 20 }, xchildren: [
                            {
                                cls: "UxPanel",
                                xsketch: { cls: 'Rect', color: new Color(223,221,154,1), xfitter: { cls: "FitToParent" }, width: 50, height: 50, lockRatio: true, },
                                xxform: { offset: 5 },
                            },
                            {
                                cls: "UxPanel",
                                xsketch: Object.assign( {lockRatio: true, xfitter: { cls: "FitToParent" }}, {cls: "Media", tag: portraitTag}),
                                xxform: { offset: 5 },
                            },
                            {
                                cls: "UxPanel",
                                xsketch: Object.assign( {lockRatio: true, xfitter: { cls: "FitToParent" }}, {cls: "Media", tag: "buttonTrans.small"} ),
                            },
                        ]}),
                        Templates.playText(null, npcName, {color: Templates.menuTextColor, xxform: {offset: 10, top: .75, right: .6, bottom: .05}}),
                        Templates.panel(null, {xxform: { left: .35, offset: 20 }, xchildren: [
                            // bio line
                            Templates.playText(null, "bio:", {xxform: {offset: 5, right: .6,                            top: 0/5, bottom: 1-1/5}}),
                            Templates.playInput(null, bio, {active: false, xxform: {offset: 5, left: .4,                top: 0/5, bottom: 1-1/5}}),
                            // profession line
                            Templates.playText(null, "job:", {xxform: {offset: 5, right: .6,                            top: 1/5, bottom: 1-2/5}}),
                            Templates.playInput(null, job, {active: false, xxform: {offset: 5, left: .4,                top: 1/5, bottom: 1-2/5}}),
                            // likes line
                            Templates.playText(null, "likes:", {xxform: {offset: 5, right: .6,                          top: 2/5, bottom: 1-3/5}}),
                            Templates.playInput(null, likes, {active: false, xxform: {offset: 5, left: .4,              top: 2/5, bottom: 1-3/5}}),
                            // dislikes line
                            Templates.playText(null, "dislikes:", {xxform: {offset: 5, right: .6,                       top: 3/5, bottom: 1-4/5}}),
                            Templates.playInput(null, dislikes, {active: false, xxform: {offset: 5, left: .4,           top: 3/5, bottom: 1-4/5}}),
                            // morale/hint line
                            Templates.playText(null, "morale:", {xxform: {offset: 5, right: .6,                         top: 4/5, bottom: 1-5/5}}),
                            Templates.panel(null, {
                                xsketch: { cls: "Media", tag: "dislike", lockRatio: true}, 
                                xxform: {offset: 5, left: .4, right: .4,                                                top: 4/5, bottom: 1-5/5}}),
                            Templates.menuButton("hintButton", "hint", { xxform: { left: .6,                            top: 4/5, bottom: 1-5/5 }}),
                        ]}),
                    ],
                },
                Templates.menuButton("backButton", "back", { xxform: { left: .4, right: .4, top: .7, bottom: .25}}),
            ],
        });
        // lookup UI elements
        this.hintButton = Hierarchy.find(this.view, (v) => v.tag === "hintButton");
        this.backButton = Hierarchy.find(this.view, (v) => v.tag === "backButton");
        // hide hint button for alette
        if (this.npc.name === "Alette") {
            this.hintButton.visible = false;
            this.hintButton.active = false;
        }
        // event handling...
        Util.bind(this, "onKeyDown", "onHint", "onBack");
        Keys.evtKeyPressed.listen(this.onKeyDown);
        this.hintButton.evtClicked.listen(this.onHint);
        this.backButton.evtClicked.listen(this.onBack);
    }

    // EVENT CALLBACKS -----------------------------------------------------
    onKeyDown(evt) {
        if (evt.key === 'Escape' || evt.key === 'z') {
            this.onBack();
        }
    }

    onHint(evt) {
        console.log("onHint");
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

}