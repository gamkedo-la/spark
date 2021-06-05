export { ActivitySchedule };

import { Activity }                 from "./activity.js";
import { Fmt }                      from "./fmt.js";

// =========================================================================
class ActivitySchedule {
    // STATIC VARIABLES ----------------------------------------------------
    static dfltActivity = Activity.idle;

    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        // -- activities [ { weight: xxx, activity: yyy }, ... ]
        this.activities = [];
        if (!spec.activities) {
            this.activities.push({time: 0, activity: ActivitySchedule.dfltActivity});
        } else {
            // add up total weights
            let weights = 0;
            for (const activity of spec.activities) {
                weights += (activity.weight || 0);
            }
            let time = 0;
            for (const activity of spec.activities) {
                let timedActivity = {
                    time: time,
                    activity: activity.activity,
                }
                this.activities.push(timedActivity);
                time += ((activity.weight || 0)/weights);
            }
        }
    }

    // METHODS -------------------------------------------------------------
    getActivity(timeOfDay) {
        let bestActivity = ActivitySchedule.dfltActivity;
        for (const activity of this.activities) {
            if (activity.time <= timeOfDay) {
                bestActivity = activity.activity;
            } else {
                break;
            }
        }
        return bestActivity;
    }

    toString() {
        return Fmt.toString(this.constructor.name, this.activities);
    }

}