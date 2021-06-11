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

class SparkRegistry {
    static init() {
        // -- register goals
        AiGoal.register("sleep");
        // -- register model states
        ModelState.register("open");
        ModelState.register("close");
        ModelState.register("sleep");
        ModelState.register("occupied");
        // -- register activities
        Activity.register("sleep");
    }
    static setup(registry) {
        // -- register generator classes
        registry.add(Tile);
        registry.add(Character);
        registry.add(Door);
        registry.add(Chair);
        registry.add(Stairs);
        registry.add(Bed);
        // -- register schemes
        registry.add(SleepBedScheme);
        registry.add(FindBedScheme);
        registry.add(MoveScheme);
        registry.add(WakeFromBedScheme);
    }
}