export { AudioMgr };

import { Gizmo }            from "./gizmo.js";
import { Keys }             from "./keys.js";
import { UxCanvas }         from "./uxCanvas.js";

class AudioMgr extends Gizmo {
    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this._audioCtx = spec.audioCtx || new AudioContext();
        const ctx = this._audioCtx;
        let canvas = spec.canvas || UxCanvas.getCanvas();
        Keys.evtKeyPressed.once(this._resume.bind(this));
        canvas.addEventListener('click', this._resume.bind(this), {once: true});
    }

    _resume() {
        this._audioCtx.resume().then(() => {
            console.log("playback resumed");
            this.resumed = true;
        });
    }

    // PROPERTIES ----------------------------------------------------------
    get audioCtx() {
        return this._audioCtx;
    }

    // METHODS -------------------------------------------------------------
    update(ctx) {
    }

}
