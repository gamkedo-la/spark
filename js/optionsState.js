export { OptionsState };

import { State }            from "./base/state.js";
import { Keys }             from "./base/keys.js";
import { Util }             from "./base/util.js";
import { Templates }        from "./templates.js";
import { MenuState }        from "./menuState.js";
import { Fmt }              from "./base/fmt.js";
import { Base }             from "./base/base.js";
import { Color }            from "./base/color.js";
import { HelpState } from "./helpState.js";

class OptionsState extends State {

    /**
     * The pre-constructor: sets up data used by the constructor to build out the state, which includes building out the UI elements
     * and state management.
     * @param {*} spec 
     */
    cpre(spec) {
        super.cpre(spec);
        // this is the main UI spec.  It's a json-like structure that contains data that maps out all the definitions and options for the UI elements.
        // the top level UI element is a representation of the game canvas.  All other UI elements are a child of this root canvas.
        spec.xview = {
            cls: "UxCanvas",
            cvsid: "canvas",
            // a list of first level children of the canvas
            xchildren: [
                Templates.panel("mainButtons", { xxform: { top: .2, bottom: .2, left: .3, right: .3}, xchildren: [
                    {
                        cls: "UxPanel",
                        xxform: { top: 0/4, bottom: 1-2/4 },
                        xsketch: { cls: 'Media', tag: "buttonTrans" },
                        xchildren: [
                            Templates.panel(null, { xxform: { offset: 10 }, xchildren: [
                                Templates.menuText(null, "volume control", {xxform: { top: 0/3, bottom: 1-1/3}}),
                                Templates.menuText(null, "   sfx   ", {xxform: { top: 1/3, bottom: 1-2/3, right: .7}}),
                                Templates.menuSlider("sfxVolumeSlider", {xxform: { top: 1/3, bottom: 1-2/3, left: .3}}),
                                Templates.menuText(null, " music ", {xxform: { top: 2/3, bottom: 1-3/3, right: .7}}),
                                Templates.menuSlider("musicVolumeSlider", {xxform: { top: 2/3, bottom: 1-3/3, left: .3}}),
                            ]}),
                        ],
                    },
                    Templates.menuButton("helpButton", "help", { xxform: { top: 2/4, bottom: 1-3/4 }}),
                    Templates.menuButton("backButton", "back", { xxform: { top: 3/4, bottom: 1-4/4 }}),
                ]}),
            ],
        };
        // the constructor takes the spec.xview attribute and generates all of the UI elements.  The top level view (the canvas) is stored as the class attribute "view".
        // Other UI elements can be looked up by searching for them, either using hierarchy functions or a class find* functions.
    }

    // the post constructor.  called after the main constructor has been executed and is used to wire state specific logic
    cpost(spec) {
        super.cpost(spec);
        // NOTE: to avoid errors due to javascript binding of objects, this utility method is called on every event callback function
        // this is equavilent of calling this.onKeyDown = this.onKeyDown.bind(this);  // this tells js to bind the local "this" variable to the given "this".
        Util.bind(this, "onKeyDown", "onVolume", "onHelp", "onBack");
        // audio manager
        this.amgr = spec.amgr || Base.instance.audioMgr;
        // lookup ui element references... 
        // -- using the superclass' findFirst method, look up the UI element that has a tag of "playButton"
        this.sfxVolumeSlider = this.findFirst(v=>v.tag === "sfxVolumeSlider");
        this.musicVolumeSlider = this.findFirst(v=>v.tag === "musicVolumeSlider");
        this.helpButton = this.findFirst(v=>v.tag === "helpButton");
        this.backButton = this.findFirst(v=>v.tag === "backButton");

        // set initial slider positions (before wiring event handlers)
        this.sfxVolumeSlider.value = this.amgr.sfxVolume;
        this.musicVolumeSlider.value = this.amgr.musicVolume;

        // wire event handlers
        // -- listen for key events...
        // -- there is a global Keys event listener... we can wire a new handler here.
        Keys.evtKeyPressed.listen(this.onKeyDown);
        // -- listen for button events...
        // first call here is to wire the play buttons click handler to a callback function.
        this.sfxVolumeSlider.evtValueChanged.listen(this.onVolume);
        this.musicVolumeSlider.evtValueChanged.listen(this.onVolume);
        this.helpButton.evtClicked.listen(this.onHelp);
        this.backButton.evtClicked.listen(this.onBack);
    }

    // the callback handler for the playButton click event
    onVolume(evt) {
        if (evt.actor.tag === "musicVolumeSlider") {
            this.amgr.musicVolume = evt.value;
        } else if (evt.actor.tag === "sfxVolumeSlider") {
            this.amgr.sfxVolume = evt.value;
        }
        // here is an example of how major game states are managed.
        // the main play state is created/loaded
        //let state = new VolumeState();
        // then the state manager is told to swap the current state (which is the menu state) with the new play state.
        //Base.instance.stateMgr.swap(state);
    }
    onHelp(evt) {
        let state = new HelpState();
        Base.instance.stateMgr.push(state);
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
