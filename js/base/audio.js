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
        this.volume = spec.volume || 1;
        console.log(`audio spec: ${Fmt.ofmt(spec)}`);
    }

    // PROPERTIES ----------------------------------------------------------

    // METHODS -------------------------------------------------------------
    play() {
        if (this.audioCtx.state !== "running") return;
        // connect source buffer to target
        // FIXME
        console.log(`creating new src`);
        this.src = this.audioCtx.createBufferSource();
        this.src.buffer = this.buffer;
        if (this.volume !== 1) {
            console.log(`setting up gain node`);
            var gainNode = this.audioCtx.createGain()
            gainNode.gain.value = this.volume;
            gainNode.connect(this.audioCtx.destination);
            this.src.connect(gainNode)
        } else {
            this.src.connect(this.audioCtx.destination);
        }
        this.src.loop = this.loop;
        this.src.start(0);
    }

    stop() {
        console.log(`stop called`);
        if (this.src) {
            console.log(`trying to stop`);
            this.src.stop(0);
        }
    }

    toString() {
        return Fmt.toString(this.constructor.name, this.tag);
    }


}
