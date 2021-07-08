export { Spark };

import { Game }             from "./base/game.js";
import { SparkAssets }      from "./sparkAssets.js";
import { PlayState }        from "./playState.js";
import { InteractSystem }   from "./interactSystem.js";
import { AutoCloseSystem }  from "./autoCloseSystem.js";
import { SparkRegistry }    from "./registry.js";
import { Templates }        from "./templates.js";
import { Base }             from "./base/base.js";
import { SparkSystem }      from "./sparkSystem.js";
import { Atts }             from "./base/atts.js";
import { TitleState } from "./titleState.js";

/** ========================================================================
 * Main Spark Game Specification and Setup
 */
class Spark extends Game {

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
            xbindings: {
                bindings: [
                    { key: "w",             tag: "up" },
                    { key: "ArrowUp",       tag: "up" },
                    { key: "s",             tag: "down" },
                    { key: "ArrowDown",     tag: "down" },
                    { key: "a",             tag: "left" },
                    { key: "ArrowLeft",     tag: "left" },
                    { key: "d",             tag: "right" },
                    { key: "ArrowRight",    tag: "right" },
                    { key: "z",             tag: "primary" },
                    { key: "x",             tag: "secondary" },
                ],
            },
        };
        super(spec);
    }

    // METHODS -------------------------------------------------------------
    setup() {
        super.setup();
        // -- register Spark classes
        SparkRegistry.setup(this.base.registry);
        // -- register systems
        // ---- interaction
        this.base.systemMgr.adopt(new InteractSystem({ sparkSources: Atts.sparkSources, findOverlaps: this.base.findOverlaps, dbg: false, }));
        // ---- auto close
        this.base.systemMgr.adopt(new AutoCloseSystem({ findOverlaps: this.base.findOverlaps, dbg: false, }));
        // ---- spark system
        this.base.systemMgr.adopt(new SparkSystem({ sparkSources: Atts.sparkSources, dbg: false, }));

        // initialize and start master game state
        //let state = new PlayState();
        let state = new TitleState();
        this.base.stateMgr.push(state);
    }

}
