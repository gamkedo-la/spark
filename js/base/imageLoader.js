export { ImageLoader };

import { Fmt }          from "./fmt.js";

/**
 * ImageLoader resolves single image references to single Sprite definitions
 * using the entire image.
 * { src: "src/img/dragon.png", loader: "Image", tag: "dragon" },
 */
class ImageLoader {
    static canvas = document.createElement('canvas');
    static ctx = this.canvas.getContext('2d');

    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        this.scale = spec.scale || 1;
    }

    // STATIC METHODS ------------------------------------------------------
    static async loadSprite(sheetImg, ref) {
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

    static async load(src, data={}, scale=1) {

        let promise = new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.addEventListener("load", () => { 
                return resolve( Object.assign({}, {img: img}, data)) 
            });
            img.addEventListener("error", err => { console.log("error: " + Fmt.ofmt(err)); reject(err) });
            img.src = src;
        });
        if (scale !== 1) {
            return promise.then(rec => {
                let sw = rec.img.width*scale;
                let sh = rec.img.height*scale;
                this.canvas.width = sw;
                this.canvas.height = sh;
                this.ctx.clearRect(0, 0, sw, sh);
                this.ctx.imageSmoothingEnabled = false;
                this.ctx.drawImage(rec.img, 0, 0, rec.img.width, rec.img.height, 0, 0, sw, sh);
                // load new image from data URL
                return this.load(this.canvas.toDataURL(), data);
            });
        } else {
            return promise;
        }
    }

    // METHODS -------------------------------------------------------------
    async load(spec) {
        const src = spec.src || "undefined";
        const cls = spec.cls || "Sprite";
        return ImageLoader.load(src, spec, this.scale).then( rec => {
            // build final Sprite spec
            const spec = Object.assign({}, rec, {cls: cls});
            delete spec["loader"];
            // return asset spec
            return {[spec.tag]: spec};
        });
    }

}