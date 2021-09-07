export { ChatSystem };

import { System }               from "./base/system.js";
import { Config }               from "./base/config.js";
import { Vect }                 from "./base/vect.js";
import { Atts }                 from "./base/atts.js";
import { Util }                 from "./base/util.js";
import { Event }                from "./base/event.js";
import { Morale } from "./morale.js";

/**
 * system to manage npc chat interactions
 */
class ChatSystem extends System {
    static dfltInsults = [
        "No spark in you!",
        "Your hat is crumpled.",
        "I see you napping!" ,
        "That beard needs a comb." ,
        "Oil your door hinge!",
    ];
    static dfltNeutrals = [
        "May the gloom lift.",
        "Looks cloudy today.",
        "Hear tinkling bells!",
        "Where is my pot?",
        "Breezy at the shore.",
    ];
    static dfltCompliments = [
        "Your garden is green.",
        "Care for a plum?",
        "Smart boots there.",
        "Whiskers proper job.",
        "Spark you well.",
    ];

    cpre(spec) {
        spec.iterateTTL = spec.iterateTTL || 500;
        spec.fixedPredicate = spec.fixedPredicate || ((e) => e.cat === "Model" && e.chatable);
        super.cpre(spec);
    }

    cpost(spec) {
        super.cpost(spec);
        // -- chat Range: max distance that NPCs will attempt to chat
        this.chatRange = spec.chatRange || Config.tileSize * 8;
        // -- chat TTL: time between NPCs attempting to chat again (to anyone)
        this.chatTTL = spec.chatTTL || 3000;
        // -- target chat TTL: time between NPC talking to same NPC again
        // FIXME: need to adjust timers here...
        this.targetChatTTL = spec.targetChatTTL || 30000;
        // -- chat jitter: jitter in general chat TTL
        this.chatJitter = spec.chatJitter || .5;
        this.lastx = {};
        this.lasty = {};
        this.chatters = {};
        this.eventQ = spec.eventQ || Atts.gameEventQ;
    }

    chat(actor1, actor2) {
        // choose speaker
        let speaker = (Math.random() > .5) ? actor1 : actor2;
        let target = (speaker === actor1) ? actor2 : actor1;
        // choose chat message based on speaker morale
        // -- negative: 0->4
        // -- neutral:  4->7
        // -- positive: 7->1
        let morale = (speaker.morale) ? speaker.morale.value : 5;
        let kind = "chat.neutral";
        // min morale always results in insult
        if (morale === 0) {
            kind = "chat.insult";
        // max morale always results in compliment
        } else if (morale === Morale.max) {
            kind = "chat.compliment";
        // otherwise, take avg of morale and random choice
        } else {
            let choice = Math.random * Morale.max;
            choice = (choice + morale) * .5;
            if (choice < 4) {
                kind = "chat.insult";
            } else if (choice >= 7) {
                kind = "chat.compliment";
            }
        }
        let msg = "undefined";
        switch (kind) {
            case "chat.insult":
                msg = Util.choose(ChatSystem.dfltInsults);
                break;
            case "chat.neutral":
                msg = Util.choose(ChatSystem.dfltNeutrals);
                break;
            case "chat.compliment":
                msg = Util.choose(ChatSystem.dfltCompliments);
                break;
        }
        // push target morale event...
        if (target.morale) {
            target.morale.events.push(kind);
        }
        // now pick a chat based on kind of chat
        // drive game event
        this.eventQ.push(new Event("npc.chat", {actor: speaker, target: target, msg: msg, kind: kind}));
        // manage speaker chat state
        speaker.chatTTL = Util.jitter(this.chatTTL, this.chatJitter);
        let sameTTL = Util.jitter(this.targetChatTTL, this.chatJitter);
        speaker.chatTimers[target.gid] = sameTTL;
        // manage target chat state
        target.chatTTL = Util.jitter(this.chatTTL, this.chatJitter);
        target.chatTimers[speaker.gid] = sameTTL;
    }

    // METHODS -------------------------------------------------------------
    iterate(ctx, e) {
        // discovery
        if (!(e.gid in this.chatters)) {
            console.log(`found chatter: ${e}`);
            this.chatters[e.gid] = e;
        }

        // update chatter-specific timers
        if (e.chatTimers) {
            for (let [k,v] of Object.entries(e.chatTimers)) {
                v -= this.deltaTime;
                if (v <= 0) {
                    console.log(`${e} removing chat timer for gid:${k}`);
                    delete e.chatTimers[k];
                } else {
                    e.chatTimers[k] = v;
                }
            }
        }

        // check for general chat timer
        if (e.chatTTL) {
            e.chatTTL -= this.deltaTime;
            if (e.chatTTL <= 0) {
                console.log(`${e} removing general chat timer`);
                e.chatTTL = 0;
            } else {
                // chat blocked by timer
                return;
            }
        }

        // has chatter moved?
        if (this.lastx[e.gid] !== e.x || this.lasty[e.gid] !== e.y) {
            //console.log(`${e} moved: ${e.x},${e.y}`);
            this.lastx[e.gid] = e.x;
            this.lasty[e.gid] = e.y;
            // is chatter in range of any other chatter?
            for (const other of Object.values(this.chatters)) {
                // skip self...
                if (other.gid === e.gid) continue;
                // skip other if they are under a general chat timer
                if (other.chatTTL) continue;
                // FIXME: check for chatter within same area...
                // skip other if they are out of range
                //console.log(`check range ${Vect.dist(e, other)}`);
                if (Vect.dist(e, other) > this.chatRange) continue;
                // check chatter-specific timers
                if (e.chatTimers && e.chatTimers[other.gid]) continue;
                console.log(`chat viable`);

                // chat is viable with other...
                if (Math.random() > e.chatPct) {
                    // only one chat at a time...
                    console.log(`${e} starting chat w/ ${other}`);
                    this.chat(e, other);
                    return;
                }
            }
        }

    }

}