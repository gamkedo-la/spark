export { Keys }
import { EvtChannel }       from "./event.js";

class Keys {
    // STATIC VARIABLES ----------------------------------------------------
    static pressed = new Map();
    static evtKeyPressed = new EvtChannel("pressed");
    static evtKeyReleased = new EvtChannel("released");

    // STATIC METHODS ------------------------------------------------------
    static init(spec={}) {
        this.dbg = spec.dbg;
        // register event handlers
        document.addEventListener('keydown', this.onKeyDown.bind(this))
        document.addEventListener('keyup', this.onKeyUp.bind(this))
    }

    static get(key) {
        return (this.pressed.has(key)) ? 1 : 0;
    }

    static onKeyDown(evt) {
        evt.preventDefault();
        if (!this.pressed.has(evt.key)) {
            if (this.dbg) console.log("evt.key down: " + evt.key);
            this.pressed.set(evt.key);
            this.evtKeyPressed.trigger({evt: evt, key:evt.key});
        }
    }

    static onKeyUp(evt) {
        if (this.pressed.has(evt.key)) {
            if (this.dbg) console.log("evt.key up: " + evt.key);
            this.pressed.delete(evt.key);
            this.evtKeyReleased.trigger({evt: evt, key:evt.key});
        }
    }

}