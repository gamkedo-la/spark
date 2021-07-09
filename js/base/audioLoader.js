export { AudioLoader };

import { Util }         from "./util.js";
import { Base }         from "./base.js";

/**
 * AudioLoader resolves short audio references to single Audio definitions.
 * { src: "src/audio/hover.mp3", cls: "Audio", tag: "hover" },
 */
class AudioLoader {
    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        this.audioCtx = spec.audioCtx || Base.instance.audioMgr.audioCtx;
        this.dbg = spec.hasOwnProperty("dbg") ? spec.dbg : false;
    }

    // STATIC METHODS ------------------------------------------------------
    static async load(ctx, src, data={}) {
        return new Promise((resolve, reject) => {
            const req = new XMLHttpRequest();
            req.crossOrigin = 'Anonymous';
            req.responseType = 'arraybuffer';
            req.addEventListener("load", () => {
                ctx.decodeAudioData(req.response,
                    (buffer) => {
                        return resolve(Object.assign({}, {audio: buffer}, data));
                    },
                () => { debug.log('buffer decode failed') });
            });
            req.addEventListener("error", err => reject(err));
            req.open("GET", src, true);
            req.setRequestHeader("Cache-Control", "no-store");
            req.send()
        });
    }

    // METHODS -------------------------------------------------------------
    async load(spec) {
        const src = Util.objKeyValue(spec, "src", "undefined");
        const tag = Util.objKeyValue(spec, "tag", "undefined");
        return AudioLoader.load(this.audioCtx, src, {tag: tag}).then( rec => {
            // build final Sprite spec
            const spec = {
                tag: rec.tag,
                cls: "Audio",
                audio: rec.audio,
            }
            // return asset spec
            return {[spec.tag]: spec};
        });
    }

}
