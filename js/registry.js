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
import { UxEditorView, UxLvlView }     from "./editorState.js";
import { UxGloom }          from "./uxGloom.js";
import { SparkFx, TestFx }  from "./sparkFx.js";
import { GatherScheme }     from "./actions/gather.js";
import { WantChairScheme }  from "./actions/wantChair.js";
import { WantStoveScheme }  from "./actions/wantStove.js";
import { EatAtChairScheme } from "./actions/eatAtChair.js";
import { Stove }            from "./stove.js";
import { LeaveScheme }      from "./actions/leave.js";
import { WantDirtyScheme }  from "./actions/wantDirty.js";
import { SweepAtDirtyScheme } from "./actions/sweepAtDirty.js";
import { Stock }            from "./stock.js";
import { WantStockScheme } from "./actions/wantStock.js";
import { RestockAtStockScheme } from "./actions/restockAtStock.js";
import { CloseAtStationScheme } from "./actions/closeAtStation.js";
import { OpenAtStationScheme } from "./actions/openAtStation.js";
import { Morale }           from "./morale.js";
import { Ramp }             from "./ramp.js";
import { MealService } from "./mealService.js";
import { Keg } from "./keg.js";
import { TakeBeerOrderScheme, TakeFoodOrderScheme } from "./actions/takeOrder.js";
import { WantBeerClearScheme, WantBeerOrderScheme, WantFoodClearScheme, WantFoodOrderScheme, WantServeBeerScheme, WantServeFoodScheme } from "./actions/wantOrder.js";
import { ClearBeerScheme, ClearFoodScheme, ServeBeerScheme, ServeFoodScheme } from "./actions/serve.js";
import { WantPrepBeerServiceScheme, WantPrepFoodServiceScheme } from "./actions/wantPrep.js";
import { Food } from "./food.js";
import { WantServiceScheme } from "./actions/wantService.js";
import { EatAtServiceScheme, WaitAtServiceScheme } from "./actions/eatAtService.js";
import { UxNpcInfo } from "./uxNpcInfo.js";
import { CharacterView, ModelView } from "./modelView.js";

class SparkRegistry {
    static init() {
        // -- register goals
        AiGoal.register("close");
        AiGoal.register("work");
        AiGoal.register("wait");
        AiGoal.register("sleep");
        AiGoal.register("eat");
        AiGoal.register("loiter");
        AiGoal.register("socialize");
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
        ModelState.register("seated_south");
        ModelState.register("seated_north");
        ModelState.register("seated_west");
        ModelState.register("seated_east");
        ModelState.register("cast");
        ModelState.register("cast_south");
        ModelState.register("cast_north");
        ModelState.register("cast_west");
        ModelState.register("cast_east");
        ModelState.register("eating");
        ModelState.register("eating_south");
        ModelState.register("eating_north");
        ModelState.register("eating_west");
        ModelState.register("eating_east");
        ModelState.register("enlightenedWalk");
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
        Condition.register("hungry");
        Condition.register("eating");
        Condition.register("seated");
        Condition.register("dirty");
        Condition.register("restock");
        Condition.register("sweeping");
        Condition.register("closed");
        Condition.register("enlightened");
    }
    static setup(registry) {
        // -- register view classes
        registry.add(UxGloom);
        registry.add(UxEditorView);
        registry.add(UxLvlView);
        registry.add(UxNpcInfo);
        registry.add(ModelView);
        registry.add(CharacterView);
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
        registry.add(Stock);
        registry.add(Workstation);
        registry.add(TestFx);
        registry.add(SparkFx);
        registry.add(Stove);
        registry.add(Keg);
        registry.add(Morale);
        registry.add(Ramp);
        registry.add(MealService);
        registry.add(Food);
        // -- register schemes
        registry.add(ClearBeerScheme);
        registry.add(ClearFoodScheme);
        registry.add(CloseAtStationScheme);
        registry.add(EatAtChairScheme);
        registry.add(EatAtServiceScheme);
        registry.add(FindScheme);
        registry.add(GatherScheme);
        registry.add(LeaveScheme);
        registry.add(MoveScheme);
        registry.add(OccupyScheme);
        registry.add(OpenAtStationScheme);
        registry.add(RestockAtStockScheme);
        registry.add(ServeBeerScheme);
        registry.add(ServeFoodScheme);
        registry.add(SleepAtBedScheme);
        registry.add(SweepAtDirtyScheme);
        registry.add(TakeBeerOrderScheme);
        registry.add(TakeFoodOrderScheme);
        registry.add(WaitAtServiceScheme);
        registry.add(WakeScheme);
        registry.add(WantBedScheme);
        registry.add(WantBeerClearScheme);
        registry.add(WantBeerOrderScheme);
        registry.add(WantChairScheme);
        registry.add(WantDirtyScheme);
        registry.add(WantFoodClearScheme);
        registry.add(WantFoodOrderScheme);
        registry.add(WantPrepBeerServiceScheme);
        registry.add(WantPrepFoodServiceScheme);
        registry.add(WantServeBeerScheme);
        registry.add(WantServeFoodScheme);
        registry.add(WantServiceScheme);
        registry.add(WantStockScheme);
        registry.add(WantStoveScheme);
        registry.add(WantWorkstationScheme);
        registry.add(WorkAtStationScheme);
        // -- setup global atts
        Atts.sparkSources = new Store({getkey: (v) => v.gid});
    }
}