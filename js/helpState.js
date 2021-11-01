export { HelpState };

import { State }            from "./base/state.js";
import { Keys }             from "./base/keys.js";
import { Util }             from "./base/util.js";
import { Templates }        from "./templates.js";
import { Base }             from "./base/base.js";

class HelpState extends State {

    /**
     * The pre-constructor: sets up data used by the constructor to build out the state, which includes building out the UI elements
     * and state management.
     * @param {*} spec 
     */
    cpre(spec) {
        super.cpre(spec);
        spec.xview = {
            cls: "UxCanvas",
            cvsid: "canvas",
            xchildren: [
                Templates.panel("helpPanel", { xxform: { top: .2, bottom: .2, left: .2, right: .2}, xchildren: [
                    //Templates.panel("objectivePanel",   { xsketch: {cls: "Media", tag: "buttonTrans"}, xxform: { top: 0, bottom: .8}, xchildren: [
                    Templates.panel("objectivePanel",   { xxform: { top: 0, bottom: .8}, xchildren: [
                        Templates.menuText(null, "objective", {xxform: { left: 0, right: .7}}),
                        Templates.panel(null, { xsketch: {cls: "Media", tag: "buttonTrans.small"}, xxform: { left: .3}, xchildren: [
                            Templates.playText(null, "use your spark skill to solve puzzles", {xxform: {bottom: .5}} ),
                            Templates.playText(null, "and make all the gnomes happy!", {xxform: {top: .5}} ),
                        ]}),
                    ]}),
                    Templates.panel("hintsPanel", { xxform: { top: .2, bottom: .5}, xchildren: [
                        Templates.menuText(null, "  hints  ", {xxform: { left: 0, right: .7}}),
                        Templates.panel(null, { xsketch: {cls: "Media", tag: "buttonTrans.small"}, xxform: { left: .3}, xchildren: [
                            Templates.playText(null, "talk to gnomes to try to discover how to help",   {xxform: { top: 0, bottom: .67}}),
                            Templates.playText(null, "click on gnomes to view likes/dislikes",          {xxform: { top: .33, bottom: .33}}),
                            Templates.playText(null, "try sparking different objects in game",          {xxform: { top: .67, bottom: 0}}),
                        ]}),
                    ]}),
                    Templates.panel("keysPanel", { xxform: { top: .5, bottom: .1}, xchildren: [
                        Templates.menuText(null, "  keys  ", {xxform: { left: 0, right: .7}}),
                        Templates.panel(null, { xsketch: {cls: "Media", tag: "buttonTrans.small"}, xxform: { left: .3}, xchildren: [
                            Templates.playText(null, "z - primary action, spark, talk, interact",       {xxform: { top: 0/4, bottom: 1-1/4}}),
                            Templates.playText(null, "wasd/arrows - movement",                          {xxform: { top: 1/4, bottom: 1-2/4}}),
                            Templates.playText(null, "m - mute",                                        {xxform: { top: 2/4, bottom: 1-3/4}}),
                            Templates.playText(null, "escape - options menu",                           {xxform: { top: 3/4, bottom: 1-4/4}}),
                        ]}),
                    ]}),
                    Templates.menuButton("backButton", "back", { xxform: { left: .2, right: .2, top: .9, bottom: 0 }}),
                ]}),
            ],
        };
    }

    // the post constructor.  called after the main constructor has been executed and is used to wire state specific logic
    cpost(spec) {
        super.cpost(spec);
        // NOTE: to avoid errors due to javascript binding of objects, this utility method is called on every event callback function
        // this is equavilent of calling this.onKeyDown = this.onKeyDown.bind(this);  // this tells js to bind the local "this" variable to the given "this".
        Util.bind(this, "onKeyDown", "onBack");
        // lookup ui element references... 
        this.backButton = this.findFirst(v=>v.tag === "backButton");

        // wire event handlers
        Keys.evtKeyPressed.listen(this.onKeyDown);
        // -- listen for button events...
        this.backButton.evtClicked.listen(this.onBack);
    }

    onBack(evt) {
        Base.instance.stateMgr.pop();
    }

    // the callback handler for a generic key press
    onKeyDown(evt) {
        // escape causes options menu to close
        if (evt.key === "Escape") {
            Base.instance.stateMgr.pop();
        }
    }

    // destroy is automatically called when a state is being torn down (by the state manager)
    destroy() {
        // house keeping to ensure that we don't leave around defunct callbacks on global systems (like the key callbacks)
        Keys.evtKeyPressed.ignore(this.onKeyDown);
        super.destroy();
    }


}
