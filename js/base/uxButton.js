export { UxButton };

import { UxView }           from "./uxView.js";
import { Generator }        from "./generator.js";
import { Text }             from "./text.js";
import { Util }             from "./util.js";
import { EvtChannel }       from "./event.js";
import { Mouse }            from "./mouse.js";

class UxButton extends UxView {
    // STATIC VARIABLES ----------------------------------------------------
    static dfltText = {xfitter: {cls: "FitToParent", top: .2, bottom: .1, left: .05, right: .05}};
    static dfltUnpressed = {cls: "Rect", xfitter: {cls: "FitToParent"}, color: "rgba(255,255,255,.25)"};
    static dfltHighlight = {cls: "Rect", xfitter: {cls: "FitToParent"}, color: "rgba(255,255,255,.5)"};
    static dfltPressed = {cls: "Rect", xfitter: {cls: "FitToParent"}, color: "rgba(255,255,255,.75)"};

    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec) {
        super.cpost(spec);

        this._text = new Text(Object.assign({parent: this}, UxButton.dfltText, spec.xtext)); 
        this._unpressed = Generator.generate(Object.assign({parent: this}, UxButton.dfltUnpressed, spec.xunpressed));
        this._highlight = Generator.generate(Object.assign({parent: this}, UxButton.dfltHighlight, spec.xhighlight));
        this._pressed = Generator.generate(Object.assign({parent: this}, UxButton.dfltPressed, spec.xpressed));
        this._pressedSound = spec.pressedSound;
        this._sketch = this._unpressed;
        // bind event handlers
        Util.bind(this, "onSketchUpdate", "onMouseClick");
        // listen for mouse click
        Mouse.evtClicked.listen(this.onMouseClick);
        // events
        this.__evtClicked = new EvtChannel("clicked", {actor: this});
        // event handlers
        //if (this._text) this._text.evtUpdated.listen(this.onSketchUpdate);
        //if (this._unpressed) this._unpressed.evtUpdated.listen(this.onSketchUpdate);
        //if (this._pressed) this._pressed.evtUpdated.listen(this.onSketchUpdate);
        //if (this._highlight) this._highlight.evtUpdated.listen(this.onSketchUpdate);
        if (spec.pressedSound) {
            let sound = spec.pressedSound;
            this.evtClicked.listen((e) => sound.play());
        }
    }

    // PROPERTIES ----------------------------------------------------------
    get text() {
        return this._text.text;
    }
    set text(v) {
        this._text.text = v;
    }

    get unpressed() {
        return this._unpressed;
    }
    set unpressed(v) {
        if (this._unpressed && this._unpressed.parent) this._unpressed.parent = undefined;
        if (this._sketch === this._unpressed) this._sketch = v;
        this._unpressed = v;
        if (v) v.parent = this;
    }

    get pressed() {
        return this._pressed;
    }
    set pressed(v) {
        if (this._pressed && this._pressed.parent) this._pressed.parent = undefined;
        if (this._sketch === this._pressed) this._sketch = v;
        this._pressed = v;
        if (v) v.parent = this;
    }

    get highlight() {
        return this._highlight;
    }
    set highlight(v) {
        if (this._highlight && this._highlight.parent) this._highlight.parent = undefined;
        if (this._sketch === this._highlight) this._sketch = v;
        this._highlight = v;
        if (v) v.parent = this;
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
            this.evtClicked.trigger();
        }
    }
    onSketchUpdate(evt) {
        // propagate update
        if (evt.actor === this._sketch|| evt.actor === this._text) this.updated = true;
    }

    // METHODS -------------------------------------------------------------
    iupdate(ctx) {
        this.updated |= super.iupdate(ctx);
        if (!this.active) return this.updated;
        // determine active sketch based on mouse state
        let want = this._unpressed;
        if (this.mouseDown) {
            want = this._pressed;
        } else if (this.mouseOver) {
            want = this._highlight;
        }
        if (want !== this._sketch)  {
            this._sketch = want;
            this.updated = true;
        }
        // update active sketch
        if (this._sketch && this._sketch.update) this._sketch.update(ctx);
        return this.updated;
    }

    _render(ctx) {
        let x = this.xform.minx;
        let y = this.xform.miny;
        // render button sketch
        //console.log(`button sketch: ${this._sketch} ${x},${y} w: ${this._sketch.width} h:${this._sketch.height}`);
        if (this._sketch && this._sketch.render) this._sketch.render(ctx, x, y);
        // render text sketch
        if (this._text) this._text.render(ctx, x, y);
    }

    destroy() {
        // stop listening on mouse events
        Mouse.evtClicked.ignore(this.onMouseClick);
        if (this._unpressed) this._unpressed.evtUpdated.ignore(this.onSketchUpdate);
        if (this._pressed) this._pressed.evtUpdated.ignore(this.onSketchUpdate);
        if (this._highlight) this._highlight.evtUpdated.ignore(this.onSketchUpdate);
        if (this._text) this._text.evtUpdated.ignore(this.onSketchUpdate);
        super.destroy();
    }
}