export { Text };

import { Sketch }           from './sketch.js';
import { Font }             from './font.js';
import { Vect }             from './vect.js';

/** ========================================================================
 * A string of text rendered to the screen as a sketch.
 */
class Text extends Sketch {
    // STATIC VARIABLES ----------------------------------------------------
    static lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut " + 
                   "labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris " +
                   "nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit " +
                   "esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in " +
                   "culpa qui officia deserunt mollit anim id est laborum.";
    static minFontSize = 5;
    static _textCanvas = document.createElement('canvas');
    static _textCtx = this._textCanvas.getContext('2d');

    static get rlorem() {
        let len = Math.floor(Math.random()*this.lorem.length);
        return  this.lorem.slice(0, len);
    }

    static get rword() {
        let choices = this.lorem.split(" ");
        let idx = Math.floor(Math.random() * choices.length);
        return choices[idx];
    }

    // STATIC METHODS ------------------------------------------------------
    static measure(font, text, hacky=true) {
        const ctx = this._textCtx;
        ctx.font = font;
        // Note: hacky... force text to include a capital and a descent letter to make sure we have enough room
        if (hacky) text = "Xg" + text.slice(2);
        const metrics = ctx.measureText(text);
        let h = Math.abs(metrics.actualBoundingBoxAscent) + Math.abs(metrics.actualBoundingBoxDescent);
        let w = Math.abs(metrics.actualBoundingBoxLeft) + Math.abs(metrics.actualBoundingBoxRight);
        return new Vect(w, h);
    }

    static measureWrapHeight(font, text, width, leadingPct=.25) {
        // split the lines
        let lines = this.splitText(font, text, width);
        if (lines.length > 0) {
            let tsize = Text.measure(font, lines[0]);
            return (tsize.y * lines.length-1) * (1+leadingPct) + tsize.y;
        }
        return 0;
    }

    static splitText(font, text, width) {
        // split on spaces
        let tokens = text.split(' ');
        // iterate over tokens...
        let line = "";
        let lines = [];
        for (const token of tokens) {
            let testStr = (line) ? `${line} ${token}` : token;
            // measure test string
            let tsize = Text.measure(font, testStr);
            if (tsize.x > width) {
                lines.push(line);
                line = token;
            } else {
                line = testStr;
            }
        }
        if (line) lines.push(line);
        return lines;
    }

    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        super(spec);
        this.font = spec.font || Font.dflt;
        this.color = spec.color || "black";
        this._text = spec.text || "default text";
        this.wrapLines = [];
        this.wrapLeading;
        this.leadingPct = spec.leadingPct || .25;
        this.outlineWidth = spec.outlineWidth || 0;
        this.outlineColor = spec.outlineColor || "white";
        this.highlightColor = spec.highlightColor;
        this.valign = spec.valign || "middle";
        this.align = spec.align || "center";
        // fit - adjust font to best fit sketch size iff sketch size is set
        this.fit = spec.hasOwnProperty("fit") ? spec.fit : true;
        // wrap - wrap text, breaking on spaces, applicable to static sized text only
        this.wrap = spec.hasOwnProperty("wrap") ? spec.wrap : true;
        // staticSize - should width/height track to text size
        this.staticSize = ((this.width === 0 && this.height === 0 && !this.fitter) || !this.fit);
        if (this.staticSize) {
            const size = Text.measure(this.font, this._text);
            this._width = size.x;
            this._height = size.y;
            if (this.wrap) {
                this.wrapLines = Text.splitText(this.font, this._text, this.width);
                if (this.wrapLines.length) {
                    let tsize = Text.measure(this.font, this.wrapLines[0]);
                    this.wrapLeading = Math.round(tsize.y * (1+this.leadingPct));
                }
            }
        } else {
            this.fitSize = Vect.zero;
            this.resize(true);
        }
    }

    // PROPERTIES ----------------------------------------------------------
    get size() {
        return new Vect(this.width, this.height);
    }

    get text() {
        return this._text;
    }
    set text(v) {
        if (v != this._text) {
            this._text = v;
            if (!this.staticSize) {
                this.resize(true);
            } else {
                const size = Text.measure(this.font, this._text);
                this._width = size.x;
                this._height = size.y;
                if (this.wrap) {
                    this.wrapLines = Text.splitText(this.font, this._text, this.width);
                    if (this.wrapLines.length) {
                        let tsize = Text.measure(this.font, this.wrapLines[0]);
                        this.wrapLeading = Math.round(tsize.y * (1+this.leadingPct));
                        return (tsize.y * this.wrapLines.length-1) * (1+this.leadingPct) + tsize.y;
                    }
                }
            }
            this.updated = true;
        }
    }

    // METHODS -------------------------------------------------------------
    resize(force=false) {
        if (this.staticSize) return;
        if (this.width === 0 && this.height === 0) return;
        // check to see if sketch size has changed since last "fit"...
        let font = this.font;
        let fsize = font.size;
        if (!force && this.size.equals(this.fitSize)) return;
        let tsize = Text.measure(font, this._text);
        this.fitSize = this.size;
        // FIXME: should we be setting updated here?
        // grow
        if (tsize.x < this.width && tsize.y < this.height) {
            while (tsize.x < this.width && tsize.y < this.height) {
                fsize++;
                font = font.copy({size: fsize});
                tsize = Text.measure(font, this._text);
            }
            this.font = this.font.copy({size: fsize-1});
        // shrink
        } else {
            while (fsize > Text.minFontSize && (tsize.x > this.width || tsize.y > this.height)) {
                fsize--;
                font = font.copy({size: fsize});
                tsize = Text.measure(font, this._text);
            }
            this.font = this.font.copy({size: fsize-1});
        }
    }

    _render(renderCtx, x=0, y=0) {
        // refit text (if necessary based on updated sketch size)
        this.resize();
        if (this.highlightColor) {
            renderCtx.fillStyle = this.highlightColor;
            renderCtx.fillRect(x, y, this.size.x, this.size.y);
        }
        if (!this.staticSize) {
            renderCtx.textAlign = this.align;
            renderCtx.textBaseline = this.valign;
            // update position based on alignment... 
            if (this.align === "center") {
                x += this.width * .5;
            } else if (this.align === "right") {
                x += this.width;
            }
            if (this.valign === "middle") {
                y += this.height * .5;
            } else if (this.valign === "bottom") {
                y += this.height;
            }
        } else {
            renderCtx.textAlign = "left";
            renderCtx.textBaseline = "top";
        }
        renderCtx.fillStyle = this.color;
        renderCtx.font = this.font;
        renderCtx.lineWidth = this.outlineWidth;
        renderCtx.strokeStyle = this.outlineColor;
        if (this.staticSize && this.wrap) {
            for (let i=0; i<this.wrapLines.length; i++) {
                const line = this.wrapLines[i];
                renderCtx.fillText(line, x, y + (i*this.wrapLeading));
                if (this.outlineWidth) renderCtx.strokeText(line, x, y + (i*this.wrapLeading));
            }
        } else {
            renderCtx.fillText(this._text, x, y);
            if (this.outlineWidth) renderCtx.strokeText(this._text, x, y);
        }
    }
}