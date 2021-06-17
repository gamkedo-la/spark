export { Spark };

import { FitToParent }      from "./base/fitter.js";
import { Fmt }              from "./base/fmt.js";
import { Game }             from "./base/game.js";
import { Gizmo }            from "./base/gizmo.js";
import { Hierarchy } from "./base/hierarchy.js";
import { UxCanvas } from "./base/uxCanvas.js";
import { SparkAssets }      from "./sparkAssets.js";
//import { UxMainCtrl }       from "./uxMain.js";
import { PlayState }        from "./playState.js";
import { InteractSystem }   from "./interactSystem.js";
import { AutoCloseSystem }  from "./autoCloseSystem.js";
import { SparkRegistry }    from "./registry.js";
import { Templates }        from "./templates.js";
import { Base }             from "./base/base.js";
import { SparkSystem }      from "./sparkSystem.js";
//import { Assets } from "./base/assets.js";
//import { UxMouse } from "./base/uxMouse.js";
//import { ViewSystem } from "./systems/viewSystem.js";
//import { PlayerCtrlSystem } from "./systems/playerCtrlSystem.js";
//import { MoveSystem } from "./systems/moveSystem.js";
//import { MainCtrl } from "./uxMain.js";
//import { CreditsCtrl } from "./uxCredits.js";
//import { TestEntityCtrl } from "./test.js";
//import { Keys } from "./base/keys.js";

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
    constructor(spec={}) {
        // build out game spec
        spec = Object.assign({ 
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
        }, spec);
        super(spec);
    }

    // METHODS -------------------------------------------------------------
    setup() {
        //console.log("spark setup");
        super.setup();
        // -- register Spark classes
        SparkRegistry.setup(this.base.registry);
        // -- register systems
        // ---- interaction
        this.base.systemMgr.adopt(new InteractSystem({
            dbg: false,
            findOverlaps: this.base.findOverlaps,
        }));
        // ---- auto close
        this.base.systemMgr.adopt(new AutoCloseSystem({
            dbg: false,
            findOverlaps: this.base.findOverlaps,
        }));
        // ---- spark system
        this.base.systemMgr.adopt(new SparkSystem({
            dbg: false,
        }));

        // initialize and start master game state
        let state = new PlayState();
        /*
        let ctrl = new UxMainCtrl({
            base: this.base,
        });
        */
        this.base.stateMgr.push(state);


        /*
        // initialize systems
        const baseSpec = {
            smgr: this.smgr,
            vmgr: this.vmgr,
        };

        this.mouse = new UxMouse();
        this.keys = new Keys();
        
        new ViewSystem(Object.assign({
            iterateTTL: 0,
        }, baseSpec ));
        new PlayerCtrlSystem(Object.assign({
            bindingSpec: {
                input: this.keys,
                bindings: [
                    { key: "w", tag: "up" },
                    { key: "ArrowUp", tag: "up" },
                    { key: "s", tag: "down" },
                    { key: "ArrowDown", tag: "down" },
                    { key: "a", tag: "left" },
                    { key: "ArrowLeft", tag: "left" },
                    { key: "d", tag: "right" },
                    { key: "ArrowRight", tag: "right" },
                ],
            },
            iterateTTL: 0,
        }, baseSpec ));
        new MoveSystem(Object.assign({
        }, baseSpec ));

        // menu
        this.scene = new TestEntityCtrl({});
        //this.scene = new MainCtrl({assets: this._assets});
        */

    }

    update(ctx) {
        //this.testSprite.update(ctx);
        //this.testAnim.update(ctx);
        super.update(ctx);
    }

    render() {
        super.render();
        //this.testSprite.render(this.renderCtx, 200, 200);
        //this.testAnim.render(this.renderCtx, 250, 200);
    }

}
