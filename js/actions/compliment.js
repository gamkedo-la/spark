export { ComplimentAction };

import { Action } from "../base/action.js";
import { Atts } from "../base/atts.js";
import { Event } from "../base/event.js";

class ComplimentAction extends Action {
    constructor(spec={}) {
        super(spec);
        this.target = spec.target;
        this.msg = spec.msg;
        this.eventQ = spec.eventQ || Atts.gameEventQ;
    }
    start(actor) {
        //console.log(`eat action actor: ${actor} target: ${this.target}}`);
        this.actor = actor;
        this.eventQ.push(new Event("npc.chat", {actor: actor, target: this.target, msg: this.msg, kind: "chat.compliment"}));
    }
    update(ctx) {
        this.done = true;
        return this.done;
    }
}