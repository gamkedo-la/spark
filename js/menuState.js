export { MenuState };

import { State }            from "./base/state.js";
import { Keys }             from "./base/keys.js";
import { Util }             from "./base/util.js";
import { Templates }        from "./templates.js";
import { PlayState }        from "./playState.js";
import { OptionsState }     from "./optionsState.js";
import { Fmt }              from "./base/fmt.js";
import { Base }             from "./base/base.js";
import { HelpState } from "./helpState.js";
import { CreditsState } from "./creditsState.js";

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
                
                Templates.panel("mainBG", { xsketch: {cls: "Media", tag: "menuBackground"}, xxform: { top: 0, bottom: 0, left: 0, right: 0}}),

                Templates.panel("mainButtons", { xxform: { top: 0.3, bottom: 0.3, left: 0.3, right: 0.3}, xchildren: [ //xxform: { top: .3, bottom: .3, left: .3, right: .3}, xchildren: [
                    // under the top level panel, there are the four button definitions.
                    // -- again, note the use of the template here.  We can modify the look/feel of all the main menu buttons by modifying the single template.
                    // -- also note the xxform: here, I'm saying use only a top and bottom margin.  i'm using a little math here to "simplify" the layout.
                    // -- it equates to the top button has a top margin of 0 and bottom margin of .75.  Second button has top of .25, bottom of .5, etc.
                    // -- note that no left/right margins are specified, and will default to 0 (no margin) and will fill the entire space of the parent.
                    // -- also note a few other variables here... 
                    //     the first variable is a UI tag (we'll use this for element lookups below)
                    //     the second variable is the actual text to use within the button
                    Templates.menuButton("playButton", "play",          { xxform: { top: 0/4, bottom: 1-1/4 }}),
                    Templates.menuButton("optionsButton", "options",    { xxform: { top: 1/4, bottom: 1-2/4 }}),
                    Templates.menuButton("helpButton", "how to play",   { xxform: { top: 2/4, bottom: 1-3/4 }}),
                    Templates.menuButton("creditsButton", "credits",    { xxform: { top: 3/4, bottom: 1-4/4 }}),
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
        this.optionsButton = this.findFirst(v=>v.tag === "optionsButton");
        this.helpButton = this.findFirst(v=>v.tag === "helpButton");
        this.creditsButton = this.findFirst(v=>v.tag === "creditsButton");

        // wire event handlers
        // -- listen for key events...
        // -- there is a global Keys event listener... we can wire a new handler here.
        Keys.evtKeyPressed.listen(this.onKeyDown);
        // -- listen for button events...
        // first call here is to wire the play buttons click handler to a callback function.
        this.playButton.evtClicked.listen(this.onPlay);
        this.optionsButton.evtClicked.listen(this.onOptions);
        this.helpButton.evtClicked.listen(this.onHelp);
        this.creditsButton.evtClicked.listen(this.onCredits);
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
        // here is an example of how major game states are managed.
        // the main play state is created/loaded
        //let state = new OptionsState();
        // then the state manager is told to swap the current state (which is the menu state) with the new play state.
        //Base.instance.stateMgr.swap(state);
    }
    onOptions(evt) {
        // here is an example of how major game states are managed.
        // the main play state is created/loaded
        let state = new OptionsState({showHelp: false});
        // then the state manager is told to swap the current state (which is the menu state) with the new play state.
        Base.instance.stateMgr.push(state);
    }

    onHelp(evt) {
        let state = new HelpState();
        Base.instance.stateMgr.push(state);
    }

    onCredits(evt) {
        let state = new CreditsState();
        Base.instance.stateMgr.push(state);
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
