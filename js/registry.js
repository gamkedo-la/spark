export { SparkRegistry };

import { Character }        from "./character.js";
import { Door }             from "./door.js";
import { Stairs }           from "./stairs.js";
import { Tile }             from "./tile.js";
import { AiGoal }           from "./base/ai/aiGoal.js";
import { ModelState }       from "./base/modelState.js";
import { Activity }         from "./base/activity.js";
import { Bed }              from "./bed.js";
import { Chair }            from "./chair.js";
import { Projectile }       from "./projectile.js";
import { Level }            from "./lvl.js";
import { Atts }             from "./base/atts.js";
import { Store }            from "./base/store.js";
import { SparkBase }        from "./sparkBase.js";
import { SparkRelay }       from "./sparkRelay.js";
import { Condition }        from "./base/condition.js";
import { Workstation }      from "./workstation.js";
import { WakeScheme } from "./actions/wake.js";
import { WantWorkstationScheme } from "./actions/wantWorkstation.js";
import { WorkAtStationScheme } from "./actions/workAtStation.js";
import { WantBedScheme }    from "./actions/wantBed.js";
import { FindScheme }       from "./actions/find.js";
import { MoveScheme }       from "./actions/move.js";
import { OccupyScheme }     from "./actions/occupy.js";
import { SleepAtBedScheme } from "./actions/sleepAtBed.js";

class SparkRegistry {
    static init() {
        // -- register goals
        AiGoal.register("sleep");
        AiGoal.register("manage");
        AiGoal.register("eat");
        AiGoal.register("loiter");
        AiGoal.register("startWork");
        AiGoal.register("stopWork");
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
        Activity.register("wake");
        Activity.register("work");
        Activity.register("relax");
        Activity.register("sleep");
        // -- register conditions
        Condition.register("powered");
        Condition.register("sparked");
        Condition.register("waiting");
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
        registry.add(Workstation);
        // -- register schemes
        registry.add(WantBedScheme);
        registry.add(FindScheme);
        registry.add(MoveScheme);
        registry.add(OccupyScheme);
        registry.add(SleepAtBedScheme);
        registry.add(WakeScheme);
        registry.add(WantWorkstationScheme);
        registry.add(WorkAtStationScheme);
        // -- setup global atts
        Atts.sparkSources = new Store({getkey: (v) => v.gid});
    }
}