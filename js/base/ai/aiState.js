export { AiState };

import { Fmt }                  from "../fmt.js";
import { Generator }            from "../generator.js";
import { AiDirective }          from "./aiDirective.js";

class AiState {
    constructor(spec={}) {
        // -- prioritized directives
        this.directives = [];
        for (const xgoal of spec.xdirectives || []) {
            this.directives.push(new AiDirective(xgoal));
        }
        // -- schemes associated w/ actor
        this.schemes = [];
        for (const xscheme of spec.xschemes || []) {
            let spec = { cls: xscheme };
            let scheme = Generator.generate(spec);
            if (scheme) {
                this.schemes.push(scheme);
            } else {
                console.error("AiState failed to initialize scheme: " + xscheme);
            }
        }
        // -- current directive (set by AiDirectiveSystem)
        this.currentDirective;
        // -- prioritized goals (set by AiDirectiveSystem)
        this.goals;
        // -- current goal (set by AiGoalSystem)
        this.currentGoal;
        // -- current goal state (set by AiGoalSystem, AIGoalPlanSystem)
        this.goalState;
        // -- failed goals (set and managed by AiGoalSystem)j
        this.failedGoals = {};
        // -- pending AI solutions (set by AiPlanSystem)
        this.solutions;
        // -- current solution (set by AiPlanSystem)
        this.currentSolution;
    }
}