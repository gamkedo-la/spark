import { Activity }             from "../js/base/activity.js";
import { ActivitySchedule }     from "../js/base/activitySchedule.js";
import { Fmt }                  from "../js/base/fmt.js";

Activity.register("test1");
Activity.register("test2");
Activity.register("test3");

let activityScheduleSuite = describe("an activity schedule", () => {
    // get activity
    let getActivityTests = [
        {spec: {}, tod: .5, xrslt: Activity.idle},
        {spec: {
            activities: [
                { weight: .25, activity: Activity.test1 },
                { weight: .5, activity: Activity.test2 },
                { weight: .25, activity: Activity.test3 },
            ]
        }, tod: .2, xrslt: Activity.test1},
        {spec: {
            activities: [
                { weight: .25, activity: Activity.test1 },
                { weight: .5, activity: Activity.test2 },
                { weight: .25, activity: Activity.test3 },
            ]
        }, tod: .4, xrslt: Activity.test2},
        {spec: {
            activities: [
                { weight: .25, activity: Activity.test1 },
                { weight: .5, activity: Activity.test2 },
                { weight: .25, activity: Activity.test3 },
            ]
        }, tod: .6, xrslt: Activity.test2},
        {spec: {
            activities: [
                { weight: .25, activity: Activity.test1 },
                { weight: .5, activity: Activity.test2 },
                { weight: .25, activity: Activity.test3 },
            ]
        }, tod: .8, xrslt: Activity.test3},
        {spec: {
            activities: [
                { weight: .25, activity: Activity.test1 },
                { weight: .5, activity: Activity.test2 },
                { weight: .25, activity: Activity.test3 },
            ]
        }, tod: 1, xrslt: Activity.test3},
    ]
    for (const test of getActivityTests) {
        it(`can check schedule: ${Fmt.ofmt(test.spec)} for activity at time ${test.tod}`, ()=>{
            let as = new ActivitySchedule(test.spec);
            const rslt = as.getActivity(test.tod);
            expect(rslt).toBe(test.xrslt);
        });
    }

});