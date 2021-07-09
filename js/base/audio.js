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
        this.audioCtx = spec.audioCtx || Base.instance.audioMgr.audioCtx;
        this.buffer = spec.audio;
        this.loop = spec.hasOwnProperty("loop") ? spec.loop : false;
    }

    // PROPERTIES ----------------------------------------------------------

    // METHODS -------------------------------------------------------------
    play() {
        if (this.audioCtx.state !== "running") return;
        // connect source buffer to target
        // FIXME
        const src = this.audioCtx.createBufferSource();
        src.buffer = this.buffer;
        src.connect(this.audioCtx.destination);
        src.loop = this.loop;
        src.start(0);
    }

    toString() {
        return Fmt.toString(this.constructor.name, this.tag);
    }


}
