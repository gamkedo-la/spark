export { PanToAction };

import { Action }               from "../base/action.js";
import { Camera }               from "../base/camera.js";

class PanToAction extends Action {

    constructor(spec={}) {
        super(spec);
        this.target = spec.target;
        this.camera = spec.camera || Camera.main;
    }

    start(actor) {
        //console.log(`starting PanToAction`);
        if (this.target) {
            this.camera.startPan(this.target);
        } else {
            console.error(`${this.constructor.name} failed: no target`);
            this.done = false;
        }
    }

    update(ctx) {
        if (this.camera.panReached) {
            //console.log(`PanToAction done`);
            this.camera.stopPan();
            this.done = true;
        }
        return this.done;
    }
}