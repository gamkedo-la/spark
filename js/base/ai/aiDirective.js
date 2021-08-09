export { AiDirective };

import { Fmt }                      from "../fmt.js";
import { Generator }                from "../generator.js";
import { AiGoal }                   from "./aiGoal.js";

class AiDirective {
    // STATIC VARIABLES ----------------------------------------------------
    static _id = 1;

    // STATIC PROPERTIES ---------------------------------------------------
    static get gid() {
        return this._id++;
    }
    static set gid(v) {
        if (v >= this._id) this.id = v+1;
    }

    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        // -- gid
        if (spec.hasOwnProperty("gid")) {
            this.gid = spec.gid;
            AiDirective.gid = this.gid;
        } else {
            this.gid = AiDirective.gid;
        }
        // -- tag
        this.tag = spec.tag || `${this.cls}.${this.gid}`;
        // -- influence
        this.influence = spec.hasOwnProperty("xinfluence") ? Generator.generate(spec.xinfluence) : new AiInfluence({dfltScore: 1});
        // -- prioritized goals
        this.goals = [];
        for (const xgoal of spec.xgoals || []) {
            this.goals.push(new AiGoal(xgoal));
        }
    }

    // METHODS -------------------------------------------------------------
    toString() {
        return Fmt.toString(this.constructor.name, this.tag);
    }
}