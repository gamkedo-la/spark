export { Templates };

import { AiGoal }               from "./base/ai/aiGoal.js";
import { Activity }             from "./base/activity.js";
import { Config }               from "./base/config.js";

class Templates {

    static init() {
        this.aiSleepDirective = { 
            cls: "AiDirective", 
            tag: "sleep", 
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
        this.aiIdleDirective = { 
            cls: "AiDirective", 
            tag: "idle", 
            xinfluence: {
                cls: "AiComboInfluence",
                xinfluences: [
                    {
                        weight: 1,
                        xinfluence: { cls: "AiGzoInfluence", tag: "currentActivity", scaler: (v) => (v === Activity.idle) ? 1 : 0},
                    },
                ],
            },
            xgoals: [
                { goal: AiGoal.idle },
            ]
        }

        this.testSchedule = {
            cls: "ActivitySchedule",
            activities: [
                { weight: .2, activity: Activity.sleep },
                { weight: .6, activity: Activity.idle },
                { weight: .2, activity: Activity.sleep },
            ],
        }
    }

    static varSpriteRef(tag, coords, spec={}) {
        let width = spec.width || Config.tileSize;
        let height = spec.height || Config.tileSize;
        let offx = spec.offx || 0;
        let offy = spec.offy || 0;
        var xref = {
            tag: tag,
            cls: "VarSprite",
            variations: [],
        }
        console.log("coords: " + coords)
        for (const [x,y] of coords) {
            xref.variations.push(
                { x: offx+(width*x), y: offy+(height*y), width: width, height: height },
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
        xmedia.refs.push(this.varSpriteRef(`${tag}.a`, [[0,0], [1,1]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.b`, [[1,0], [0,1]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.c`, [[3,0], [2,2], [0,3]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.d`, [[4,0], [5,0], [1,3], [8,3]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.e`, [[6,0], [7,2], [9,3]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.f`, [[3,1], [0,4], [0,5], [3,8]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.g`, [[6,1], [9,4], [9,5], [6,8]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.h`, [[3,2], [2,3]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.i`, [[6,2], [7,3]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.j`, [[1,4], [2,4], [3,4], [4,4], [5,4], [6,4], [7,4], [8,4]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.k`, [[0,6], [2,7], [3,9]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.l`, [[1,6], [8,6], [4,9], [5,9]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.m`, [[2,6], [3,7]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.n`, [[7,6], [6,7]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.o`, [[9,6], [7,7], [6,9]], spec));
        return xmedia;
    }

    static wallMedia(file, tag, spec={}) {
        let xmedia = { 
            src: file, 
            loader: "Sheet", 
            refs: [],
        };
        xmedia.refs.push(this.varSpriteRef(`${tag}.a`, [[3,0], [2,3], [0,4], [6,7], [5,8]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.b`, [[4,0], [1,4], [1,7], [4,11]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.c`, [[5,0], [6,3], [7,4], [2,7], [3,8]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.d`, [[3,1], [0,5], [5,9]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.e`, [[4,1], [1,5], [1,8], [4,12]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.f`, [[5,1], [7,5], [3,9]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.g`, [[3,2], [0,6], [3,10]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.h`, [[5,2], [7,6], [5,10]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.i`, [[3,3], [7,7], [5,11]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.j`, [[5,3], [0,7], [3,11]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.k`, [[2,4], [6,8]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.l`, [[3,4], [2,5], [7,8], [6,9], [5,12]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.m`, [[5,4], [6,5], [0,8], [2,9], [3,12]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.n`, [[6,4], [2,8]], spec));
        return xmedia;

    }

    static frontRoofMedia(file, tag, spec={}) {
        let xmedia = { 
            src: file, 
            loader: "Sheet", 
            refs: [],
        };
        xmedia.refs.push(this.varSpriteRef(`${tag}.a`, [[0,4], [9,4], [12,4]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.b`, [[1,4], [2,4], [6,4], [7,4], [10,4], [13,4]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.c`, [[8,4], [11,4], [14,4]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.d`, [[0,5], [9,5]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.e`, [[1,5], [2,5], [6,5], [7,5], [10,5]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.f`, [[8,5], [11,5]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.g`, [[12,5]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.h`, [[13,5]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.i`, [[14,5]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.j`, [[0,6]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.k`, [[1,6], [7,6]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.l`, [[8,6]], spec));
        return xmedia;
    }

    static backRoofMedia(file, tag, spec={}) {
        let xmedia = { 
            src: file, 
            loader: "Sheet", 
            refs: [],
        };
        xmedia.refs.push(this.varSpriteRef(`${tag}.a`, [[7,0]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.b`, [[8,0]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.c`, [[9,0]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.d`, [[7,1]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.e`, [[8,1]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.f`, [[9,1]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.g`, [[7,2]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.h`, [[8,2]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.i`, [[9,2]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.j`, [[0,3]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.k`, [[1,3], [7,3]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.l`, [[8,3]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.m`, [[9,3]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.n`, [[10,3]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.o`, [[11,3]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.p`, [[12,3]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.q`, [[13,3]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.r`, [[14,3]], spec));
        return xmedia;
    }

    static leftRoofMedia(file, tag, spec={}) {
        let xmedia = { 
            src: file, 
            loader: "Sheet", 
            refs: [],
        };
        xmedia.refs.push(this.varSpriteRef(`${tag}.a`, [[3,0], [2,1]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.b`, [[4,0]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.c`, [[3,1]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.d`, [[4,1], [4,2], [4,5], [4,6], [4,7], [4,8]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.e`, [[2,2], [2,7], [2,8], [2,9]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.f`, [[3,2], [3,7], [3,8]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.g`, [[2,3]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.h`, [[3,3]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.i`, [[4,3]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.j`, [[3,4]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.k`, [[4,4]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.l`, [[3,5]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.m`, [[2,6]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.n`, [[3,6]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.o`, [[3,9]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.p`, [[4,9]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.q`, [[2,10]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.r`, [[3,10]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.s`, [[4,10]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.t`, [[7,8]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.u`, [[9,8]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.v`, [[10,8]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.w`, [[7,9]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.x`, [[9,9]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.y`, [[10,9]], spec));
        return xmedia;
    }

    static rightRoofMedia(file, tag, spec={}) {
        let xmedia = { 
            src: file, 
            loader: "Sheet", 
            refs: [],
        };
        xmedia.refs.push(this.varSpriteRef(`${tag}.a`, [[5,0], [6,1]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.b`, [[5,1]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.c`, [[5,2], [5,7], [5,8]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.d`, [[6,2], [6,7], [6,8], [6,9]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.e`, [[5,3]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.f`, [[6,3]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.g`, [[5,4]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.h`, [[5,5]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.i`, [[5,6]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.j`, [[6,6]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.k`, [[5,9]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.l`, [[5,10]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.m`, [[6,10]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.n`, [[8,8]], spec));
        xmedia.refs.push(this.varSpriteRef(`${tag}.o`, [[8,9]], spec));
        return xmedia;
    }

    static roofMedia(file, ltag, rtag, btag, ftag, spec={}) {
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

    static overlayTiles(baseId, baseTag) {
        let xtiles = [];
        for (const c of "abcdefghijklmno") {
            let id = `${baseId}${c}`;
            let tag = `${baseTag}.${c}`;
            xtiles.push(Templates.tile(id, tag))
        }
        return xtiles;
    }

    static wallTiles(baseId, baseTag) {
        let xtiles = [];
        for (const c of "abcdefghijklmn") {
            let id = `${baseId}${c}`;
            let tag = `${baseTag}.${c}`;
            xtiles.push(Templates.tile(id, tag))
        }
        return xtiles;
    }

    static frontRoofTiles(baseId, baseTag) {
        let xtiles = [];
        for (const c of "abcdefghijkl") {
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

    static anim(tag, spec={}) {
        const frames = spec.frames || 8;
        const duration = spec.duration || 100;
        const width = spec.width || Config.halfSize;
        const height = spec.height || Config.halfSize;
        const xoff = spec.xoff || 0;
        const yoff = spec.yoff || 0;
        const row = spec.row || false;
        let anim = {tag: tag, cls: "Animation", cels: []};
        for (let i=0; i<frames; i++) {
            let x = xoff + ((row) ? i*width : 0);
            let y = yoff + ((row) ? 0 : i*height);
            let cel = { x: x, y: y, width: width, height: height, ttl: duration };
            anim.cels.push(cel);
        }
        return anim;
    }

    static tile(id, tag, spec={}) {
        let mediaTag = spec.mediaTag || tag;
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

}