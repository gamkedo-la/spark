export { AiGoal }

import { Fmt } from "../fmt.js";
import { Generator }                from "../generator.js";
import { AiInfluence }              from "./aiInfluence.js";

class AiGoal {
    // STATIC VARIABLES ----------------------------------------------------
    // -- reference goals
    static none =           0;
    static idle =           1;
    // -- id: running id for newly defined goals
    static _id = 2;
    // -- id to string map
    static idMap = {
        0: "none",
        1: "idle",
    };
    // -- goal states
    static gpending =       0;
    static gprocess =       1;
    static gok =            2;
    static gfail =          3;

    // STATIC METHODS ------------------------------------------------------
    static register(tag) {
        if (tag in this) {
            return this[tag];
        }
        let id = this._id++;
        this.idMap[id] = tag;
        this[tag] = id;
        return id;
    }
    static toString(id) {
        return this.idMap[id];
    }

    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        // -- goal
        this.goal = spec.hasOwnProperty("goal") ? spec.goal : AiGoal.none;
        console.log("this.goal: " + this.goal + " spec.goal: " + spec.goal);
        // -- influence
        this.influence = spec.hasOwnProperty("xinfluence") ? Generator.generate(spec.xinfluence) : new AiInfluence({dfltScore: 1});
    }

    // METHODS -------------------------------------------------------------
    toString() {
        return Fmt.toString(this.constructor.name, AiGoal.toString(this.goal));
    }
}