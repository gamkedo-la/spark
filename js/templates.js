export { Templates };

import { AiGoal }               from "./base/ai/aiGoal.js";
import { Activity }             from "./base/activity.js";
import { Config }               from "./base/config.js";
import { Fmt }                  from "./base/fmt.js";
import { Color }                from "./base/color.js";
import { Font }                 from "./base/font.js";
import { Generator } from "./base/generator.js";


class Templates {
    // some values to use in the templates...
    static playTextColor = "rgba(0,167,167,1)";
    static playTextColor2 = "rgba(219,124,40,1)";
    static menuTextColor = new Color(0,255,0,.75);

    static panel(tag, spec={}) {
        let xsketch = spec.xsketch || {};
        return Object.assign({
            cls: "UxPanel",
            tag: tag,
            xsketch: xsketch,
        }, spec);
    }

    static fader(tag, fadein, spec={}) {
        return Object.assign({ 
            tag: tag, 
            cls: "UxFader" 
        }, spec);
    }

    static titleText(tag, text, spec={}) {
        let xxform = spec.xxform || {};
        let color = spec.color || "rgba(0,167,167,1)"
        return {
            cls: "UxText",
            tag: tag,
            xxform: xxform,
            xtext: { color: color, text: text, },
        }
    }

    static playText(tag, text, spec={}) {
        let xxform = spec.xxform || {};
        let color = spec.color || Templates.playTextColor;
        let wrap = spec.wrap || false;
        let fit = !wrap;
        let font = spec.font || new Font({size:25});
        return {
            cls: "UxText",
            tag: tag,
            xxform: xxform,
            xtext: { color: color, text: text, wrap: wrap, fit: fit, font: font},
        }
    }

    static dialogText(tag, spec={}) {
        let xxform = spec.xxform || { otop: 25, oleft: 20, oright: 15};
        let color = spec.color || Templates.playTextColor;
        let font = spec.font || new Font({size:25});
        return {
            cls: "UxText",
            tag: tag,
            xxform: xxform,
            xtext: { color: color, text: "dialog", wrap: true, fit: false, font: font },
            xxform: xxform,
        }
    }

    static playInput(tag, text, spec={}) {
        let color = spec.color || Templates.playTextColor2;
        return Object.assign({
            cls: "UxInput",
            tag: tag,
            xtext: { color: color, text: text, },
            xsketch: { cls: "Rect", color: "rgba(0,0,0,.25)", },
        }, spec);
    }

    static playBubble(tag, spec={}) {
        let xxform = spec.xxform || {};
        let xchildren = spec.xchildren || [];
        let xsketch = spec.xsketch || { cls: 'Media', tag: "btnGoldTranS1" };
        return {
            cls: "UxPanel",
            tag: tag,
            xxform: xxform,
            xsketch: xsketch,
            xchildren: xchildren,
        }
    }

    static dbgText(tag, text, spec={}) {
        let xxform = spec.xxform || {};
        let color = spec.color || "rgba(167,0,0,.6)"
        return {
            cls: "UxText",
            tag: tag,
            xxform: xxform,
            xtext: { color: color, text: text, font: new Font({family:"Indie Flower", style: "bold"}) },
        }
    }

    static editorText(tag, text, spec={}) {
        let xxform = spec.xxform || {};
        return {
            cls: "UxText",
            tag: tag,
            xxform: xxform,
            xtext: { color: new Color(0,255,0,.75), text: text, },
        }
    }

    static editorInput(tag, text, spec={}) {
        return Object.assign({
            cls: "UxInput",
            tag: tag,
            xtext: { color: new Color(0,255,0,.75), text: text, },
        }, spec);
    }

    static editorToggle(tag, spec={}) {
        let xxform = spec.xxform || {};
        return {
            cls: "UxToggle",
            tag: tag,
            xpressed: { cls: 'Rect', color: new Color(50,50,50,1), borderWidth: 5, borderColor: new Color(0,0,0,1) },
            xunpressed: { cls: 'Rect', color: new Color(50,50,50,.5), borderWidth: 5, borderColor: new Color(0,0,0,1) },
            xhighlight: { cls: 'Rect', color: new Color(50,50,50,.75), borderWidth: 5, borderColor: new Color(0,0,0,1) },
            xxform: xxform,
            xtext: { color: new Color(0,255,0,.75), text: "X", },
        }
    }

    static hintSelectButton(tag, buttonText, hintText, spec={}) {
        let xxform = spec.xxform || {};
        return {
            cls: "UxPanel",
            tag: tag,
            ui: true,
            xxform: xxform,
            xsketch: { cls: 'Media', tag: "buttonLight" },
            xchildren: [
                { cls: "UxText", tag: `${tag}.text`, xxform: { offset: 10 }, xtext: { color: Templates.playTextColor, text: hintText }},
                Templates.menuButton(`${tag}.button`, buttonText ),
            ],
        };
    }

    static editorSelectButton(tag, text, spec={}) {
        let xxform = spec.xxform || {};
        return {
            cls: "UxPanel",
            ui: true,
            xxform: xxform,
            xsketch: { cls: 'Rect', color: new Color(0,0,0,0) },
            xchildren: [
                {
                    cls: "UxPanel",
                    tag: `${tag}.select`,
                    ui: true,
                    xxform: {offset: 3},
                    xsketch: { cls: 'Rect', borderWidth: 5, color: Color.zero, borderColor: new Color(0,255,0,.5) },
                },
                Templates.editorButton(`${tag}.button`, text ),
            ],
        };
    }

    static playIconButton(tag, icon, spec={}) {
        let xxform = spec.xxform || {};
        return {
            cls: "UxPanel",
            xsketch: {},
            xxform: xxform,
            xchildren: [
                {
                    cls: "UxButton",
                    tag: tag,
                    xtext: { text: " " },
                    xpressed: { cls: 'Rect', color: new Color(50,50,50,1), borderWidth: 5, borderColor: new Color(0,0,0,0) },
                    xunpressed: { cls: 'Rect', color: new Color(50,50,50,.5), borderWidth: 5, borderColor: new Color(0,0,0,0) },
                    xhighlight: { cls: 'Rect', color: new Color(50,50,50,.75), borderWidth: 5, borderColor: new Color(0,0,0,0) },
                },
                {
                    cls: "UxPanel",
                    tag: `${tag}.panel`,
                    xxform: {offset: 3},
                    xsketch: icon,
                },
            ],
        };
    }

    static editorPanel(tag, spec={}) {
        let xxform = spec.xxform || {};
        let xchildren = spec.xchildren || [];
        return {
            cls: "UxPanel",
            tag: tag,
            ui: true,
            xxform: xxform,
            xsketch: { cls: 'Rect', color: new Color(0,20,100,1), borderWidth: 10, borderColor: new Color(255,0,0,.5) },
            xchildren: xchildren,
        }
    }

    static menuText(tag, text, spec={}) {
        let xxform = spec.xxform || {};
        let color = spec.color || Templates.menuTextColor;
        let wrap = spec.wrap || false;
        let fit = !wrap;
        let font = spec.font || new Font({size:25});
        return {
            cls: "UxText",
            tag: tag,
            xxform: xxform,
            xtext: { color: color, text: text, wrap: wrap, fit: fit, font: font},
        }
    }

    /*
    static menuText(tag, text, spec={}) {
        let xxform = spec.xxform || {};
        let color = spec.color || Templates.menuTextColor;
        return {
            cls: "UxText",
            tag: tag,
            xxform: xxform,
            xtext: { color: color, text: text, },
        }
    }
    */

    static menuButton(tag, text, spec={}) {
        let xxform = spec.xxform || {};
        return {
            // setup of button metadata
            cls: "UxButton",
            tag: tag,
            xxform: xxform,
            // the text to display along w/ the color to use for the text
            xtext: { color: new Color(0,255,0,.75), text: text, },
            // the sketch to show when the button is pressed
            xpressed: { cls: 'Rect', color: new Color(50,50,50,1), borderWidth: 5, borderColor: new Color(0,0,0,1) },
            // the sketch to show when the button is idle (no mouse over)
            //xunpressed: { cls: 'Rect', color: new Color(50,50,50,.5), borderWidth: 5, borderColor: new Color(0,0,0,1) },
            xpressed: { cls: 'Media', tag: "buttonPress" },
            xunpressed: { cls: 'Media', tag: "buttonOff" },
            // the sketch to show when the button is highlighted (mouse is over button)
            xhighlight: { cls: 'Media', tag: "buttonHover" },
            //xhighlight: { cls: 'Rect', color: new Color(50,50,50,.75), borderWidth: 5, borderColor: new Color(0,0,0,1) },
            mouseEnteredSound: Generator.generate({ cls: "Media", tag: "hoverIn"}), 
            mouseLeftSound: Generator.generate({ cls: "Media", tag: "hoverOut"}), 
            pressedSound: Generator.generate({ cls: "Media", tag: "selected"}), 
        };
    }

    static menuSlider(tag, spec={}) {
        let xxform = spec.xxform || {};
        return {
            // setup of slider metadata
            cls: "UxSlider",
            tag: tag,
            xxform: xxform,
            xknob: { cls: 'Media', tag: "buttonOff.small" },
            knobWidth: 24,
            barHeight: .33,
            xbar: { cls: 'Media', tag: "buttonOff.small" },
        };
    }

    static editorButton(tag, text, spec={}) {
        let xxform = spec.xxform || {};
        return {
            cls: "UxButton",
            tag: tag,
            ui: true,
            xxform: xxform,
            xtext: { color: new Color(0,255,0,.75), text: text, },
            xpressed: { cls: 'Rect', color: new Color(50,50,50,1), borderWidth: 5, borderColor: new Color(0,0,0,1) },
            xunpressed: { cls: 'Rect', color: new Color(50,50,50,.5), borderWidth: 5, borderColor: new Color(0,0,0,1) },
            xhighlight: { cls: 'Rect', color: new Color(50,50,50,.75), borderWidth: 5, borderColor: new Color(0,0,0,1) },
        };
    }

    static editorOverlayButton(tag, text, spec={}) {
        let xxform = spec.xxform || {};
        return {
            cls: "UxButton",
            tag: tag,
            ui: true,
            xxform: xxform,
            xtext: { color: new Color(0,255,0,.75), text: text, },
            xpressed: { cls: 'Rect', color: new Color(0,0,0,0), borderWidth: 5, borderColor: new Color(0,0,0,1) },
            xunpressed: { cls: 'Rect', color: new Color(0,0,0,0), borderWidth: 5, borderColor: new Color(0,0,0,1) },
            xhighlight: { cls: 'Rect', color: new Color(0,0,0,0), borderWidth: 5, borderColor: new Color(0,0,0,1) },
        };
    }

    static init() {
        this.aiWakeDirective = { 
            cls: "AiDirective", 
            tag: "wake", 
            xinfluence: {
                cls: "AiComboInfluence",
                xinfluences: [
                    {
                        weight: 1,
                        xinfluence: { cls: "AiGzoInfluence", tag: "currentActivity", scaler: (v) => (v === Activity.wake) ? 1 : 0},
                    },
                ],
            },
            xgoals: [
                { goal: AiGoal.idle },
                { goal: AiGoal.eat },
                { goal: AiGoal.loiter },
            ]
        }

        this.aiWorkDirective = { 
            cls: "AiDirective", 
            tag: "work", 
            xinfluence: {
                cls: "AiComboInfluence",
                xinfluences: [
                    {
                        weight: 1,
                        xinfluence: { cls: "AiGzoInfluence", tag: "currentActivity", scaler: (v) => (v === Activity.work) ? 1 : .1},
                    },
                ],
            },
            xgoals: [
                { goal: AiGoal.work, xinfluence: { cls: "AiInfluence", dfltScore: 2 }},  // prioritize work over waiting...
                { goal: AiGoal.wait },
            ]
        }

        this.aiRelaxDirective = { 
            cls: "AiDirective", 
            tag: "relax", 
            xinfluence: {
                cls: "AiComboInfluence",
                xinfluences: [
                    {
                        weight: 1,
                        xinfluence: { cls: "AiGzoInfluence", tag: "currentActivity", scaler: (v) => (v === Activity.relax) ? 1 : .1},
                    },
                ],
            },
            xgoals: [
                { goal: AiGoal.close, xinfluence: { cls: "AiInfluence", dfltScore: 2 }},  // prioritize closing up shop over others...
                { goal: AiGoal.socialize },
                //{ goal: AiGoal.eat },
                { goal: AiGoal.loiter },
            ]
        }

        this.aiRestDirective = { 
            cls: "AiDirective", 
            tag: "rest", 
            xinfluence: {
                cls: "AiComboInfluence",
                xinfluences: [
                    {
                        weight: 1,
                        xinfluence: { cls: "AiGzoInfluence", tag: "currentActivity", scaler: (v) => (v === Activity.sleep) ? 1 : 0},
                    },
                ],
            },
            xgoals: [
                { goal: AiGoal.sleep },
            ]
        }

        this.testSchedule = {
            cls: "ActivitySchedule",
            activities: [
                { weight: .1, activity: Activity.sleep },
                { weight: .2, activity: Activity.wake },
                //{ weight: .4, activity: Activity.work },
                { weight: .4, activity: Activity.relax },
                { weight: .1, activity: Activity.sleep },
            ],
        }

        this.innSchedule = {
            cls: "ActivitySchedule",
            activities: [
                { weight: .1, activity: Activity.sleep },
                { weight: .2, activity: Activity.wake },
                { weight: .8, activity: Activity.work },
                { weight: .1, activity: Activity.sleep },
            ],
        }

    }

    static xvarsprite(tag, coords, spec={}) {
        let tileSize = spec.tileSize || Config.tileSize;
        let width = spec.width || tileSize;
        let height = spec.height || tileSize;
        let offx = spec.offx || 0;
        let offy = spec.offy || 0;
        delete spec.width;
        delete spec.height;
        delete spec.offx;
        delete spec.offy;
        var xref = Object.assign({}, spec, {
            tag: tag,
            cls: "VarSprite",
            variations: [],
        });
        for (const [x,y] of coords) {
            xref.variations.push(
                { x: offx+(tileSize*x), y: offy+(tileSize*y), width: width, height: height },
            );
        }
        return xref;
    }

    static overlayMedia(file, tag, spec={}) {
        let xmedia = { 
            src: file, 
            loader: "Sheet", 
            refs: [],
        };
        xmedia.refs.push(this.xvarsprite(`${tag}.a`, [[0,0], [1,1]], this.addHints(spec, tag, {l: "bcdi", r: "blmo", u: "bcfm", d: "bgio"})));
        xmedia.refs.push(this.xvarsprite(`${tag}.b`, [[1,0], [0,1]], this.addHints(spec, tag, {l: "akln", r: "adeh", u: "aegn", d: "afhk"})));
        xmedia.refs.push(this.xvarsprite(`${tag}.c`, [[3,0], [2,2], [0,3]], this.addHints(spec, tag, {r: "adeh", d: "afhk"})));
        xmedia.refs.push(this.xvarsprite(`${tag}.d`, [[4,0], [5,0], [1,3], [8,3]], this.addHints(spec, tag, {l: "bcdi", r: "adeh", d: "j"})));
        xmedia.refs.push(this.xvarsprite(`${tag}.e`, [[6,0], [7,2], [9,3]], this.addHints(spec, tag, {l: "bcdi", d: "bgio"})));
        xmedia.refs.push(this.xvarsprite(`${tag}.f`, [[3,1], [0,4], [0,5], [3,8]], this.addHints(spec, tag, {r: "j", u: "bcfm", d: "afhk"})));
        xmedia.refs.push(this.xvarsprite(`${tag}.g`, [[6,1], [9,4], [9,5], [6,8]], this.addHints(spec, tag, {l: "j", u: "aegn", d: "bgio"})));
        xmedia.refs.push(this.xvarsprite(`${tag}.h`, [[3,2], [2,3]], this.addHints(spec, tag, {l: "bcdi", r: "j", u: "bcfm", d: "j"})));
        xmedia.refs.push(this.xvarsprite(`${tag}.i`, [[6,2], [7,3]], this.addHints(spec, tag, {l: "j", r: "adeh", u: "aegn", d: "j"})));
        xmedia.refs.push(this.xvarsprite(`${tag}.j`, [[1,4], [2,4], [3,4], [4,4], [5,4], [6,4], [7,4], [8,4]], this.addHints(spec, tag, {l: "fhm", r: "gin", u: "dhi", d: "lmn"})));
        xmedia.refs.push(this.xvarsprite(`${tag}.k`, [[0,6], [2,7], [3,9]], this.addHints(spec, tag, {r: "blmo", u: "bcfm" })));
        xmedia.refs.push(this.xvarsprite(`${tag}.l`, [[1,6], [8,6], [4,9], [5,9]], this.addHints(spec, tag, {l:"akln", r: "blmo", u: "j"})));
        xmedia.refs.push(this.xvarsprite(`${tag}.m`, [[2,6], [3,7]], this.addHints(spec, tag, {l: "akln", r: "j", u: "j", d: "afhk"})));
        xmedia.refs.push(this.xvarsprite(`${tag}.n`, [[7,6], [6,7]], this.addHints(spec, tag, {l: "j", r: "blmo", u: "j", d: "bgio"})));
        xmedia.refs.push(this.xvarsprite(`${tag}.o`, [[9,6], [7,7], [6,9]], this.addHints(spec, tag, {l: "akln", u: "aegn"})));
        return xmedia;
    }

    static addHints(spec, tag, neighbors) {
        let hints = {};
        for (const dir of "udlr") {
            if (neighbors[dir]) {
                hints[dir] = [];
                for (const n of neighbors[dir]) {
                    hints[dir].push()
                    hints[dir].push(`${tag}.${n}`);
                }
            }
        }
        return Object.assign({hints: hints}, spec);
    }

    static wallMedia(file, tag, spec={}) {
        let xmedia = { 
            src: file, 
            loader: "Sheet", 
            refs: [],
        };
        xmedia.refs.push(this.xvarsprite(`${tag}.a`, [[3,0], [2,3], [0,4], [6,7], [5,8]], this.addHints(spec, tag, {r: "bcik", d: "dk"})));
        xmedia.refs.push(this.xvarsprite(`${tag}.b`, [[4,0], [1,4], [1,7], [4,11]], this.addHints(spec, tag, {l: "abjn", r: "bcik", d: "e"})));
        xmedia.refs.push(this.xvarsprite(`${tag}.c`, [[5,0], [6,3], [7,4], [2,7], [3,8]], this.addHints(spec, tag, {l: "abjn", d: "fn"})));
        xmedia.refs.push(this.xvarsprite(`${tag}.d`, [[3,1], [0,5], [5,9]], this.addHints(spec, tag, {r: "el", u: "a", d: "ghij"})));
        xmedia.refs.push(this.xvarsprite(`${tag}.e`, [[4,1], [1,5], [1,8], [4,12]], this.addHints(spec, tag, {l: "dem", r: "efl", u: "b"})));
        xmedia.refs.push(this.xvarsprite(`${tag}.f`, [[5,1], [7,5], [3,9]], this.addHints(spec, tag, {l: "dem", u: "c", d: "ghij"})));

        xmedia.refs.push(this.xvarsprite(`${tag}.g`, [[3,2], [0,6], [3,10]], this.addHints(spec, tag, {u: "dfgh", d: "ghij"})));
        xmedia.refs.push(this.xvarsprite(`${tag}.h`, [[5,2], [7,6], [5,10]], this.addHints(spec, tag, {u: "dfgh", d: "ghij"})));
        xmedia.refs.push(this.xvarsprite(`${tag}.i`, [[3,3], [7,7], [5,11]], this.addHints(spec, tag, {l: "abjn", u: "dfgh", d: "l"})));
        xmedia.refs.push(this.xvarsprite(`${tag}.j`, [[5,3], [0,7], [3,11]], this.addHints(spec, tag, {r: "bcik", u: "dfgh", d: "m"})));
        xmedia.refs.push(this.xvarsprite(`${tag}.k`, [[2,4], [6,8]], this.addHints(spec, tag, {l: "abjn", r: "l", u: "a", d: "l"})));
        xmedia.refs.push(this.xvarsprite(`${tag}.l`, [[3,4], [2,5], [7,8], [6,9], [5,12]], this.addHints(spec, tag, {l: "dekm", u: "ik"})));
        xmedia.refs.push(this.xvarsprite(`${tag}.m`, [[5,4], [6,5], [0,8], [2,9], [3,12]], this.addHints(spec, tag, {r: "efln", u: "jn"})));
        xmedia.refs.push(this.xvarsprite(`${tag}.n`, [[6,4], [2,8]], this.addHints(spec, tag, {l: "m", r: "bcik", u: "c", d: "m"})));
        return xmedia;

    }

    static frontRoofMedia(file, tag, spec={}) {
        let xmedia = { 
            src: file, 
            loader: "Sheet", 
            refs: [],
        };
        xmedia.refs.push(this.xvarsprite(`${tag}.a`, [[0,4], [9,4], [12,4]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.b`, [[1,4], [2,4], [6,4], [7,4], [10,4], [13,4]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.c`, [[8,4], [11,4], [14,4]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.d`, [[0,5], [9,5]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.e`, [[1,5], [2,5], [6,5], [7,5], [10,5]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.f`, [[8,5], [11,5]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.g`, [[12,5]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.h`, [[13,5]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.i`, [[14,5]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.j`, [[0,6]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.k`, [[1,6], [7,6]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.l`, [[8,6]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.m`, [[9,6], [10,6], [11,6]], spec));
        return xmedia;
    }

    static backRoofMedia(file, tag, spec={}) {
        let xmedia = { 
            src: file, 
            loader: "Sheet", 
            refs: [],
        };
        xmedia.refs.push(this.xvarsprite(`${tag}.a`, [[7,0]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.b`, [[8,0]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.c`, [[9,0]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.d`, [[7,1]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.e`, [[8,1]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.f`, [[9,1]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.g`, [[7,2]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.h`, [[8,2]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.i`, [[9,2]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.j`, [[0,3]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.k`, [[1,3], [7,3]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.l`, [[8,3]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.m`, [[9,3]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.n`, [[10,3]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.o`, [[11,3]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.p`, [[12,3]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.q`, [[13,3]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.r`, [[14,3]], spec));
        return xmedia;
    }

    static leftRoofMedia(file, tag, spec={}) {
        let xmedia = { 
            src: file, 
            loader: "Sheet", 
            refs: [],
        };
        xmedia.refs.push(this.xvarsprite(`${tag}.a`, [[3,0], [2,1]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.b`, [[4,0]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.c`, [[3,1]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.d`, [[4,1], [4,2], [4,5], [4,6], [4,7], [4,8]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.e`, [[2,2], [2,7], [2,8], [2,9]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.f`, [[3,2], [3,7], [3,8]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.g`, [[2,3]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.h`, [[3,3]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.i`, [[4,3]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.j`, [[3,4]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.k`, [[4,4]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.l`, [[3,5]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.m`, [[2,6]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.n`, [[3,6]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.o`, [[3,9]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.p`, [[4,9]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.q`, [[2,10]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.r`, [[3,10]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.s`, [[4,10]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.t`, [[7,8]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.u`, [[9,8]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.v`, [[10,8]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.w`, [[7,9]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.x`, [[9,9]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.y`, [[10,9]], spec));
        return xmedia;
    }

    static rightRoofMedia(file, tag, spec={}) {
        let xmedia = { 
            src: file, 
            loader: "Sheet", 
            refs: [],
        };
        xmedia.refs.push(this.xvarsprite(`${tag}.a`, [[5,0], [6,1]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.b`, [[5,1]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.c`, [[5,2], [5,7], [5,8]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.d`, [[6,2], [6,7], [6,8], [6,9]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.e`, [[5,3]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.f`, [[6,3]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.g`, [[5,4]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.h`, [[5,5]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.i`, [[5,6]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.j`, [[6,6]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.k`, [[5,9]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.l`, [[5,10]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.m`, [[6,10]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.n`, [[8,8]], spec));
        xmedia.refs.push(this.xvarsprite(`${tag}.o`, [[8,9]], spec));
        return xmedia;
    }

    static roofMedia(file, ltag, rtag, ftag, btag, spec={}) {
        let lmedia = this.leftRoofMedia(file, ltag, spec);
        let rmedia = this.rightRoofMedia(file, rtag, spec);
        let bmedia = this.backRoofMedia(file, btag, spec);
        let fmedia = this.frontRoofMedia(file, ftag, spec);
        let xmedia = { 
            src: file, 
            loader: "Sheet", 
            refs: lmedia.refs.concat(rmedia.refs, bmedia.refs, fmedia.refs),
        };
        return xmedia;
    }

    static overlayTiles(baseId, baseTag, xcolliders={}) {
        let xtiles = [];
        for (const c of "abcdefghijklmno") {
            let id = `${baseId}${c}`;
            let tag = `${baseTag}.${c}`;
            let spec = {};
            let xcollider = xcolliders[c];
            if (xcollider) {
                spec.xcollider = xcollider;
            }
            xtiles.push(Templates.tile(id, tag, spec))
        }
        return xtiles;
    };

    static overlayColliders(width=16) {
        let qtr = width/4;
        let half = width/2;
        return {
            a: { width: width, height: width, offx: 0, offy: 0 },
            b: { width: width, height: width, offx: 0, offy: 0 },
            c: { width: half, height: half, offx: qtr, offy: qtr },
            d: { width: width, height: half, offx: 0, offy: qtr },
            e: { width: half, height: half, offx: -qtr, offy: qtr },
            f: { width: half, height: width, offx: qtr, offy: 0 },
            g: { width: half, height: width, offx: -qtr, offy: 0 },
            h: { width: width, height: width, offx: 0, offy: 0 },
            i: { width: width, height: width, offx: 0, offy: 0 },
            j: { width: width, height: width, offx: 0, offy: 0 },
            k: { width: half, height: half, offx: qtr, offy: -qtr },
            l: { width: width, height: half, offx: 0, offy: -qtr },
            m: { width: width, height: width, offx: 0, offy: 0 },
            n: { width: width, height: width, offx: 0, offy: 0 },
        }
    }

    static wallColliders(width=8, offset=0) {
        return {
            d: { width: width, height: width, offy: offset },
            e: { width: Config.tileSize, height: width, offy: offset },
            f: { width: width, height: width, offy: offset },
            g: { width: width, height: Config.tileSize, offx: offset },
            h: { width: width, height: Config.tileSize, offx: offset },
            i: { width: width, height: Config.tileSize, offx: offset },
            j: { width: width, height: Config.tileSize, offx: offset },
            l: { width: width, height: width, offy: offset },
            m: { width: width, height: width, offy: offset },
        }
    }

    static wallTiles(baseId, baseTag, xcolliders={}) {
        let xtiles = [];
        for (const c of "abcdefghijklmn") {
            let id = `${baseId}${c}`;
            let tag = `${baseTag}.${c}`;
            let xcollider = xcolliders[c];
            let spec = {};
            if (xcollider) {
                spec.xcollider = xcollider;
            }
            xtiles.push(Templates.tile(id, tag, spec))
        }
        return xtiles;
    }

    static frontRoofTiles(baseId, baseTag) {
        let xtiles = [];
        for (const c of "abcdefghijklm") {
            let id = `${baseId}${c}`;
            let tag = `${baseTag}.${c}`;
            xtiles.push(Templates.tile(id, tag))
        }
        return xtiles;
    }

    static backRoofTiles(baseId, baseTag) {
        let xtiles = [];
        for (const c of "abcdefghijklmnopqr") {
            let id = `${baseId}${c}`;
            let tag = `${baseTag}.${c}`;
            xtiles.push(Templates.tile(id, tag))
        }
        return xtiles;
    }

    static leftRoofTiles(baseId, baseTag) {
        let xtiles = [];
        for (const c of "abcdefghijklmnopqrstuvwxy") {
            let id = `${baseId}${c}`;
            let tag = `${baseTag}.${c}`;
            xtiles.push(Templates.tile(id, tag))
        }
        return xtiles;
    }

    static rightRoofTiles(baseId, baseTag) {
        let xtiles = [];
        for (const c of "abcdefghijklmno") {
            let id = `${baseId}${c}`;
            let tag = `${baseTag}.${c}`;
            xtiles.push(Templates.tile(id, tag))
        }
        return xtiles;
    }

    static xsprite(tag, col, row, spec={}) {
        let tileSize = spec.tileSize || Config.tileSize;
        let width = spec.width || tileSize;
        let height = spec.height || tileSize;
        let x = col*tileSize;
        let y = row*tileSize;
        return {tag: tag, cls: "Sprite", width: width, height: height, x: x, y: y};
    }

    static xanim(tag, col, row, spec={}) {
        let tileSize = spec.tileSize || Config.tileSize;
        let width = spec.width || tileSize;
        let height = spec.height || tileSize;
        let offx = col*tileSize;
        let offy = row*tileSize;
        const frames = spec.frames || 8;
        // duration is fixed or specified as array of durations corresponding to each frame
        const duration = spec.duration || 100;
        const loop = spec.hasOwnProperty("loop") ? spec.loop : true;
        const noreset = spec.hasOwnProperty("noreset") ? spec.noreset : false;
        const horizontal = spec.horizontal || false;
        let anim = {tag: tag, cls: "Animation", cels: [], loop: loop, noreset: noreset};
        for (let i=0; i<frames; i++) {
            let x = offx + ((horizontal) ? i*width : 0);
            let y = offy + ((horizontal) ? 0 : i*height);
            let cdur = (duration instanceof(Array)) ? ((i<duration.length) ? duration[i] : duration[duration.length-1]) : duration;
            let cel = { x: x, y: y, width: width, height: height, ttl: cdur };
            anim.cels.push(cel);
        }
        return anim;
    }

    static anim(tag, spec={}) {
        const frames = spec.frames || 8;
        const duration = spec.duration || 100;
        const width = spec.width || Config.halfSize;
        const height = spec.height || Config.halfSize;
        const offx = spec.offx || 0;
        const offy = spec.offy || 0;
        const loop = spec.hasOwnProperty("loop") ? spec.loop : true;
        const row = spec.row || false;
        let anim = {tag: tag, cls: "Animation", cels: [], loop: loop};
        for (let i=0; i<frames; i++) {
            let x = offx + ((row) ? i*width : 0);
            let y = offy + ((row) ? 0 : i*height);
            let cel = { x: x, y: y, width: width, height: height, ttl: duration };
            anim.cels.push(cel);
        }
        return anim;
    }

    static tile(id, tag, spec={}) {
        let mediaTag = spec.mediaTag || tag;
        // handle tile offsets, applying offset to both the object's collider (if any)
        // and the object's view xform
        let offx = spec.offx || 0;
        let offy = spec.offy || 0;
        if (offx || offy) {
            if (spec.xcollider) {
                spec.xcollider.offx = (spec.xcollider.offx) ? spec.xcollider.offx + offx : offx;
                spec.xcollider.offy = (spec.xcollider.offy) ? spec.xcollider.offy + offy : offy;
            }
            if (spec.xxform) {
                spec.xxform.dx = (spec.xxform.dx) ? spec.xxform.dx + offx : offx;
                spec.xxform.dy = (spec.xxform.dy) ? spec.xxform.dy + offy : offy;
            } else {
                spec.xxform = { dx: offx, dy: offy };
            }
        }
        return Object.assign({
            cls: "Tile", 
            id: id, 
            tag: tag,           
            xsketch: { 
                cls: "Media", 
                tag: mediaTag,
            }
        }, spec);
    }

    static object(id, tag, cls, spec={}) {
        let mediaTag = spec.mediaTag || tag;
        // handle object offsets, applying offset to both the object's collider (if any)
        // and the object's view xform
        let offx = spec.offx || 0;
        let offy = spec.offy || 0;
        if (offx || offy) {
            if (spec.xcollider) {
                spec.xcollider.offx = (spec.xcollider.offx) ? spec.xcollider.offx + offx : offx;
                spec.xcollider.offy = (spec.xcollider.offy) ? spec.xcollider.offy + offy : offy;
            }
            if (spec.xxform) {
                spec.xxform.dx = (spec.xxform.dx) ? spec.xxform.dx + offx : offx;
                spec.xxform.dy = (spec.xxform.dy) ? spec.xxform.dy + offy : offy;
            } else {
                spec.xxform = { dx: offx, dy: offy };
            }
        }
        return Object.assign({
            cls: cls, 
            id: id, 
            tag: tag,           
            xsketch: { 
                cls: "Media", 
                tag: mediaTag,
            }
        }, spec);
    }

}