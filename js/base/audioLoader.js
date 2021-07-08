export { AudioLoader };

import { Util }         from "./util.js";
import { KeyedGroup }   from "./group.js";
import { Sprite }       from "./sprite.js";
import { Animation }    from "./animation.js";
import { Fmt }          from "./fmt.js";
import { Audio }        from "./audio.js";
import { Base } from "./base.js";


/**
 * AudioLoader resolves short audio references to single Audio definitions.
 * { src: "src/audio/hover.mp3", cls: "Audio", tag: "hover" },
 */
class AudioLoader {
    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        this._assets = Util.objKeyValue(spec, "assets", Assets.instance);
        this.audioCtx = spec.audioCtx || Base.instance.audioMgr.audioCtx;
        this.dbg = spec.hasOwnProperty("dbg") ? spec.dbg : false;
    }

    // STATIC METHODS ------------------------------------------------------
    static load(ctx, src, data={}) {
        return new Promise((resolve, reject) => {
            const req = new XMLHttpRequest();
            req.responseType = 'arraybuffer';
            req.addEventListener("load", () => {
                ctx.decodeAudioData(req.response,
                    (buffer) => {
                        const rec = Object.assign({}, {audio: buffer}, data);
                        resolve(rec);
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
    load(spec) {
        const src = Util.objKeyValue(spec, "src", "undefined");
        const tag = Util.objKeyValue(spec, "tag", "undefined");
        return AudioLoader.load(this._audioCtx, src, {tag: tag}).then( rec => {
            // build final Sprite spec
            const spec = {
                tag: rec.tag,
                cls: "Audio",
                audio: rec.audio,
            }
            // add to assets
            if (this.dbg) console.log("AudioLoader loaded: " + Fmt.ofmt(spec));
            if (this._assets) this._assets.add(spec);
        });
    }

}
