export { SparkRegistry };

import { Character }        from "./character.js";
import { Door }             from "./door.js";
import { Stairs }           from "./stairs.js";
import { Tile }             from "./tile.js";
import { AiGoal }           from "./base/ai/aiGoal.js";
import { ModelState }       from "./base/modelState.js";
import { Activity }         from "./base/activity.js";
import { SleepBedScheme }   from "./actions/sleepBed.js";
import { FindBedScheme }    from "./actions/findbed.js";
import { MoveScheme }       from "./actions/move.js";
import { Bed }              from "./bed.js";
import { WakeFromBedScheme } from "./actions/wakeFromBed.js";
import { Chair }            from "./chair.js";
import { Projectile }       from "./projectile.js";
import { Level }            from "./lvl.js";
import { Atts }             from "./base/atts.js";
import { Store }            from "./base/store.js";
import { SparkBase }        from "./sparkBase.js";
import { SparkRelay }       from "./sparkRelay.js";
import { Condition }        from "./base/condition.js";

class SparkRegistry {
    static init() {
        // -- register goals
        AiGoal.register("sleep");
        AiGoal.register("manage");
        // -- register model states
        ModelState.register("powered");
        ModelState.register("sparked");
        ModelState.register("open");
        ModelState.register("close");
        ModelState.register("sleep");
        ModelState.register("sleep_south");
        ModelState.register("occupied");
        ModelState.register("seated");
        // -- register activities
        Activity.register("sleep");
        Activity.register("work");
        // -- register conditions
        Condition.register("powered");
        Condition.register("sparked");
    }
    static setup(registry) {
        // -- register generator classes
        registry.add(Tile);
        registry.add(Character);
        registry.add(Door);
        registry.add(Chair);
        registry.add(Stairs);
        registry.add(Bed);
        registry.add(Projectile);
        registry.add(Level);
        registry.add(SparkBase);
        registry.add(SparkRelay);
        // -- register schemes
        registry.add(SleepBedScheme);
        registry.add(FindBedScheme);
        registry.add(MoveScheme);
        registry.add(WakeFromBedScheme);
        // -- setup global atts
        Atts.sparkSources = new Store({getkey: (v) => v.gid});
    }
}