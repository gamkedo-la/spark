export { AudioMgr };

import { Gizmo }            from "./gizmo.js";
import { Keys }             from "./keys.js";
import { UxCanvas }         from "./uxCanvas.js";

class AudioMgr extends Gizmo {
    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this._audioCtx = spec.audioCtx || new AudioContext();
        this.mute = false;
        const ctx = this._audioCtx;
        let canvas = spec.canvas || UxCanvas.getCanvas();
        Keys.evtKeyPressed.once(this._resume.bind(this));
        canvas.addEventListener('click', this._resume.bind(this), {once: true});
    }

    _resume() {
        if (!this._audioCtx || !this._audioCtx.resume) {
            console.error('failed to resume audio context, invalid state');
        }
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

    muteToggle(){
       this.mute = !this.mute;
        console.log("Muted? " + this.mute);
        if(this.mute){
  
            if(this._audioCtx.state === "running"){
                this._audioCtx.suspend();
            }
        } else {
            if(this._audioCtx.state === "suspended"){
                this._audioCtx.resume();
            }
        }
    }

}
