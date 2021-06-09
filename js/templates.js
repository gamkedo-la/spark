export { Templates };

import { AiGoal }               from "./base/ai/aiGoal.js";
import { Activity }             from "./base/activity.js";
import { Config }               from "./base/config.js";
import { Fmt } from "./base/fmt.js";

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

    static overlaySprite(file, tag, spec={}) {
        let xmedia = { 
            src: file, 
            loader: "Sheet", 
            refs: [],
         };
         let width = spec.width || Config.tileSize;
         let height = spec.height || Config.tileSize;

         xmedia.refs.push({
            tag: `${tag}.a`,
            cls: "VarSprite",
            variations: [
                { x: width*0, y: height*0, width: width, height: height },
                { x: width*1, y: height*1, width: width, height: height },
            ],
        });

         xmedia.refs.push({
            tag: `${tag}.b`,
            cls: "VarSprite",
            variations: [
                { x: width*1, y: height*0, width: width, height: height },
                { x: width*0, y: height*1, width: width, height: height },
            ],
        });

         xmedia.refs.push({
            tag: `${tag}.c`,
            cls: "VarSprite",
            variations: [
                { x: width*3, y: height*0, width: width, height: height },
                { x: width*2, y: height*2, width: width, height: height },
                { x: width*0, y: height*3, width: width, height: height },
            ],
        });

         xmedia.refs.push({
            tag: `${tag}.d`,
            cls: "VarSprite",
            variations: [
                { x: width*4, y: height*0, width: width, height: height },
                { x: width*5, y: height*0, width: width, height: height },
                { x: width*1, y: height*3, width: width, height: height },
                { x: width*8, y: height*3, width: width, height: height },
            ],
        });

         xmedia.refs.push({
            tag: `${tag}.e`,
            cls: "VarSprite",
            variations: [
                { x: width*6, y: height*0, width: width, height: height },
                { x: width*7, y: height*2, width: width, height: height },
                { x: width*9, y: height*3, width: width, height: height },
            ],
        });

         xmedia.refs.push({
            tag: `${tag}.f`,
            cls: "VarSprite",
            variations: [
                { x: width*3, y: height*1, width: width, height: height },
                { x: width*0, y: height*4, width: width, height: height },
                { x: width*0, y: height*5, width: width, height: height },
                { x: width*3, y: height*8, width: width, height: height },
            ],
        });

         xmedia.refs.push({
            tag: `${tag}.g`,
            cls: "VarSprite",
            variations: [
                { x: width*6, y: height*1, width: width, height: height },
                { x: width*9, y: height*4, width: width, height: height },
                { x: width*9, y: height*5, width: width, height: height },
                { x: width*6, y: height*8, width: width, height: height },
            ],
        });

         xmedia.refs.push({
            tag: `${tag}.h`,
            cls: "VarSprite",
            variations: [
                { x: width*3, y: height*2, width: width, height: height },
                { x: width*2, y: height*3, width: width, height: height },
            ],
        });

         xmedia.refs.push({
            tag: `${tag}.i`,
            cls: "VarSprite",
            variations: [
                { x: width*6, y: height*2, width: width, height: height },
                { x: width*7, y: height*3, width: width, height: height },
            ],
        });

         xmedia.refs.push({
            tag: `${tag}.j`,
            cls: "VarSprite",
            variations: [
                { x: width*1, y: height*4, width: width, height: height },
                { x: width*2, y: height*4, width: width, height: height },
                { x: width*3, y: height*4, width: width, height: height },
                { x: width*4, y: height*4, width: width, height: height },
                { x: width*5, y: height*4, width: width, height: height },
                { x: width*6, y: height*4, width: width, height: height },
                { x: width*7, y: height*4, width: width, height: height },
                { x: width*8, y: height*4, width: width, height: height },
            ],
        });

        //console.log(`refs: ${Fmt.ofmt(xmedia.refs[xmedia.refs.length-1].variations)}`);

         xmedia.refs.push({
            tag: `${tag}.k`,
            cls: "VarSprite",
            variations: [
                { x: width*0, y: height*6, width: width, height: height },
                { x: width*2, y: height*7, width: width, height: height },
                { x: width*3, y: height*9, width: width, height: height },
            ],
        });

         xmedia.refs.push({
            tag: `${tag}.l`,
            cls: "VarSprite",
            variations: [
                { x: width*1, y: height*6, width: width, height: height },
                { x: width*8, y: height*6, width: width, height: height },
                { x: width*4, y: height*9, width: width, height: height },
                { x: width*5, y: height*9, width: width, height: height },
            ],
        });

         xmedia.refs.push({
            tag: `${tag}.m`,
            cls: "VarSprite",
            variations: [
                { x: width*2, y: height*6, width: width, height: height },
                { x: width*3, y: height*7, width: width, height: height },
            ],
        });

         xmedia.refs.push({
            tag: `${tag}.n`,
            cls: "VarSprite",
            variations: [
                { x: width*7, y: height*6, width: width, height: height },
                { x: width*6, y: height*7, width: width, height: height },
            ],
        });

         xmedia.refs.push({
            tag: `${tag}.o`,
            cls: "VarSprite",
            variations: [
                { x: width*9, y: height*6, width: width, height: height },
                { x: width*7, y: height*7, width: width, height: height },
                { x: width*6, y: height*9, width: width, height: height },
            ],
        });

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

    static wallSprite(file, tag, spec={}) {
        let xmedia = { 
            src: file, 
            loader: "Sheet", 
            refs: [],
         };
         let width = spec.width || Config.tileSize;
         let height = spec.height || Config.tileSize;

         xmedia.refs.push({
            tag: `${tag}.a`,
            cls: "VarSprite",
            variations: [
                { x: width*3, y: height*0, width: width, height: height },
                { x: width*2, y: height*3, width: width, height: height },
                { x: width*0, y: height*4, width: width, height: height },
                { x: width*6, y: height*8, width: width, height: height },
                { x: width*5, y: height*9, width: width, height: height },
            ],
        });

         xmedia.refs.push({
            tag: `${tag}.b`,
            cls: "VarSprite",
            variations: [
                { x: width*4, y: height*0, width: width, height: height },
                { x: width*1, y: height*4, width: width, height: height },
                { x: width*1, y: height*8, width: width, height: height },
                { x: width*4, y: height*12, width: width, height: height },
            ],
        });

         xmedia.refs.push({
            tag: `${tag}.c`,
            cls: "VarSprite",
            variations: [
                { x: width*5, y: height*0, width: width, height: height },
                { x: width*6, y: height*3, width: width, height: height },
                { x: width*7, y: height*4, width: width, height: height },
                { x: width*2, y: height*8, width: width, height: height },
                { x: width*3, y: height*9, width: width, height: height },
            ],
        });

         xmedia.refs.push({
            tag: `${tag}.d`,
            cls: "VarSprite",
            variations: [
                { x: width*3, y: height*1, width: width, height: height },
                { x: width*0, y: height*5, width: width, height: height },
                { x: width*5, y: height*10, width: width, height: height },
            ],
        });

         xmedia.refs.push({
            tag: `${tag}.e`,
            cls: "VarSprite",
            variations: [
                { x: width*4, y: height*1, width: width, height: height },
                { x: width*1, y: height*5, width: width, height: height },
                { x: width*1, y: height*9, width: width, height: height },
                { x: width*4, y: height*13, width: width, height: height },
            ],
        });

         xmedia.refs.push({
            tag: `${tag}.f`,
            cls: "VarSprite",
            variations: [
                { x: width*5, y: height*1, width: width, height: height },
                { x: width*7, y: height*5, width: width, height: height },
                { x: width*3, y: height*10, width: width, height: height },
            ],
        });

         xmedia.refs.push({
            tag: `${tag}.g`,
            cls: "VarSprite",
            variations: [
                { x: width*3, y: height*2, width: width, height: height },
                { x: width*0, y: height*6, width: width, height: height },
                { x: width*5, y: height*11, width: width, height: height },
            ],
        });

         xmedia.refs.push({
            tag: `${tag}.h`,
            cls: "VarSprite",
            variations: [
                { x: width*4, y: height*2, width: width, height: height },
                { x: width*1, y: height*6, width: width, height: height },
                { x: width*1, y: height*10, width: width, height: height },
                { x: width*4, y: height*14, width: width, height: height },
            ],
        });

         xmedia.refs.push({
            tag: `${tag}.i`,
            cls: "VarSprite",
            variations: [
                { x: width*5, y: height*2, width: width, height: height },
                { x: width*7, y: height*6, width: width, height: height },
                { x: width*3, y: height*11, width: width, height: height },
            ],
        });

         xmedia.refs.push({
            tag: `${tag}.j`,
            cls: "VarSprite",
            variations: [
                { x: width*3, y: height*3, width: width, height: height },
                { x: width*7, y: height*8, width: width, height: height },
                { x: width*5, y: height*12, width: width, height: height },
            ],
        });

        //console.log(`refs: ${Fmt.ofmt(xmedia.refs[xmedia.refs.length-1].variations)}`);

         xmedia.refs.push({
            tag: `${tag}.k`,
            cls: "VarSprite",
            variations: [
                { x: width*5, y: height*3, width: width, height: height },
                { x: width*0, y: height*8, width: width, height: height },
                { x: width*3, y: height*12, width: width, height: height },
            ],
        });

         xmedia.refs.push({
            tag: `${tag}.l`,
            cls: "VarSprite",
            variations: [
                { x: width*2, y: height*4, width: width, height: height },
                { x: width*6, y: height*9, width: width, height: height },
            ],
        });

         xmedia.refs.push({
            tag: `${tag}.m`,
            cls: "VarSprite",
            variations: [
                { x: width*3, y: height*4, width: width, height: height },
                { x: width*7, y: height*9, width: width, height: height },
                { x: width*5, y: height*13, width: width, height: height },
            ],
        });

         xmedia.refs.push({
            tag: `${tag}.n`,
            cls: "VarSprite",
            variations: [
                { x: width*5, y: height*4, width: width, height: height },
                { x: width*0, y: height*9, width: width, height: height },
                { x: width*3, y: height*13, width: width, height: height },
            ],
        });

         xmedia.refs.push({
            tag: `${tag}.o`,
            cls: "VarSprite",
            variations: [
                { x: width*6, y: height*4, width: width, height: height },
                { x: width*2, y: height*9, width: width, height: height },
            ],
        });

         xmedia.refs.push({
            tag: `${tag}.p`,
            cls: "VarSprite",
            variations: [
                { x: width*2, y: height*5, width: width, height: height },
                { x: width*6, y: height*10, width: width, height: height },
            ],
        });

         xmedia.refs.push({
            tag: `${tag}.q`,
            cls: "VarSprite",
            variations: [
                { x: width*3, y: height*5, width: width, height: height },
                { x: width*2, y: height*6, width: width, height: height },
                { x: width*7, y: height*10, width: width, height: height },
                { x: width*6, y: height*11, width: width, height: height },
                { x: width*5, y: height*14, width: width, height: height },
            ],
        });

         xmedia.refs.push({
            tag: `${tag}.r`,
            cls: "VarSprite",
            variations: [
                { x: width*5, y: height*5, width: width, height: height },
                { x: width*6, y: height*6, width: width, height: height },
                { x: width*0, y: height*10, width: width, height: height },
                { x: width*2, y: height*11, width: width, height: height },
                { x: width*3, y: height*14, width: width, height: height },
            ],
        });

         xmedia.refs.push({
            tag: `${tag}.s`,
            cls: "VarSprite",
            variations: [
                { x: width*6, y: height*5, width: width, height: height },
                { x: width*2, y: height*10, width: width, height: height },
            ],
        });

         xmedia.refs.push({
            tag: `${tag}.t`,
            cls: "VarSprite",
            variations: [
                { x: width*0, y: height*7, width: width, height: height },
                { x: width*7, y: height*7, width: width, height: height },
            ],
        });

        return xmedia;

    }

    static wallTiles(baseId, baseTag) {
        let xtiles = [];
        for (const c of "abcdefghijklmnopqrst") {
            let id = `${baseId}${c}`;
            let tag = `${baseTag}.${c}`;
            xtiles.push(Templates.tile(id, tag))
        }
        return xtiles;
    }

    static xtile(tag, mediaTag, baseId) {
        if (!mediaTag) mediaTag = tag;
        return {
            cls: "Tile", 
            id: id, 
            tag: tag,           
            xsketch: { 
                cls: "Media", 
                tag: mediaTag,
            }
        };
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
            //console.log("cel: " + Fmt.ofmt(cel));
            anim.cels.push(cel);
        }
        return anim;
    }

    static tile(id, tag, mediaTag) {
        if (!mediaTag) mediaTag = tag;
        return {
            cls: "Tile", 
            id: id, 
            tag: tag,           
            xsketch: { 
                cls: "Media", 
                tag: mediaTag,
            }
        };
    }

}