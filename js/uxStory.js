export { UxStory };

import { Color } from "./base/color.js";
import { Generator } from "./base/generator.js";
import { Hierarchy } from "./base/hierarchy.js";
import { Keys } from "./base/keys.js";
import { Util } from "./base/util.js";
import { UxCtrl } from "./base/uxCtrl.js";
import { Templates } from "./templates.js";

class UxStory extends UxCtrl {
    
    cpost(spec) {
        super.cpost(spec);

        // fields needed for UI
        /*
        let npcName = (this.npc && this.npc.name) ? this.npc.name : "<name>";
        let bio = (this.npc && this.npc.bio) ? this.npc.bio.info : "<bio>";
        let job = (this.npc && this.npc.bio) ? this.npc.bio.job : "<job>";
        let likes = (this.npc && this.npc.bio) ? this.npc.bio.likes : "<likes>";
        let dislikes = (this.npc && this.npc.bio) ? this.npc.bio.dislikes : "<dislikes>";
        let portraitTag = (this.npc && this.npc.portraitTag) ? this.npc.portraitTag : "gnome.portrait";
        // FIXME: tie to npc morale
        let moraleTag = "like";
        */

        // construct the UI elements
        this.view = Generator.generate({
            cls: "UxCanvas",
            ui: true,
            cvsid: "uicanvas",
            xchildren: [
                Templates.panel(null, {xsketch: {cls: "Rect", color: "black"}}),
                Templates.panel(null, {xxform: {offset: 20, left: .1, right: .7, top: .5, bottom: .2}, xchildren: [
                    Templates.panel("actor1", { xsketch: {cls: "Media", tag: "fairy.right"}}),
                ]}),
                Templates.panel(null, {xxform: {left: .3, right: .3, top: .3, bottom: .4}, xchildren: [
                    Templates.panel(null, { xsketch: {cls: "Media", tag: "buttonDark"}}),
                ]}),
                Templates.panel("leftChat", {xxform: {left: .4, right: .6, top: .6, bottom: .4, width: 32, height: 32}, xsketch: { cls: "Media", tag: "chatLeft"}}),
                Templates.panel("rightChat", {xxform: {left: .6, right: .4, top: .6, bottom: .4, width: 32, height: 32}, xsketch: { cls: "Media", tag: "chatRight"}}),
                Templates.panel(null, {xxform: {left: .7, right: .1, top: .5, bottom: .2}, xchildren: [
                    Templates.panel("actor2", { xsketch: {cls: "Media", tag: "fairy.left"}}),
                ]}),
                    /*
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
                                xsketch: { cls: "Media", tag: moraleTag, lockRatio: true}, 
                                xxform: {offset: 5, left: .4, right: .4,                                                top: 4/5, bottom: 1-5/5}}),
                            Templates.menuButton("hintButton", "hint", { xxform: { left: .6,                            top: 4/5, bottom: 1-5/5 }}),
                        ]}),
                    ],
                    */
                Templates.menuButton("skipButton", "skip", { xxform: { left: .4, right: .4, top: .8, bottom: .15}}),
            ],
        });

        // lookup UI elements
        //this.hintButton = Hierarchy.find(this.view, (v) => v.tag === "hintButton");
        this.skipButton = Hierarchy.find(this.view, (v) => v.tag === "skipButton");
        // event handling...
        //Util.bind(this, "onKeyDown", "onHint", "onBack");
        Util.bind(this, "onKeyDown", "onBack");
        Keys.evtKeyPressed.listen(this.onKeyDown);
        //this.hintButton.evtClicked.listen(this.onHint);
        this.skipButton.evtClicked.listen(this.onBack);
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

}