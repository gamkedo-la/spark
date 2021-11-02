export { UxHints };

import { Keys }             from "./base/keys.js";
import { Util }             from "./base/util.js";
import { Templates }        from "./templates.js";
import { UxCtrl }           from "./base/uxCtrl.js";
import { Generator } from "./base/generator.js";
import { Hierarchy } from "./base/hierarchy.js";

class UxHints extends UxCtrl {

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
        this.hints = spec.hints || [];
        // construct the UI elements
        this.view = Generator.generate({
            cls: "UxCanvas",
            ui: true,
            cvsid: "uicanvas",
            xchildren: [
                Templates.panel("hintPanel", { 
                    xxform: { border: .2 }, 
                    xsketch: {cls: "Media", tag: "buttonDark"},
                    xchildren: [
                        Templates.menuText(null, "hints", {xxform: {otop: 20, bottom: .85}}),
                        Templates.panel("hintSubPanel", { xxform: { top: .15, bottom: .15, offset: 10 }, xchildren: [
                            Templates.hintSelectButton("hint1", "~~~~~~~~~~ reveal ~~~~~~~~~~", "hint1", { xxform: { top: 0/5, bottom: 1-1/5 }}),
                            Templates.hintSelectButton("hint2", "~~~~~~~~~~ reveal ~~~~~~~~~~", "hint2", { xxform: { top: 1/5, bottom: 1-2/5 }}),
                            Templates.hintSelectButton("hint3", "~~~~~~~~~~ reveal ~~~~~~~~~~", "hint3", { xxform: { top: 2/5, bottom: 1-3/5 }}),
                            Templates.hintSelectButton("hint4", "~~~~~~~~~~ reveal ~~~~~~~~~~", "hint4", { xxform: { top: 3/5, bottom: 1-4/5 }}),
                            Templates.hintSelectButton("hint5", "~~~~~~~~~~ reveal ~~~~~~~~~~", "hint5", { xxform: { top: 4/5, bottom: 1-5/5 }}),
                        ]}),
                        Templates.menuButton("backButton", "back", { xxform: { left: .4, right: .4, top: .85, bottom: .025 }}),
                    ],
                }),
            ],
        });
        // lookup UI elements
        this.backButton = Hierarchy.find(this.view, (v) => v.tag === "backButton");
        // event handling...
        for (let i=1; i<=5; i++) {
            // delete hints panels if not used
            if (i-1 >= this.hints.length) {
                let panel = Hierarchy.find(this.view, (v) => v.tag === `hint${i}`);
                if (panel) panel.destroy();
            } else {
                let button = Hierarchy.find(this.view, (v) => v.tag === `hint${i}.button`);
                if (button) button.evtClicked.listen((evt)=> { evt.actor.destroy(); });
                let text = Hierarchy.find(this.view, (v) => v.tag === `hint${i}.text`);
                if (text) text.text = this.hints[i-1];
            }
        }
        Util.bind(this, "onKeyDown", "onHint", "onBack");
        Keys.evtKeyPressed.listen(this.onKeyDown);
        //this.hintButton.evtClicked.listen(this.onHint);
        this.backButton.evtClicked.listen(this.onBack);
    }

    onHint(evt) {
        console.log("onHint");
    }

    onBack(evt) {
        // tear down current view
        this.destroy();
    }

    // the callback handler for a generic key press
    onKeyDown(evt) {
        // escape causes options menu to close
        if (evt.key === "Escape") {
            // tear down current view
            this.destroy();
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
