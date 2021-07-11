import { SparkAssets }      from "./sparkAssets.js";
import { SparkRegistry }    from "./registry.js";
import { Templates }        from "./templates.js";
import { Game }             from "./base/game.js";
import { Base }             from "./base/base.js";
import { Keys }             from "./base/keys.js";
import { Mouse }            from "./base/mouse.js";
import { State }            from "./base/state.js";
import { Util }             from "./base/util.js";
import { Fmt }              from "./base/fmt.js";

class ParticlesState extends State {
    cpre(spec) {
        super.cpre(spec);
        spec.xview = {
            cls: "UxCanvas",
            cvsid: "canvas",
            resize: true,
            xchildren: [
                Templates.editorPanel(null, { xxform: {}}),
                //Templates.editorButton("copyButton", "copy", { xxform: { left: .65, right: .25, top: .9, bottom: .05 }}),
                //Templates.editorButton("backButton", "back", { xxform: { left: .75, right: .15, top: .9, bottom: .05 }}),
            ],
        };
    }

    cpost(spec) {
        super.cpost(spec);
        Util.bind(this, "onKeyDown", "onClick");
        Keys.evtKeyPressed.listen(this.onKeyDown);
        Mouse.evtClicked.listen(this.onClick);
    }

    onKeyDown(evt) {
        if (!this.active) return;
        console.log("ParticlesState onKeyDown: " + Fmt.ofmt(evt));
    }

    onClick(evt) {
        //if (!this.active) return;
        console.log("ParticlesState onClick: " + Fmt.ofmt(evt));
    }

    destroy() {
        if (this.view) this.view.destroy();
        Keys.evtKeyPressed.ignore(this.onKeyDown);
        Mouse.evtClicked.ignore(this.onClicked);
        super.destroy();
    }

}

/** ========================================================================
 * Main Spark Game Specification and Setup
 */
class Particles extends Game {

    // STATIC METHODS ------------------------------------------------------
    static init() {
        // -- global base init
        Base.init();
        // -- game-dependent registry
        SparkRegistry.init();
        // -- game templates
        Templates.init();
        // -- assets
        SparkAssets.init();
    }

    // CONSTRUCTOR ---------------------------------------------------------
    constructor() {
        // build out game spec
        const spec = { 
            media: SparkAssets.media, 
            assets: SparkAssets.assets,
        };
        super(spec);
    }

    // METHODS -------------------------------------------------------------
    setup() {
        super.setup();
        // -- register Spark classes
        SparkRegistry.setup(this.base.registry);
        // -- register systems
        // initialize and start master game state
        let state = new ParticlesState();
        this.base.stateMgr.push(state);
    }

}


/** ========================================================================
 * start the game when page is loaded
 */
window.onload = async function() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    let lastUpdate = Math.round(performance.now());
    let loopID = 0;
    const maxDeltaTime = 1000/20;

    // static initialization of any game global state
    Particles.init();

    // create game
    const game = new Particles();
    // -- load
    await game.load();
    // -- setup
    game.setup()
    // -- start main process loop
    window.requestAnimationFrame(loop);

    function getDeltaTime(hts) {
        const dt = Math.min(maxDeltaTime, hts - lastUpdate);
        lastUpdate = hts;
        return dt;
    }

    function loop(hts) {
        // compute delta time
        let ctx = {
            deltaTime: getDeltaTime(Math.round(hts)),
        }
        game.update(ctx);
        game.render();
        // setup 
        loopID = window.requestAnimationFrame(loop);
    }

    window.Game = game;
}
