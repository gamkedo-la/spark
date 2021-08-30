export { MoraleSystem };

import { System }               from "./base/system.js";
import { Morale }               from "./morale.js";
import { Atts }                 from "./base/atts.js";
import { Event }                from "./base/event.js";

/**
 * system to manage entity hunger
 */
class MoraleSystem extends System {
    cpre(spec) {
        spec.iterateTTL = spec.iterateTTL || 100;
        spec.fixedPredicate = spec.fixedPredicate || ((e) => e.morale);
        super.cpre(spec);
    }

    cpost(spec) {
        super.cpost(spec);
        this.eventQ = spec.eventQ || Atts.gameEventQ;
    }

    // METHODS -------------------------------------------------------------
    iterate(ctx, e) {
        // ignore entity if morale is at 0 or at max
        if (e.morale.value === Morale.max || e.morale.value === 0) {
            // clear event array
            e.morale.events.splice(0);
            return;
        }
        // process entity morale events...
        for (const evt of e.morale.events) {
            // FIXME: consider putting in a ttl for each like/dislike and checking it here before applying
            // does character like event?
            if (evt in e.morale.likes) {
                e.morale.value += e.morale.likes[evt];
                if (this.dbg) console.log(`character ${e} likes event ${evt} morale raised by ${e.morale.likes[evt]} to ${e.morale.value}`);
            } else if (evt in e.morale.dislikes) {
                if (this.dbg) console.log(`character ${e} dislikes event ${evt} morale raised by ${e.morale.likes[evt]} to ${e.morale.value}`);
            }
        }
        // handle min/max morale value
        if (e.morale.value >= Morale.max) {
            if (this.dbg) console.log(`character ${e} achieved max morale!`);
            e.morale.value = Morale.max;
            // push game event
            this.eventQ.push(new Event("npc.maxMorale", {actor: e}));
        } else if (e.morale.value <= 0) {
            if (this.dbg) console.log(`character ${e} achieved min morale!`);
            e.morale.value = 0;
        }

        e.morale.events.splice(0);
    }

}