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