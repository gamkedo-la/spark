export { MenuState };

import { State }            from "./base/state.js";
import { Keys }             from "./base/keys.js";
import { Util }             from "./base/util.js";
import { Templates }        from "./templates.js";
import { PlayState }        from "./playState.js";
import { OptionsState }     from "./optionsState.js";
import { Fmt }              from "./base/fmt.js";
import { Base }             from "./base/base.js";

class MenuState extends State {

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
                // the only child at his level is a panel.  Panels are simple non-interactive UI elements that can either just be placeholders for organization 
                // (no attached sketch) or provide a visual background (attached sketch).
                // Note the use of a template here.  Templates are used to "hide" details of the data specification, as well as provide consistant look/feel 
                // for elements.  See templates.js for all of these definitions.
                // Here, the panel is being used to group together the main menu buttons.  Note the xxform variable which provides a rect transform for the panel
                // - the specification for this xxform is saying use a top/bottom margin of 20% of the parent height (.2 for top/bottom keys) and 30% of the parent
                // - width (.3 for left/right keys).  Each parent/child level you go down will always be in local coordinate space... see below.
                Templates.panel("mainButtons", { xxform: { top: .2, bottom: .2, left: .3, right: .3}, xchildren: [
                    // under the top level panel, there are the four button definitions.
                    // -- again, note the use of the template here.  We can modify the look/feel of all the main menu buttons by modifying the single template.
                    // -- also note the xxform: here, I'm saying use only a top and bottom margin.  i'm using a little math here to "simplify" the layout.
                    // -- it equates to the top button has a top margin of 0 and bottom margin of .75.  Second button has top of .25, bottom of .5, etc.
                    // -- note that no left/right margins are specified, and will default to 0 (no margin) and will fill the entire space of the parent.
                    // -- also note a few other variables here... 
                    //     the first variable is a UI tag (we'll use this for element lookups below)
                    //     the second variable is the actual text to use within the button
                    Templates.menuButton("playButton", "play", { xxform: { top: 0/4, bottom: 1-1/4 }}),
                    Templates.menuButton("continueButton", "continue", { xxform: { top: 1/4, bottom: 1-2/4 }}),
                    Templates.menuButton("optionsButton", "options", { xxform: { top: 2/4, bottom: 1-3/4 }}),
                    Templates.menuButton("creditsButton", "credits", { xxform: { top: 3/4, bottom: 1-4/4 }}),
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
        Util.bind(this, "onKeyDown", "onPlay");
        // lookup ui element references... 
        // -- using the superclass' findFirst method, look up the UI element that has a tag of "playButton"
        this.playButton = this.findFirst(v=>v.tag === "playButton");
        this.continueButton = this.findFirst(v=>v.tag === "continueButton");
        this.optionsButton = this.findFirst(v=>v.tag === "optionsButton");
        this.creditsButton = this.findFirst(v=>v.tag === "creditsButton");
        // TODO: add additional references for the other buttons

        // wire event handlers
        // -- listen for key events...
        // -- there is a global Keys event listener... we can wire a new handler here.
        Keys.evtKeyPressed.listen(this.onKeyDown);
        // -- listen for button events...
        // first call here is to wire the play buttons click handler to a callback function.
        this.playButton.evtClicked.listen(this.onPlay);
        this.continueButton.evtClicked.listen(this.onContinue);
        this.optionsButton.evtClicked.listen(this.onOptions);
        this.creditsButton.evtClicked.listen(this.onCredits);
        // TODO: wire additional buttons to their respective callback functions (which also need to be added)
    }

    // the callback handler for the playButton click event
    onPlay(evt) {
        // here is an example of how major game states are managed.
        // the main play state is created/loaded
        let state = new PlayState();
        // then the state manager is told to swap the current state (which is the menu state) with the new play state.
        Base.instance.stateMgr.swap(state);
    }
    onContinue(evt) {
        console.log("toDO Load Last Save");
        // here is an example of how major game states are managed.
        // the main play state is created/loaded
        //let state = new OptionsState();
        // then the state manager is told to swap the current state (which is the menu state) with the new play state.
        //Base.instance.stateMgr.swap(state);
    }
    onOptions(evt) {
        // here is an example of how major game states are managed.
        // the main play state is created/loaded
        let state = new OptionsState();
        // then the state manager is told to swap the current state (which is the menu state) with the new play state.
        Base.instance.stateMgr.push(state);
        
    }
    onCredits(evt) {
        console.log("toDO display credits");
        // here is an example of how major game states are managed.
        // the main play state is created/loaded
        //let state = new OptionsState();
        // then the state manager is told to swap the current state (which is the menu state) with the new play state.
        //Base.instance.stateMgr.swap(state);
    }
    // the callback handler for a generic key press
    onKeyDown(evt) {
        // I've added a shortcut here, so if you hit the escape button, the game will start
        if (evt.key === "Escape") {
            let state = new PlayState();
            Base.instance.stateMgr.swap(state);
        }
    }

    // destroy is automatically called when a state is being torn down (by the state manager)
    destroy() {
        // house keeping to ensure that we don't leave around defunct callbacks on global systems (like the key callbacks)
        Keys.evtKeyPressed.ignore(this.onKeyDown);
        super.destroy();
    }


}
