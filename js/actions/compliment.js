export { ComplimentAction };

import { Action } from "../base/action.js";
import { Atts } from "../base/atts.js";
import { Base } from "../base/base.js";
import { Event } from "../base/event.js";
import { Hierarchy } from "../base/hierarchy.js";

class ComplimentAction extends Action {
    constructor(spec={}) {
        super(spec);
        this.target = spec.target;
        this.msg = spec.msg;
        this.chatSys = spec.chatSys || Hierarchy.find(Base.instance.systemMgr, (o => o.cls === "ChatSystem"));
    }
    start(actor) {
        this.actor = actor;
        this.chatSys.doChat(actor, this.target, this.msg, "chat.compliment");
    }
    update(ctx) {
        this.done = true;
        return this.done;
    }
}
