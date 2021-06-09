export { Mouse, MouseSystem }
import { System }           from "./system.js";
import { Vect }             from "./vect.js";
import { EvtChannel }       from "./event.js";
import { UxCanvas }         from "./uxCanvas.js";

class Mouse {
    static x = 0;
    static y = 0;
    static down = false;
    static evtClicked = new EvtChannel("clicked");
    static updated = false;
    static get pos() {
        return new Vect(this.x, this.y);
    }
}

class MouseSystem extends System {

    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec={}) {
        super.cpost(spec);
        let cvsid = spec.cvsid || "canvas";
        this.canvas = spec.canvas || UxCanvas.getCanvas(cvsid);
        // register event handlers
        this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.canvas.addEventListener('click', this.onClick.bind(this));
        this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.x = 0;
        this.y = 0;
        this.down = false;
        this.canvasRect = this.canvas.getBoundingClientRect();
        this.dirty = false;
        this.dbg = spec.dbg;
    }

    // EVENTS --------------------------------------------------------------
    get evtClicked() { return Mouse.evtClicked; }

    // EVENT HANDLERS ------------------------------------------------------
    onClick(e) {
        this.evtClicked.trigger({evt: e, x: Mouse.x, y: Mouse.y });
    }
    onMouseMove(e) {
        if (!e) return;
        this.x = e.clientX;
        this.y = e.clientY;
        this.dirty = true;
        //if (this.dbg) console.log(`onMouseMove: ${this.x},${this.y}`);
    }
    onMouseDown(e) {
        this.down = true;
        this.dirty = true;
    }
    onMouseUp(e) {
        this.down = false;
        this.dirty = true;
    }

    // METHODS -------------------------------------------------------------
    update(ctx) {
        let updated = false;
        // sync captured position to actual position
        if (this.dirty) {
            Mouse.updated = true;
            let canvasRect = this.canvas.getBoundingClientRect();
            updated = true;
            Mouse.x = this.x - canvasRect.left;
            Mouse.y = this.y - canvasRect.top;
            Mouse.down = this.down;
            this.dirty = false;
        }
        updated |= super.update(ctx);
        return updated;
    }

    iterate(ctx, e) {
        // skip if mouse has not been updated
        if (!Mouse.updated) return;
        // skip inactive entities
        if (!e.active) return;
        // skip non-view entities
        if (e.cat !== "View") return;

        // convert to local position
        let lpos = e.xform.getLocal(new Vect(Mouse.x, Mouse.y));

        // determine if view bounds contains mouse point
        const contains = e.bounds.contains(lpos);
        if (e.mouseOver && !contains) {
            e.mouseOver = false;
            e.evtMouseLeft.trigger();
            if (this.dbg) console.log(`mouse left: ${e}`);
        }
        if (!e.mouseOver && contains) {
            e.mouseOver = true;
            e.evtMouseEntered.trigger();
            if (this.dbg) console.log(`mouse entered: ${e}`);
        }
        e.mouseDown = (contains && Mouse.down);
    }

    postiterate(ctx) {
        super.postiterate(ctx);
        Mouse.updated = false;
    }

}