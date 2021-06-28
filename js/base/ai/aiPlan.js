export { AiPlan };

import { Fmt }              from "../fmt.js";
import { Atts }             from "../atts.js";
import { Base } from "../base.js";


// =========================================================================

class AiPlan {
    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        this.dbg = spec.hasOwnProperty("dbg") ? spec.dbg : false;
        this.getEntities = spec.getEntities || (() => Base.instance.entities);
        this.findOverlaps = spec.findOverlaps || Base.instance.findOverlaps;
        this.getQueryQ = spec.getQueryQ || (() => Atts.eQueryQ);
        this.getPathfinder = spec.getPathfinder || (() => Atts.pathfinder);
    }

    // PROPERTIES ----------------------------------------------------------
    get entities() {
        return this.getEntities();
    }

    // METHODS -------------------------------------------------------------
    prepare(actor, state) {
        this.actor = actor;
        this.state = Object.assign({}, state);
        return true;
    }

    update(ctx) {
        return true;
    }

    finalize() {
        return {
            cost: 0,
            utility: 0,
            actions: [],
        }
    }

    toString() {
        return Fmt.toString(this.constructor.name);
    }

}