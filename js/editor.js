import { Game }             from "./base/game.js";
import { SparkAssets }      from "./sparkAssets.js";
import { SparkRegistry }    from "./registry.js";
import { Templates }        from "./templates.js";
import { Base }             from "./base/base.js";
import { EditorState }      from "./editorState.js";

/** ========================================================================
 * Main Spark Game Specification and Setup
 */
class Editor extends Game {

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
        let state = new EditorState();
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
    Editor.init();

    // create game
    const game = new Editor();
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
