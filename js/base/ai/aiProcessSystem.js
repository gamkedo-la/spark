export { AiProcessSystem };

import { System }               from "../system.js";
import { AiGoal }               from "./aiGoal.js";
import { AiSolution }           from "./aiSolution.js";

class AiProcessSystem extends System {
    // STATIC VARIABLES ----------------------------------------------------
    static dfltIterateTTL = 100;

    // CONSTRUCTOR ---------------------------------------------------------
    cpre(spec) {
        super.cpre(spec);
        spec.iterateTTL = spec.iterateTTL || AiProcessSystem.dfltIterateTTL;
        spec.fixedPredicate = spec.fixedPredicate || ((e) => e.cat === "Model" && e.ai);
    }
    cpost(spec) {
        super.cpost(spec);
        this.getenv = spec.getenv || (() => Atts);
    }

    processSolution(ctx, e, solution) {

        //console.log("process currentIndex: " + solution.currentIndex);
        while (solution.currentIndex < solution.processes.length) {
            let process = solution.processes[solution.currentIndex];

            // prepare
            if (!process.prepared && !process.prepare(e)) {
                // handle prep failure
                if (this.dbg) console.log(`solution: ${solution} failed during process preparation for: ${process}`);
                solution.status = AiSolution.failed;
                return;
            }
            process.prepared = true;
            // update
            if (!process.update(ctx)) {
                // update returns false if process is still needing work
                break;
            }
            // finalize
            if (!process.finalize()) {
                // handle process failure
                if (this.dbg) console.log(`solution: ${solution} failed during process finalization for: ${process}`);
                solution.status = AiSolution.failed;
                return;
            }
            // advance process index
            solution.currentIndex++;
        }

        // determine if solution is ready
        // -- are all processes completed?
        if (solution.currentIndex >= solution.processes.length) {
            solution.status = AiSolution.done;
        }

    }

    iterate(ctx, e) {
        // skip entities w/out a current solution
        if (!e.ai || !e.ai.currentSolution || e.ai.goalState !== AiGoal.gprocess) return;

        // process solution
        this.processSolution(ctx, e, e.ai.currentSolution);

        // if solution is still in ready state, more processing is required...
        if (e.ai.currentSolution.status === AiSolution.ready) return

        // otherwise... solution has completed (either failed or success)
        if (this.dbg) console.log(`AiProcessSystem: solution has completed with status: ${e.ai.currentSolution.status}`);
        e.ai.goalState = (e.ai.currentSolution.status === AiSolution.done) ? AiGoal.gok : AiGoal.gfail;
        e.ai.currentSolution = undefined;

    }
}