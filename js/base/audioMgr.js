export { AudioMgr };

import { Gizmo }            from "./gizmo.js";
import { Keys }             from "./keys.js";
import { Mathf } from "./math.js";
import { UxCanvas }         from "./uxCanvas.js";

class AudioMgr extends Gizmo {
    static dfltVolume = 1;

    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this._audioCtx = spec.audioCtx || new AudioContext();
        this.mute = false;
        this.sfxVol = 1.0; 
        this.musicVol = 1.0; 
        const ctx = this._audioCtx;
        let canvas = spec.canvas || UxCanvas.getCanvas();
        Keys.evtKeyPressed.once(this._resume.bind(this));
        canvas.addEventListener('click', this._resume.bind(this), {once: true});
        // -- initialize audio sinks
        this.sfxSink = this._audioCtx.createGain();
        this.sfxSink.connect(this._audioCtx.destination);
        this.musicSink = this._audioCtx.createGain();
        this.musicSink.connect(this._audioCtx.destination);
        // -- initialize audio volumes
        let sfxVolume = localStorage.getItem('sfxVolume');
        if (sfxVolume === null) sfxVolume = (spec.hasOwnProperty("sfxVolume") ? spec.sfxVolume : AudioMgr.dfltVolume);
        this.sfxSink.gain.value = Mathf.clamp(sfxVolume, 0, 1);
        let musicVolume = localStorage.getItem("musicVolume");
        if (musicVolume === null) musicVolume = (spec.hasOwnProperty("musicVolume") ? spec.musicVolume : AudioMgr.dfltVolume);
        this.musicSink.gain.value = Mathf.clamp(musicVolume, 0, 1);
    }

    _resume() {
        if (!this._audioCtx || !this._audioCtx.resume) {
            console.error('failed to resume audio context, invalid state');
            return;
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

    get sfxVolume() {
        return this.sfxSink.gain.value;
    }
    set sfxVolume(v) {
        if (v !== this.sfxSink.gain.value) {
            this.sfxSink.gain.value = Mathf.clamp(v, 0, 1);
            localStorage.setItem("sfxVolume", this.sfxSink.gain.value);
        }
    }

    get musicVolume() {
        return this.musicSink.gain.value;
    }
    set musicVolume(v) {
        if (v !== this.musicSink.gain.value) {
            this.musicSink.gain.value = Mathf.clamp(v, 0, 1);
            localStorage.setItem("musicVolume", this.musicSink.gain.value);
        }
    }

    get state() {
        return this._audioCtx.state;
    }


    // METHODS -------------------------------------------------------------
    update(ctx) {
    }

    getSinkForSound(sound) {
        if (sound && sound.kind === "music") {
            return this.musicSink;
        }
        return this.sfxSink;
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
