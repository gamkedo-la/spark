import { FindBedScheme } from "../js/actions/findbed.js";
import { MoveScheme } from "../js/actions/move.js";
import { SleepBedScheme } from "../js/actions/sleepBed.js";
import { AiGoal } from "../js/base/ai/aiGoal.js";
import { AiPlanSystem } from "../js/base/ai/aiPlanSystem.js";

AiGoal.register("sleep");

let aiPlanSystemSuite = describe("AI Plan System", () => {

    // buildPlans
    let buildPlansTests = [
        {desc: "null test", env: {}, actor: {}, schemes: [], goal: AiGoal.none, xplans: []},
        {desc: "sleep test", env: {}, actor: { bedId: 1 }, schemes: [
            new MoveScheme(),
            new SleepBedScheme(),
            new FindBedScheme(),
        ], goal: AiGoal.sleep, xplans: [["FindBedPlan", "MovePlan", "SleepBedPlan"]]},
    ]
    for (const test of buildPlansTests) {
        it(test.desc, ()=>{
            const solutions = AiPlanSystem.buildPlans(test.env, test.actor, test.schemes, test.goal)
            const plans = solutions.map((solution) => solution.plans.map((plan) => plan.constructor.name));
            expect(plans).toEqual(test.xplans);
        })
    }

});