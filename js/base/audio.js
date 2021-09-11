export { Audio };

import { Fmt } from "./fmt.js";
import { Base } from "./base.js";

/** ========================================================================
 * Audio asset
 */
class Audio {

    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        this.tag = spec.tag || "audio";
        this.kind = spec.kind || "sfx";
        this.amgr = spec.amgr || Base.instance.audioMgr;
        this.buffer = spec.audio;
        this.loop = spec.hasOwnProperty("loop") ? spec.loop : false;
        this.volume = spec.volume || 1;
    }

    // PROPERTIES ----------------------------------------------------------

    // METHODS -------------------------------------------------------------
    play() {
        if(Base.instance.audioMgr.mute){
            return;
        }
        if (this.amgr.state !== "running") return;
        // connect audio to mgr
        this.src = this.amgr.audioCtx.createBufferSource();
        this.src.buffer = this.buffer;
        if (this.volume !== 1) {
            var gainNode = this.amgr.audioCtx.createGain()
            gainNode.gain.value = this.volume;
            gainNode.connect(this.amgr.getSinkForSound(this));
            this.src.connect(gainNode)
        } else {
            this.src.connect(this.amgr.getSinkForSound(this));
        }
        this.src.loop = this.loop;
        this.src.start(0);
    }

    stop() {
        if (this.src) this.src.stop(0);
    }

    toString() {
        return Fmt.toString(this.constructor.name, this.tag);
    }


}
