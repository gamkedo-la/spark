export { UxCanvas };

import { EvtChannel }           from "./event.js";
import { UxView }               from "./uxView.js";

/** ========================================================================
 * class representing base canvas as a UI view
 */
class UxCanvas extends UxView {
    static dfltCanvasID = "canvas";
    static getCanvas(id=this.dfltCanvasID) {
        let canvas = document.getElementById(id) || {
            width: 0, 
            height: 0, 
            getContext: () => undefined,
            addEventListener: () => undefined,
            getBoundingClientRect: () => { return {left:0, top:0}; },
        };
        return canvas;
    }

    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        let cvsid = spec.cvsid || "canvas";
        let canvas = spec.canvas || UxCanvas.getCanvas(cvsid);
        let width = spec.width || canvas.width;
        let height = spec.height || canvas.height;
        spec.xxform = Object.assign({}, {origx: 0, origy: 0, width: canvas.width, height: canvas.height}, spec.xxform)
        super(spec);
        this.cvs = canvas;
        this.ctx = canvas.getContext("2d");
        this.resize = spec.resize || false;
        if (width) this.cvs.width = width;
        if (height) this.cvs.height = height;
        if (this.resize) {
            this.onWindowResize();  // resize now...
            window.addEventListener('resize', this.onWindowResize.bind(this)); // resize when window resizes
        }
        // event channels
        this.__evtResized = new EvtChannel("resized", {actor: this});
    }

    // PROPERTIES ----------------------------------------------------------
    get width() {
        return this.cvs.width;
    }

    get height() {
        return this.cvs.height;
    }

    // EVENTS --------------------------------------------------------------
    get evtResized() { return this.__evtResized; }

    // METHODS -------------------------------------------------------------
    onWindowResize() {
        let width = window.innerWidth;
        let height = window.innerHeight;
        //console.log("trying to resize to: " + width + "," + height);
        this.cvs.width = width;
        this.cvs.height = height;
        this.xform.width = width;
        this.xform.height = height;
        if (this.evtResized) this.evtResized.trigger({width: width, height: height});
    }  

}