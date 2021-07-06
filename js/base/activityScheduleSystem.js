export { ActivityScheduleSystem };

import { Activity }     from "./activity.js";
import { Atts }         from "./atts.js";
import { System }       from "./system.js";

/** ========================================================================
 * ActivityScheduleSystem - manages the current planned activity for entities that have an assigned schedule
 */
class ActivityScheduleSystem extends System {
    // STATIC VARIABLES ----------------------------------------------------
    static dfltIterateTTL = 1000;

    // CONSTRUCTOR ---------------------------------------------------------
    cpre(spec) {
        super.cpre(spec);
        spec.iterateTTL = spec.iterateTTL || ActivityScheduleSystem.dfltIterateTTL;
        spec.fixedPredicate = spec.fixedPredicate || ((e) => e.cat === "Model" && !e.passive);
    }
    cpost(spec) {
        super.cpost(spec);
        this.getTimeOfDay = spec.getTimeOfDay || Atts.getter("timeOfDay");
    }

    // METHODS -------------------------------------------------------------
    iterate(ctx, e) {
        // only match entities that have an assigned schedule
        if (!e.activitySchedule) return;
        // check for assigned activity based on time of day
        let timeOfDay = this.getTimeOfDay();
        let activity = e.activitySchedule.getActivity(timeOfDay);
        // update current activity if required
        if (e.currentActivity !== activity) {
            if (this.dbg) console.log(`assigning ${e} activity ${Activity.toString(activity)}`);
            e.currentActivity = activity;
        }
    }

}