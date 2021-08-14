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
        Keys.evtKeyPressed.once(() => () => ctx.resume().then(() => console.log("playback resumed")), {once: true});
        canvas.addEventListener('click', () => ctx.resume().then(() => console.log("playback resumed")), {once: true});
    }

    // PROPERTIES ----------------------------------------------------------
    get audioCtx() {
        return this._audioCtx;
    }

    // METHODS -------------------------------------------------------------
    update(ctx) {
    }

}
