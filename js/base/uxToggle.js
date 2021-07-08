export { UxToggle };

import { UxView }           from "./uxView.js";
import { Generator }        from "./generator.js";
import { Util }             from "./util.js";
import { EvtChannel }       from "./event.js";
import { Mouse }            from "./mouse.js";
import { Sketch }           from "./sketch.js";

class UxToggle extends UxView {
    // STATIC VARIABLES ----------------------------------------------------
    static dfltUnpressed = {cls: "Rect", xfitter: {cls: "FitToParent"}, color: "rgba(255,255,255,.25)"};
    static dfltHighlight = {cls: "Rect", xfitter: {cls: "FitToParent"}, color: "rgba(255,255,255,.5)"};
    static dfltPressed = {cls: "Rect", xfitter: {cls: "FitToParent"}, color: "rgba(255,255,255,.75)"};
    static dfltIcon = {
        cls: "Shape",
        fill: true,
        xfitter: {cls: "FitToParent", border: .15 },
        verts: [
                {x:2, y:19},
                {x:5, y:16},
                {x:10, y:21},
                {x:26, y:5},
                {x:29, y:8},
                {x:10, y:27},
        ],
        borderWidth: 2,
        borderColor: "rgba(0,0,0,1)",
        color: "rgba(255,255,255,1)"
    };

    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        // bind event handlers
        Util.bind(this, "onSketchUpdate", "onMouseClick");
        Sketch.link( Generator.generate(Object.assign({parent: this}, UxToggle.dfltUnpressed, spec.xunpressed)), 
            this, "_unpressed", this.onSketchUpdate );
        Sketch.link( Generator.generate(Object.assign({parent: this}, UxToggle.dfltHighlight, spec.xhighlight)), 
            this, "_highlight", this.onSketchUpdate );
        Sketch.link( Generator.generate(Object.assign({parent: this}, UxToggle.dfltPressed, spec.xpressed)), 
            this, "_pressed", this.onSketchUpdate );
        Sketch.link( Generator.generate(Object.assign({parent: this}, UxToggle.dfltIcon, spec.icon)), 
            this, "_icon", this.onSketchUpdate );
        this._pressedSound = spec.pressedSound;
        this._value = (spec.hasOwnProperty("value")) ? spec.value : true;
        this._sketch = (this._value) ? this._pressed : this._unpressed;
        // listen for mouse click
        Mouse.evtClicked.listen(this.onMouseClick);
        // events
        this.__evtClicked = new EvtChannel("clicked", {actor: this});
        // event handlers
        if (spec.pressedSound) {
            let sound = spec.pressedSound;
            this.evtClicked.listen((e) => sound.play());
        }
    }

    // PROPERTIES ----------------------------------------------------------
    get value() {
        return this._value;
    }
    set value(v) {
        if (v !== this._value) {
            this.updated = true;
            this._value = v;
        }
    }

    get unpressed() {
        return this._unpressed;
    }
    set unpressed(v) {
        if (v !== this._unpressed) {
            this.updated = true;
            if (this._sketch === this._unpressed) this._sketch = v;
            Sketch.link(v, this, "_unpressed", this.onSketchUpdate);
        }
    }

    get pressed() {
        return this._pressed;
    }
    set pressed(v) {
        if (v !== this._pressed) {
            this.updated = true;
            if (this._sketch === this._pressed) this._sketch = v;
            Sketch.link(v, this, "_pressed", this.onSketchUpdate);
        }
    }

    get highlight() {
        return this._highlight;
    }
    set highlight(v) {
        if (v !== this._highlight) {
            this.updated = true;
            if (this._sketch === this._highlight) this._sketch = v;
            Sketch.link(v, this, "_highlight", this.onSketchUpdate);
        }
    }

    get icon() {
        return this._icon;
    }
    set icon(v) {
        if (v !== this._icon) {
            this.updated = true;
            Sketch.link(v, this, "_icon", this.onSketchUpdate);
        }
    }

    // EVENTS --------------------------------------------------------------
    get evtClicked() { return this.__evtClicked; }

    // EVENT HANDLERS ------------------------------------------------------
    onMouseClick(evt) {
        //console.log("onMouseClick");
        const mousePos = Mouse.pos;
        //const localMousePos = this.xform.getLocal(mousePos);
        //console.log(`pos: ${mousePos} local: ${localMousePos}`);
        if (this.bounds.contains(mousePos)) {
            //console.log("clicked button...");
            //if (this._pressedSound) this._pressedSound.play();
            this.value = !this.value;
            this.evtClicked.trigger({value: this.value});
        }
    }
    onSketchUpdate(evt) {
        // propagate update
        if (evt.actor === this._sketch || evt.actor === this._icon) this.updated = true;
    }

    // METHODS -------------------------------------------------------------
    iupdate(ctx) {
        this.updated |= super.iupdate(ctx);
        if (!this.active) return updated;
        // determine active sketch based on mouse state
        let want = (this.value) ? this._pressed : this._unpressed;
        if (this.mouseOver) {
            want = this._highlight;
        }
        if (want !== this._sketch)  {
            this._sketch = want;
            this.updated = true;
        }
        // update active sketches
        if (this._sketch) this.updated |= this._sketch.update(ctx);
        if (this._icon) this.updated |= this._icon.update(ctx);
        return this.updated;
    }

    _render(ctx) {
        let x = this.xform.minx;
        let y = this.xform.miny;
        // render button sketch
        if (this._sketch) this._sketch.render(ctx, x, y);
        // render icon
        if (this.value && this._icon) this._icon.render(ctx, x, y);
    }

    destroy() {
        // stop listening on mouse events
        Mouse.evtClicked.ignore(this.onMouseClick);
        if (this._unpressed) Sketch.unlink(this._unpressed, this, "_unpressed", this.onSketchUpdate);
        if (this._pressed) Sketch.unlink(this._pressed, this, "_pressed", this.onSketchUpdate);
        if (this._highlight) Sketch.unlink(this._highlight, this, "_highlight", this.onSketchUpdate);
        if (this._icon) Sketch.unlink(this._icon, this, "_icon", this.onSketchUpdate);
        super.destroy();
    }
}