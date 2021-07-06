export { DaytimeSystem };

import { Atts }         from "./atts.js";
import { Mathf }        from "./math.js";
import { System }       from "./system.js";

class DaytimeSystem extends System {

    static dfltIterateTTL = 200;
    static dfltDayTTL = 60*60*1000;         // mseconds in a day (1 hr real time == 1 day game time)
    static dfltDawnPct = .25;
    static dfltDuskPct = .75;
    static dfltTwilightPct = .2;

    cpre(spec) {
        super.cpre(spec);
        spec.iterateTTL = spec.iterateTTL || DaytimeSystem.dfltIterateTTL;
        spec.fixedPredicate = spec.fixedPredicate || ((e) => false);
    }
    cpost(spec) {
        super.cpost(spec);
        this.getTimeScale = spec.getTimeScale || (() => 1);
        this.dayTTL = spec.dayTTL || DaytimeSystem.dfltDayTTL;
        let dawnPct = spec.dawnPct || DaytimeSystem.dfltDawnPct;
        let twilightPct = spec.twilightPct || DaytimeSystem.dfltTwilightPct;
        let duskPct = spec.duskPct || DaytimeSystem.dfltDuskPct;
        this.dawnTTL = this.dayTTL * dawnPct;
        this.dawnTwilightTTL = this.dayTTL * twilightPct + this.dawnTTL;
        this.duskTTL = this.dayTTL * duskPct;
        this.duskTwilightTTL = this.dayTTL * twilightPct + this.duskTTL;
        this.timeOfDay = 0;
        this.light = 0;
    }

    postiterate(ctx) {
        this.timeOfDay += this.deltaTime * this.getTimeScale();
        if (this.timeOfDay > this.dayTTL) this.timeOfDay = this.timeOfDay - this.dayTTL;
        if (this.timeOfDay < this.dawnTTL || this.timeOfDay > this.duskTwilightTTL) {
            this.light = 0;
        } else if (this.timeOfDay > this.dawnTwilightTTL && this.timeOfDay < this.duskTTL) {
            this.light = 1;
        } else if (this.timeOfDay < this.dawnTwilightTTL) {
            this.light = Mathf.lerp(this.dawnTTL, this.dawnTwilightTTL, 0, 1, this.timeOfDay);
        } else {
            this.light = Mathf.lerp(this.duskTTL, this.duskTwilightTTL, 1, 0, this.timeOfDay);
        }
        if (this.dbg) console.log(`timeofday: ${this.timeOfDay} light: ${this.light}`);
        // set global atts
        Atts.timeOfDay = this.timeOfDay/this.dayTTL;
        Atts.timeOfDaySec = this.timeOfDay;
        Atts.light = this.light;
        super.postiterate(ctx);
    }

}