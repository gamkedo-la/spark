export { UxTutorial };

import { Keys }             from "./base/keys.js";
import { Util }             from "./base/util.js";
import { Templates }        from "./templates.js";
import { UxCtrl }           from "./base/uxCtrl.js";
import { Generator }        from "./base/generator.js";
import { Hierarchy }        from "./base/hierarchy.js";

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
        this.hints = spec.hints || [];
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
                        Templates.menuButton("skipButton", "skip", { xxform: { left: .1, right: .7, top: .85, bottom: .025 }}),
                        Templates.menuButton("nextButton", "back", { xxform: { left: .7, right: .1, top: .85, bottom: .025 }}),
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
    }

    onSkip(evt) {
        console.log("onSkip");
        this.destroy();
    }

    onNext(evt) {
        // tear down current view
        console.log("onNext");
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
