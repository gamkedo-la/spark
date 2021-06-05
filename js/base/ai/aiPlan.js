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
        this.getQueryQ = spec.getQueryQ || (() => Atts.eQueryQ);
        this.getPathfinder = spec.getPathfinder || (() => Atts.pathfinder);
    }

    // METHODS -------------------------------------------------------------
    prepare(actor, state) {
        this.actor = actor;
        this.state = Object.assign({}, state);
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