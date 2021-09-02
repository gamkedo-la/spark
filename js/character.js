export { Character };

import { Model }            from "./base/model.js";
import { Generator }        from "./base/generator.js";
import { Fmt }              from "./base/fmt.js";
import { Config }           from "./base/config.js";
import { Activity }         from "./base/activity.js";

class Character extends Model {

    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        // -- movement state
        this.heading = 0;
        this.speed = 0;
        this.maxSpeed = .1;
        this.ctrlId = spec.hasOwnProperty("ctrlId") ? spec.ctrlId : 1;
        // -- AI state
        this.ai = (spec.hasOwnProperty("xai")) ? Generator.generate(spec.xai) : undefined;
        //if (this.ai) console.log("char ai: " + Fmt.ofmt(this.ai));
        // -- interactRange
        this.interactRange = spec.interactRange || Config.tileSize*2;
        // -- actor
        this.actor = true;
        // -- activity schedule
        if (spec.xactivitySchedule) this.activitySchedule = Generator.generate(spec.xactivitySchedule);
        // -- actions
        this.actions = [];
        // -- hunger variables
        this.maxFedTTL = spec.maxFedTTL;        // max time from eating until character is "hungry"
        this.fedTTL = 0;                        // current timer since last meal
        //console.log(`spec: ${Fmt.ofmt(spec)} gives: ${Fmt.ofmt(this)}}`);
        // -- carrying
        this.carryTag = undefined;
        // -- morale
        this.morale = (spec.hasOwnProperty("xmorale")) ? Generator.generate(spec.xmorale) : undefined;
        console.log(`morale is: ${Fmt.ofmt(this.morale)}`)
        console.log(`hoverable: ${this.hoverable}`);
    }

    toString() {
        return Fmt.toString(this.cls, this.gid, this.tag, this.x, this.y);
    }

}