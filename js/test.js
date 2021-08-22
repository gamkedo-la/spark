import { Assets } from "./base/assets.js";
import { AudioLoader } from "./base/audioLoader.js";
import { Base } from "./base/base.js";
import { Config } from "./base/config.js";
import { Fmt } from "./base/fmt.js";
import { Generator } from "./base/generator.js";
import { ImageLoader } from "./base/imageLoader.js";
import { MediaLoader } from "./base/mediaLoader.js";
import { SheetLoader } from "./base/sheetLoader.js";
import { Store } from "./base/store.js";
import { UxView } from "./base/uxView.js";
import { SparkRegistry } from "./registry.js";
import { SparkAssets } from "./sparkAssets.js";
import { Templates } from "./templates.js";
import { Tile } from "./tile.js";
import { WorldOverrides } from "./worldOverrides.js";

class Game {

    // STATIC METHODS ------------------------------------------------------
    static init() {
        // -- global base init
        Base.init();
        // -- game-dependent registry
        SparkRegistry.init();
        SparkRegistry.setup(Base.instance.registry);
        // -- game templates
        Templates.init();
        // -- assets
        SparkAssets.init();
        // -- overrides
        WorldOverrides.init();
    }

    genobj(xobj, i, j) {
        let x = i*16 + 8;
        let y = j*16 + 8;
        xobj = Object.assign({
            x: x, 
            y: y, 
        }, xobj);
        console.log(`xobj: ${Fmt.ofmt(xobj)}`);
        return Generator.generate(xobj);
    }

    constructor() {
        let xview = {
            cls: "UxCanvas2",
            tag: "cvs.0",
            resize: true,
            xchildren: [
            ]
        }

        Config.init();
        Game.init();
        Base.instance.setup();

        this.media = new Store({getkey: (v) => v.tag});
        this.mediaLoader = new MediaLoader({
            dbg: Config.dbg.MediaLoader,
            media: this.media, 
            refs: SparkAssets.media,
            loaders: {
                "Image": new ImageLoader({scale:Config.scale}),
                "Sheet": new SheetLoader({scale:Config.scale}),
                "Audio": new AudioLoader(),
            }
        });
        this.loaders = [ this.mediaLoader ];

        // -- assets - mapping of tag or id to asset specifications
        this.assets = new Assets({
            refs: SparkAssets.assets || [],
        });

        this.view = Generator.generate(xview);
        console.log(`this.view: ${this.view}`);
        this.ctx = this.view.ctx;

        let xobj = this.assets.fromTag("strawberry");
        let tile = this.genobj( xobj, 5, 5 );
        console.log(`tile: ${tile}`);
    }

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

    update(ctx) {
    }

    render() {
        this.ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
        this.ctx.fillRect(100, 100, 200, 200);
    }

}

window.onload = async function() {
    let lastUpdate = Math.round(performance.now());
    let frame = 0;
    let ctx = {
        deltaTime: 0,
        frame: 0,
    }
    const maxDeltaTime = 1000/20;

    let game = new Game();

    await game.load();
    console.log(`done loading`);

    // -- start main process loop
    window.requestAnimationFrame(loop);

    function loop(hts) {
        frame++;
        if (frame > Number.MAX_SAFE_INTEGER) frame = 0;
        // compute delta time
        ctx.deltaTime = Math.min(maxDeltaTime, hts - lastUpdate);
        ctx.frame = frame;
        lastUpdate = hts;
        game.update(ctx);
        game.render();
        // setup 
        window.requestAnimationFrame(loop);
    }

}