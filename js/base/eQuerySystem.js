export { EQuerySystem };
import { System } from "./system.js";

class EQuerySystem extends System {
    // STATIC VARIABLES ----------------------------------------------------
    static dfltIterateTTL = 0;

    // CONSTRUCTOR ---------------------------------------------------------
    cpre(spec) {
        super.cpre(spec);
        spec.iterateTTL = (spec.hasOwnProperty("iterateTTL")) ? spec.iterateTTL : EQuerySystem.dfltIterateTTL;
        spec.fixedPredicate = spec.fixedPredicate || ((e) => e.cat === "Model" && !e.passive);
    }
    cpost(spec) {
        super.cpost(spec);

        // -- eQueryQ: the entity query queue tracks new queries that are awaiting processing by the query system
        this.eQueryQ = spec.eQueryQ || [];
        // == activeQueries: tracks active queries for each iteration
        this.activeQueries = [];
    }

    // METHODS -------------------------------------------------------------
    prepare(ctx) {
        //console.log("equery prepare");
        // check for pending queries
        this.activeQueries = Array.from(this.eQueryQ);
        this.eQueryQ.splice(0);
    }

    iterate(ctx, e) {
        // skip iteration if no pending queries...
        if (!this.activeQueries.length) return;
        for (const query of this.activeQueries) {
            if (query.predicate(e)) query.matches.push(e);
        }
    }

    finalize(ctx) {
        //console.log("equery finalize activeQueries: " + Fmt.ofmt(this.activeQueries));
        for (const query of this.activeQueries) {
            query.done = true;
            if (query.cb) query.cb();
        }
    }

}
