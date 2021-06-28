import { OccupyScheme }             from "../js/actions/occupy.js";
import { FindScheme }               from "../js/actions/find.js";
import { MoveScheme }               from "../js/actions/move.js";
import { SleepAtBedScheme }         from "../js/actions/sleepAtBed.js";
import { WantBedScheme }            from "../js/actions/wantBed.js";
import { AiGoal }                   from "../js/base/ai/aiGoal.js";
import { AiPlanSystem }             from "../js/base/ai/aiPlanSystem.js";
import { Config }                   from "../js/base/config.js";
import { Condition }                from "../js/base/condition.js";
import { WorkAtStationScheme } from "../js/actions/workAtStation.js";
import { WantWorkstationScheme } from "../js/actions/wantWorkstation.js";
import { WakeScheme } from "../js/actions/wake.js";

AiGoal.register("sleep");
AiGoal.register("manage");
Condition.register("asleep");
Config.init()

let aiPlanSystemSuite = describe("AI Plan System", () => {
    let actor = { x: 10, y: 10, layer: 1, bedTag: "my.bed", workstationTag: "my.workstation", conditions: new Set(), }

    // buildPlans
    let buildPlansTests = [
        {desc: "null test", env: {}, actor: actor, schemes: [], goal: AiGoal.none, xplans: []},
        {desc: "sleep test", env: {}, actor: actor, schemes: [
            new WantBedScheme(),
            new FindScheme(),
            new MoveScheme(),
            new OccupyScheme(),
            new SleepAtBedScheme(),
        ], goal: AiGoal.sleep, xplans: [["WantBedPlan", "FindPlan", "MovePlan", "OccupyPlan", "SleepAtBedPlan"]]},

        {desc: "manage test", env: {}, actor: actor, schemes: [
            new WantWorkstationScheme(),
            new FindScheme(),
            new MoveScheme(),
            new OccupyScheme(),
            new WorkAtStationScheme(),
        ], goal: AiGoal.manage, xplans: [["WantWorkstationPlan", "FindPlan", "MovePlan", "OccupyPlan", "WorkAtStationPlan"]]},

        {desc: "manage sleep test", env: {}, actor: Object.assign({}, actor, {occupyId: 1, conditions: new Set([Condition.asleep])}), schemes: [
            new WakeScheme(),
            new WantWorkstationScheme(),
            new FindScheme(),
            new MoveScheme(),
            new OccupyScheme(),
            new WorkAtStationScheme(),
        ], goal: AiGoal.manage, xplans: [["WakePlan", "WantWorkstationPlan", "FindPlan", "MovePlan", "OccupyPlan", "WorkAtStationPlan"]]},

    ]
    for (const test of buildPlansTests) {
        it(test.desc, ()=>{
            const solutions = AiPlanSystem.buildPlans(test.env, test.actor, test.schemes, test.goal)
            const plans = solutions.map((solution) => solution.plans.map((plan) => plan.constructor.name));
            expect(plans).toEqual(test.xplans);
        })
    }

});