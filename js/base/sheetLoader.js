export { SheetLoader };

//import { Sprite }       from "./sprite.js";
import { Fmt }          from "./fmt.js";
import { ImageLoader }  from "./imageLoader.js";

/**
 * SheetLoader resolves an image reference as a sprite sheet or animation sheet and
 * breaks it into individual animation or image definitions.
 * src: "src/img/human.png", load: "Sheet", assets: [
 *      {tag: "human1", cls: "Sprite", width: 32, height: 32, xoffset: 32, yoffset: 32 },
 *      {tag: "human.x", cls: "Animation", cels: [
 *          { xoffset: 32*1, yoffset: 32*2, duration: 80 },
 *          { xoffset: 32*2, yoffset: 32*2, duration: 80 },
 *      ]},
 * },
 */
class SheetLoader {
    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.imageSmoothingEnabled = false;
        this.dbg = spec.dbg;
        this.scale = spec.scale || 1;
    }

    async loadSprite(sheetImg, ref) {
        const width = ref.width || 0;
        const height = ref.height || 0;
        const x = ref.x || 0;
        const y = ref.y || 0;
        const cls = ref.cls || "Sprite";
        // draw referenced image slice to internal/offsceen canvas
        let sw = width*this.scale;
        let sh = height*this.scale;
        this.canvas.width = sw;
        this.canvas.height = sh;
        this.ctx.clearRect(0, 0, sw, sh);
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.drawImage(sheetImg, x, y, width, height, 0, 0, sw, sh);
        // load new image from data URL
        let promise = ImageLoader.load(this.canvas.toDataURL(), ref);
        return promise.then(rec => {
            // build final Sprite spec
            const spec = Object.assign({}, rec, {cls: cls});
            // -- filter out sheet loader info
            for (const key of ["width", "height", "x", "y"]) delete spec[key];
            if (this.dbg) console.log("SheetLoader loaded: " + Fmt.ofmt(spec));
            return {[spec.tag]: spec};
        });
    }

    async loadVarSprite(sheetImg, ref) {
        return new Promise( (resolve) => {
            // iterate through referenced sprite variations
            const promises = [];
            const spriteSpec = {
                tag: ref.tag, 
                cls: "VarSprite", 
                variations: [],
            }
            for (const variation of (ref.variations || [])) {
                // parse variation vars
                const width = variation.width || 0;
                const height = variation.height || 0;
                const x = variation.x || 0;
                const y = variation.y || 0;
                // draw referenced image slice to internal/offsceen canvas
                let sw = width*this.scale;
                let sh = height*this.scale;
                this.canvas.width = sw;
                this.canvas.height = sh;
                this.ctx.clearRect(0, 0, sw, sh);
                this.ctx.imageSmoothingEnabled = false;
                this.ctx.drawImage(sheetImg, x, y, width, height, 0, 0, sw, sh);
                // load new image from data URL
                let promise = ImageLoader.load(this.canvas.toDataURL());
                promise.then( (rec) => {
                    // build cel spec
                    const spec = {
                        xsketch: { cls: "Sprite", img: rec.img },
                    };
                    // push to spriteSpec
                    spriteSpec.variations.push(spec);
                });
                promises.push(promise);
            }
            return Promise.all(promises).then(() => {
                if (this.dbg) console.log("SheetLoader loaded: " + Fmt.ofmt(spriteSpec));
                resolve({[ref.tag]: spriteSpec});
            });
        });
    }

    async loadAnimation(sheetImg, ref) {
        return new Promise( (resolve) => {
            // iterate through referenced animation cels
            const promises = [];
            const animSpec = {
                tag: ref.tag, 
                cls: "Animation", 
                cels: [],
            }
            for (const cel of (ref.cels || [])) {
                // parse cel vars
                const width = cel.width || 0;
                const height = cel.height || 0;
                const x = cel.x || 0;
                const y = cel.y || 0;
                const ttl = cel.ttl || 0;
                // draw referenced image slice to internal/offsceen canvas
                let sw = width*this.scale;
                let sh = height*this.scale;
                this.canvas.width = sw;
                this.canvas.height = sh;
                this.ctx.clearRect(0, 0, sw, sh);
                this.ctx.imageSmoothingEnabled = false;
                this.ctx.drawImage(sheetImg, x, y, width, height, 0, 0, sw, sh);
                // load new image from data URL
                let promise = ImageLoader.load(this.canvas.toDataURL());
                promise.then( (rec) => {
                    // build cel spec
                    const spec = {
                        ttl: ttl,
                        xsketch: { cls: "Sprite", img: rec.img },
                    };
                    // push to animSpec
                    animSpec.cels.push(spec);
                });
                promises.push(promise);
            }
            return Promise.all(promises).then(() => {
                if (this.dbg) console.log("SheetLoader loaded: " + Fmt.ofmt(animSpec));
                resolve({[ref.tag]: animSpec});
            });
        });
    }

    // METHODS -------------------------------------------------------------
    async load(spec) {
        const src = spec.src || "undefined";
        const refs = spec.refs || [];
        const rec = await(ImageLoader.load(src));
        const specs = {};
        return new Promise( (resolve) => {
            const promises = [];
            const sheet = rec.img;
            for (const ref of refs) {
                let promise;
                if (ref.cls === "Sprite" || ref.cls === "StretchSprite") {
                    promise = this.loadSprite(sheet, ref);
                } else if (ref.cls === "VarSprite") {
                    promise = this.loadVarSprite(sheet, ref);
                } else if (ref.cls === "Animation") {
                    promise = this.loadAnimation(sheet, ref);
                } else {
                    console.error("invalid reference (cls): " + Fmt.ofmt(ref));
                }
                if (promise) {
                    promise.then((spec) => {
                        Object.assign(specs, spec);
                    });
                    promises.push(promise);
                }
            }
            return Promise.all(promises).then(() => {
                if (this.dbg) console.log("sheet loaded...");
                resolve(specs);
            })
        });
    }
}