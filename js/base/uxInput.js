export { UxInput };

import { UxView }           from "./uxView.js";
import { Generator }        from "./generator.js";
import { Text }             from "./text.js";
import { EvtChannel }       from "./event.js";
import { Util }             from "./util.js";
import { Mouse }            from "./mouse.js";
import { Fmt } from "./fmt.js";

class UxInput extends UxView {
    // STATIC VARIABLES ----------------------------------------------------
    static dfltSketch = {
        cls: "Rect",
        color: "rgba(255,255,255,.25)",
    };
    static dfltCursor = {
        cls: "Rect",
        color: "rgba(255,255,255,.5)",
        width: 3,
        height: 10,
    };
    static dfltText = {
        text: "default text", 
        xfitter: {cls: "FitToParent", top: .15, bottom: .1}, 
        align: "left",
    };

    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        this._sketch = Generator.generate(Object.assign({parent: this, xfitter: { cls: "FitToParent" }}, spec.xsketch || UxInput.dfltSketch));
        this.cursor = Generator.generate(Object.assign({}, UxInput.dfltCursor, spec.xcursor));
        this.cursorIdx = 0;
        this._cursx = 0;
        this.cursorBlinkRate = spec.cursorBlinkRate || 500;
        this.cursorBlinkTTL = this.cursorBlinkRate;
        this.cursorOn = true;
        this.charset = spec.charset || 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
        this._text = new Text(Object.assign({parent: this}, UxInput.dfltText, spec.xtext)); 
        this.textOffset = spec.textOffset || 5;
        this._selected = false;
        // events
        this.__evtClicked = new EvtChannel("clicked", {actor: this});
        // bind event handlers
        Util.bind(this, "onSketchUpdate", "onMouseClick", "onKeyDown");
        // event handlers
        if (this._sketch) this._sketch.evtUpdated.listen(this.onSketchUpdate);
        if (this._text) this._text.evtUpdated.listen(this.onSketchUpdate);
        // -- listen for mouse click
        Mouse.evtClicked.listen(this.onMouseClick);
        // -- listen for key events
        document.addEventListener("keydown", this.onKeyDown);
    }

    // PROPERTIES ----------------------------------------------------------
    get text() {
        return this._text.text;
    }
    set text(v) {
        this._text.text = v;
    }

    get sketch() {
        return this._sketch;
    }

    set sketch(v) {
        if (v !== this._sketch) {
            if (this._sketch) this._sketch.evtUpdated.ignore(this.onSketchUpdate);
            if (this._sketch.parent) this._sketch.parent = undefined;
            this._sketch = v;
            v.parent = this;
            if (this._sketch) this._sketch.evtUpdated.listen(this.onSketchUpdate);
            this.evtUpdated.trigger();
        }
    }

    get cursIdx() {
        return this.cursorIdx;
    }
    set cursIdx(v) {
        if (v > this._text.text.length) v = this._text.text.length;
        if (v < 0) v = 0;
        if (v > 0) {
            let t = this._text.text.slice(0,v);
            let m = Text.measure(this._text.font, this._text.text.slice(0,v), false);
            this._cursx = m.x;
        } else {
            this._cursx = 0;
        }
        this.cursorIdx = v;
    }

    get cursx() {
        return this.textOffset + this._cursx;
    }
    get cursy() {
        let v = 0;
        v += Math.floor(this.cursor.height * .1);
        return v;
    }

    // EVENTS --------------------------------------------------------------
    get evtClicked() { return this.__evtClicked; }

    // EVENT HANDLERS ------------------------------------------------------
    onMouseClick(evt) {
        if (!this.active) return;
        const mousePos = Mouse.pos;
        if (this.bounds.contains(mousePos)) {
            // activate/deactivate
            this._selected = (!this._selected);
            if (this._selected) {
                this.cursIdx = this._text.text.length;
            }
            this.evtClicked.trigger();
        } else {
            if (this._selected) this._selected = false;
        }
    }

    onSketchUpdate(evt) {
        // propagate update
        this.updated = true;
    }

    onKeyDown(evt) {
        if (!this.active) return;
        // ignore key events if not selected
        if (!this._selected) return;
        // handle escape
        if (evt.key === "Escape") {
            this._selected = false;
            return;
        }
        // handle backspace
        if (evt.key === "Backspace") {
            if (this.cursIdx > 0) {
                this._text.text = Util.spliceStr(this._text.text, this.cursIdx-1, 1);
                this.cursIdx -= 1;
            }
            return;
        }
        // handle arrows
        if (evt.key === "ArrowLeft") {
            if (this.cursIdx > 0) this.cursIdx -= 1;
            return;
        }
        if (evt.key === "ArrowRight") {
            if (this.cursIdx < this._text.text.length) this.cursIdx += 1;
            return;
        }
        if (evt.key === "ArrowUp") {
            this.cursIdx = 0;
            return;
        }
        if (evt.key === "ArrowDown") {
            this.cursIdx = this._text.text.length;
            return;
        }
        // handle delete
        if (evt.key === "Delete") {
            if (this.cursIdx < this._text.text.length) {
                this._text.text = Util.spliceStr(this._text.text, this.cursIdx, 1);
            }
            return;
        }
        // ignore other meta keys
        if (evt.key.length > 1) return;
        let key = evt.key;
        // check charset
        if (!this.charset.includes(key)) return;
        // good to go...
        this._text.text += key;
        this.cursIdx += 1;
    }

    // METHODS -------------------------------------------------------------
    iupdate(ctx) {
        if (this._text) this.updated |= this._text.update(ctx);
        if (this._sketch) this.updated |= this._sketch.update(ctx);
        // update cursor height
        if (this.cursor.height !== this.lcheight) {
            this.cursor._height = this.xform.height * .8;
            this.lcheight = this.cursor.height;
        }
        // cursor blink handling
        if (this.cursorBlinkTTL) {
            this.cursorBlinkTTL -= ctx.deltaTime;
            if (this.cursorBlinkTTL <= 0) {
                this.cursorBlinkTTL = this.cursorBlinkRate;
                this.cursorOn = (!this.cursorOn);
                this.updated = true;
            }
        }
        return this.updated;
    }

    _render(ctx) {
        if (this._sketch) this._sketch.render(ctx, this.xform.minx, this.xform.miny);
        if (this._text) this._text.render(ctx, this.xform.minx+this.textOffset, this.xform.miny);
        if (this._selected) {
            if (this.cursorOn) this.cursor.render(ctx, this.xform.minx+this.cursx, this.xform.miny+this.cursy);
        }
    }

    destroy() {
        // stop listening on key events
        document.removeEventListener("keydown", this.onKeyDown);
        // stop listening on mouse events
        Mouse.evtClicked.ignore(this.onMouseClick);
        if (this._sketch) this._sketch.evtUpdated.ignore(this.onSketchUpdate);
        if (this._text) this._text.evtUpdated.ignore(this.onSketchUpdate);
        super.destroy();
    }

}