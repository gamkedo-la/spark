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
import { Projectile, SparkProjectile }       from "./projectile.js";
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
import { LeaveWorkstationScheme } from "./actions/leaveWorkstation.js";
import { UxEditorView } from "./editorState.js";
import { UxGloom } from "./uxGloom.js";
import { SparkFx, TestFx } from "./sparkFx.js";

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
        ModelState.register("sparked_south");
        ModelState.register("sparked_north");
        ModelState.register("sparked_west");
        ModelState.register("sparked_east");
        ModelState.register("open");
        ModelState.register("close");
        ModelState.register("sleep");
        ModelState.register("sleep_south");
        ModelState.register("occupied");
        ModelState.register("seated");
        ModelState.register("cast");
        ModelState.register("cast_south");
        ModelState.register("cast_north");
        ModelState.register("cast_west");
        ModelState.register("cast_east");
        // -- register activities
        Activity.register("wake");
        Activity.register("work");
        Activity.register("relax");
        Activity.register("sleep");
        // -- register conditions
        Condition.register("powered");
        Condition.register("sparked");
        Condition.register("waiting");
        Condition.register("cast");
    }
    static setup(registry) {
        // -- register view classes
        registry.add(UxGloom);
        registry.add(UxEditorView);
        // -- register generator classes
        registry.add(Tile);
        registry.add(Character);
        registry.add(Door);
        registry.add(Chair);
        registry.add(Stairs);
        registry.add(Bed);
        registry.add(Projectile);
        registry.add(SparkProjectile);
        registry.add(Level);
        registry.add(SparkBase);
        registry.add(SparkRelay);
        registry.add(Workstation);
        registry.add(TestFx);
        registry.add(SparkFx);
        // -- register schemes
        registry.add(WantBedScheme);
        registry.add(FindScheme);
        registry.add(MoveScheme);
        registry.add(OccupyScheme);
        registry.add(SleepAtBedScheme);
        registry.add(WakeScheme);
        registry.add(WantWorkstationScheme);
        registry.add(WorkAtStationScheme);
        registry.add(LeaveWorkstationScheme);
        // -- setup global atts
        Atts.sparkSources = new Store({getkey: (v) => v.gid});
    }
}