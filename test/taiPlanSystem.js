import { AiGoal }                   from "../js/base/ai/aiGoal.js";
import { AiPlanSystem }             from "../js/base/ai/aiPlanSystem.js";
import { Config }                   from "../js/base/config.js";
import { Condition }                from "../js/base/condition.js";
import { SparkRegistry }            from "../js/registry.js";
import { Generator }                from "../js/base/generator.js";
import { Base }                     from "../js/base/base.js";

Config.init();
SparkRegistry.init();
SparkRegistry.setup(Base.instance.registry);

let aiPlanSystemSuite = describe("AI Plan System", () => {
    let actor = { x: 10, y: 10, layer: 1, bedTag: "my.bed", workstationTag: "my.workstation", conditions: new Set(), }

    // buildPlans
    let buildPlansTests = [
        {desc: "null test", env: {}, actor: actor, xschemes: [], goal: AiGoal.none, xplans: []},
        {desc: "sleep test", env: {}, actor: actor, goal: AiGoal.sleep, 
            xschemes: [ "WantBedScheme", "FindScheme", "MoveScheme", "OccupyScheme", "SleepAtBedScheme", ], 
            xplans: [["WantBedPlan", "FindPlan", "MovePlan", "OccupyPlan", "SleepAtBedPlan"]]},

        {desc: "manage test", env: {}, actor: actor, goal: AiGoal.manage, 
            xschemes: [ "WantWorkstationScheme", "FindScheme", "MoveScheme", "OccupyScheme", "WorkAtStationScheme", ], 
            xplans: [["WantWorkstationPlan", "FindPlan", "MovePlan", "OccupyPlan", "WorkAtStationPlan"]]},

        {desc: "manage sleep test", env: {}, actor: Object.assign({}, actor, {occupyId: 1, conditions: new Set([Condition.asleep])}), goal: AiGoal.manage, 
            xschemes: [ "LeaveScheme", "WantWorkstationScheme", "FindScheme", "MoveScheme", "OccupyScheme", "WorkAtStationScheme", ], 
            xplans: [["LeavePlan", "WantWorkstationPlan", "FindPlan", "MovePlan", "OccupyPlan", "WorkAtStationPlan"]]},

        {desc: "eat at chair test", env: {}, actor: Object.assign({}, actor, {conditions: new Set([Condition.hungry])}), goal: AiGoal.eat, 
            //xschemes: [ "WantStoveScheme", "WantChairScheme", "FindScheme", "MoveScheme", "OccupyScheme", "EatAtChairScheme", ], 
            xschemes: [ "WantStoveScheme", "WantChairScheme", "FindScheme", "MoveScheme", "GatherScheme", "OccupyScheme", "EatAtChairScheme" ], 
            xplans: [["WantStovePlan", "FindPlan", "MovePlan", "GatherPlan", "WantChairPlan", "FindPlan", "MovePlan", "OccupyPlan", "EatAtChairPlan"]]},


    ]
    for (const test of buildPlansTests) {
        it(test.desc, ()=>{
            const schemes = test.xschemes.map((v) => Generator.generate({cls: v}));
            const solutions = AiPlanSystem.buildPlans(test.env, test.actor, schemes, test.goal)
            const plans = solutions.map((solution) => solution.plans.map((plan) => plan.constructor.name));
            for (const plan of plans) {
                console.log(`plan is: ${plan}`);
            }
            expect(plans).toEqual(test.xplans);
        })
    }

});