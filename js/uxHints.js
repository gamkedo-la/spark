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
                    xxform: { border: .3 }, 
                    xsketch: {cls: "Media", tag: "buttonOff"},
                    xchildren: [
                        Templates.menuText(null, "hints", {xxform: {bottom: .8, left: .4, right: .4}}),
                        Templates.panel("hintSubPanel", { xxform: { border: .3 }, xchildren: [
                        ]}),
                        Templates.menuButton("backButton", "back", { xxform: { left: .4, right: .4, top: .85, bottom: .025 }}),
                    ],
                }),
            ],
        });
        // lookup UI elements
        this.backButton = Hierarchy.find(this.view, (v) => v.tag === "backButton");
        // event handling...
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
