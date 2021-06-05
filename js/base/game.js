export { Game };
import { Base } from "./base.js";
import { Fmt } from "./fmt.js";
import { Stats } from "./stats.js";

/** ========================================================================
 * the main game state/controller
 */
class Game {

    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        // initialize base
        Base.init();
        this.base = new Base(spec);
        this.dbg = spec.dbg;
        // setup game loaders
        // default loader is base asset loader
        this.loaders = [ this.base.mediaLoader ];
        if (spec.loaders) this.loaders = this.loaders.concat(spec.loaders);
        // top level game objects managed by game
        this.objs = [];
    }

    // PROPERTIES ----------------------------------------------------------
    get assets() {
        return this.base.assets;
    }

    get generator() {
        return this.base.generator;
    }

    // METHODS -------------------------------------------------------------
    /**
     * the main load function for game
     */
    async load() {
        return new Promise( (resolve) => {
            let ctx = { game: this };
            let promises = [];
            for (const loader of this.loaders) {
                let promise = loader.load(ctx);
                promises.push(promise);
            }
            Promise.all(promises).then(() => {
                if (this.dbg) console.log("game loaded...");
                resolve();
            })
        });
    }

    setup() {
        if (this.dbg) console.log("setup complete...");
        // base setup
        this.base.setup();
        // add base managers
        this.add(this.base.stateMgr);
        this.add(this.base.systemMgr);
        this.add(this.base.viewMgr);
        this.add(Stats);
    }

    add(obj) {
        if (!obj) return;
        //console.log("game: adding base obj: " + obj);
        this.objs.push(obj);
    }

    remove(obj) {
        let idx = this.objs.indexOf(obj);
        if (idx != -1) {
            this.objs.splice(idx, 1);
            return true;
        }
        return false;
    }

    // Game update function
    update(ctx) {
        for (const obj of this.objs) {
            if (obj.update) obj.update(ctx);
        }
    }

    render() {
        Stats.count("frames");
        for (const obj of this.objs) {
            if (obj.render) obj.render();
        }
    }

    toString() {
        return Fmt.toString(this.constructor.name);
    }

}
