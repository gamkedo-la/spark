export { Base };

import { Fmt }              from "./fmt.js";
import { Util }             from "./util.js";
import { MediaLoader }      from "./mediaLoader.js";
import { ImageLoader }      from "./imageLoader.js";
import { SheetLoader }      from "./sheetLoader.js";
import { AudioLoader }      from "./audioLoader.js";
import { Store }            from "./store.js";
import { Assets }           from "./assets.js";
import { Generator }        from "./generator.js";
import { Media }            from "./media.js";
import { Sketch }           from "./sketch.js";
import { Sprite }           from "./sprite.js";
import { VarSprite }        from "./varSprite.js";
import { Text }             from "./text.js";
import { StretchSprite }    from "./stretchSprite.js";
import { Shape }            from "./shape.js";
import { Rect }             from "./rect.js";
import { Animation }        from "./animation.js";
import { Animator }         from "./animator.js";
import { Audio }            from "./audio.js";
import { Fitter, FitToParent } from "./fitter.js";
import { SystemMgr }        from "./systemMgr.js";
import { Keys }             from "./keys.js";
import { MouseSystem }      from "./mouse.js";
import { CtrlSystem }       from "./ctrlSystem.js";
import { MoveSystem }       from "./moveSystem.js";
import { StateSystem }      from "./stateSystem.js";
import { UxView }           from "./uxView.js";
import { UxCanvas }         from "./uxCanvas.js";
import { UxPanel }          from "./uxPanel.js";
import { UxButton }         from "./uxButton.js";
import { UxText }           from "./uxText.js";
import { UxInput }          from "./uxInput.js";
import { UxToggle }         from "./uxToggle.js";
import { Bindings }         from "./bindings.js";
import { Config }           from "./config.js";
import { Collider, ColliderSet, RingCollider } from "./collider.js";
import { StateMgr }         from "./stateMgr.js";
import { ActionSystem }     from "./actionSystem.js";
import { AreaSystem }       from "./areaSystem.js";
import { Area }             from "./area.js";
import { CollisionSystem }  from "./collisionSystem.js";
import { PathfindingSystem } from "./pathfindingSystem.js";
import { DaytimeSystem }    from "./daytimeSystem.js";
import { UxDaylightFilter } from "./uxDaylightFilter.js";
import { AiDirectiveSystem } from "./ai/aiDirectiveSystem.js";
import { AiComboInfluence, AiEnvInfluence, AiGzoInfluence, AiInfluence } from "./ai/aiInfluence.js";
import { AiGoal }           from "./ai/aiGoal.js";
import { AiDirective }      from "./ai/aiDirective.js";
import { AiState }          from "./ai/aiState.js";
import { ActivitySchedule } from "./activitySchedule.js";
import { ActivityScheduleSystem } from "./activityScheduleSystem.js";
import { AiGoalSystem }     from "./ai/aiGoalSystem.js";
import { Atts }             from "./atts.js";
import { EQuerySystem }     from "./eQuerySystem.js";
import { AiPlanSystem }     from "./ai/aiPlanSystem.js";
import { AiProcessSystem }  from "./ai/aiProcessSystem.js";
import { ModelState }       from "./modelState.js";
import { Condition }        from "./condition.js";
import { EventSystem }      from "./eventSystem.js";
import { LayeredViewMgr }   from "./layeredViewMgr.js";
import { ViewMgr }          from "./viewMgr.js";
import { AudioMgr }         from "./audioMgr.js";
import { SyncAnimation }    from "./syncAnimation.js";
import { UxCanvas2 }        from "./uxCanvas2.js";
import { UxSlider }         from "./uxSlider.js";
import { UxFader }          from "./uxFader.js";

class Base {

    // STATIC VARIABLES ----------------------------------------------------
    static _instance;
    static _inited = false;

    // STATIC PROPERTIES ---------------------------------------------------
    static get instance() {
        if (!this._instance) this._instance = new this();
        return this._instance;
    }

    // STATIC METHODS ------------------------------------------------------
    static init(spec={}) {
        if (this._inited) return;
        this._inited = true;
        // -- config - project wide configuration
        Config.init(spec.config);
        // -- enums
        ModelState.init([
            "none",
            "idle",
            "idle_north",
            "idle_south",
            "idle_west",
            "idle_east",
            "walk",
            "walk_north",
            "walk_south",
            "walk_west",
            "walk_east",
        ]);
        Condition.init([
            "occupied",
            "seated",
            "asleep",
            "opened",
        ]);
        // -- global atts
        Atts.init();
        // -- global query queue
        Atts.eQueryQ = [];
        // -- global action queue
        Atts.gameEventQ = [];
    }

    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        let self = this;
        if (!Base._instance) {
            Base._instance=this;
        } else {
            self = Base._instance;
        }
        // -- bind functions
        Util.bind(self, "findOverlaps", "find", "findFirst");
        // -- audio manager - manages audio contexts for playing game sounds and music
        self.audioMgr = new AudioMgr();
        // -- registry - mapping of class names to actual class implementation
        self.registry = new Store({getkey: (v)=>v.prototype.constructor.name});
        // -- media - mapping of tag to loaded media specifications
        self.media = new Store({getkey: (v) => v.tag});
        // -- mediaLoader - provides functionality to load media specifications
        self.mediaLoader = new MediaLoader({
            dbg: Config.dbg.MediaLoader,
            media: self.media,
            refs: spec.media || [],
            loaders: {
                "Image": new ImageLoader({scale:Config.scale}),
                "Sheet": new SheetLoader({scale:Config.scale}),
                "Audio": new AudioLoader(),
            }
        });
        // -- assets - mapping of tag or id to asset specifications
        self.assets = new Assets({
            refs: spec.assets || [],
        });
        // -- generator - allows for creation of game objects from specifications
        self.generator = new Generator({registry: self.registry});
        // -- state manager - handles master game state
        self.stateMgr = new StateMgr();
        // -- systemMgr - the global system manager
        self.systemMgr = new SystemMgr({getStore: () => self.entities});
        // -- key bindings
        self.xbindings = spec.xbindings;
        return self;
    }

    // METHODS -------------------------------------------------------------
    setup() {
        // ---- Media reference
        this.registry.add(Media);
        // ---- Sketches
        this.registry.add(Text);
        this.registry.add(Sketch);
        this.registry.add(Sprite);
        this.registry.add(VarSprite);
        this.registry.add(StretchSprite);
        this.registry.add(Rect);
        this.registry.add(Shape);
        this.registry.add(Animation);
        this.registry.add(SyncAnimation);
        this.registry.add(Animator);
        this.registry.add(Audio);
        // ---- View Managers
        this.registry.add(ViewMgr);
        this.registry.add(LayeredViewMgr);
        // ---- Views
        this.registry.add(UxView);
        this.registry.add(UxCanvas);
        this.registry.add(UxCanvas2);
        this.registry.add(UxFader);
        this.registry.add(UxPanel);
        this.registry.add(UxButton);
        this.registry.add(UxSlider);
        this.registry.add(UxText);
        this.registry.add(UxInput);
        this.registry.add(UxDaylightFilter);
        this.registry.add(UxToggle);
        // ---- Fitters
        this.registry.add(Fitter);
        this.registry.add(FitToParent);
        // ---- Collider
        this.registry.add(Collider);
        this.registry.add(RingCollider);
        this.registry.add(ColliderSet);
        // ---- Areas
        this.registry.add(Area);
        // ---- AI
        this.registry.add(AiGoal);
        this.registry.add(AiState);
        this.registry.add(AiDirective);
        this.registry.add(AiInfluence);
        this.registry.add(AiGzoInfluence);
        this.registry.add(AiEnvInfluence);
        this.registry.add(AiComboInfluence);
        this.registry.add(ActivitySchedule);
        // ---- keyboard handler
        Keys.init({
            dbg: Config.dbg.Keys,
        });
        // ---- Systems
        this.systemMgr.adopt(new MouseSystem({ iterateTTL: 50, dbg: Config.dbg.MouseSystem }));
        this.systemMgr.adopt(new CtrlSystem({ bindings: new Bindings(this.xbindings), dbg: Config.dbg.CtrlSystem, }));
        this.systemMgr.adopt(new MoveSystem({ findOverlaps: this.findOverlaps, dbg: Config.dbg.MoveSystem, }));
        this.systemMgr.adopt(new CollisionSystem({ findOverlaps: this.findOverlaps, dbg: Config.dbg.CollisionSystem, }));
        // -- entity actions
        this.systemMgr.adopt(new ActionSystem({ dbg: Config.dbg.ActionSystem }));
        // -- state actions
        this.systemMgr.adopt(new ActionSystem({ dbg: Config.dbg.ActionSystem, ignorePause: true, fixedPredicate: ((e) => (e.cat === "State")) }));
        this.systemMgr.adopt(new AreaSystem({ dbg: Config.dbg.AreaSystem }));
        this.systemMgr.adopt(new PathfindingSystem({ getgrid: (() => this.grid), dbg: Config.dbg.PathfindingSystem, }));
        this.systemMgr.adopt(new DaytimeSystem({ getTimeScale: () => 30, dbg: Config.dbg.DaytimeSystem, }));
        this.systemMgr.adopt(new ActivityScheduleSystem({ dbg: Config.dbg.ActivityScheduleSystem }));
        this.systemMgr.adopt(new StateSystem({ dbg: Config.dbg.StateSystem }));
        this.systemMgr.adopt(new EQuerySystem({ eQueryQ: Atts.eQueryQ, dbg: Config.dbg.EQuerySystem, }));
        this.systemMgr.adopt(new EventSystem({ dbg: Config.dbg.EventSystem, }));
        this.systemMgr.adopt(new AiDirectiveSystem({ dbg: Config.dbg.AiDirectiveSystem, }));
        this.systemMgr.adopt(new AiGoalSystem({ dbg: Config.dbg.AiGoalSystem, }));
        this.systemMgr.adopt(new AiPlanSystem({ dbg: Config.dbg.AiPlanSystem, }));
        this.systemMgr.adopt(new AiProcessSystem({ dbg: Config.dbg.AiProcessSystem, }));
    }

    // PROPERTIES ----------------------------------------------------------
    get entities() {
        if (this.stateMgr.current) return this.stateMgr.current.entities;
        return undefined;
    }
    get viewMgr() {
        if (this.stateMgr.current) return this.stateMgr.current.viewMgr;
        return undefined;
    }
    get state() {
        return this.stateMgr.current;
    }
    get grid() {
        return (this.state) ? this.state.grid : undefined;
    }

    // METHODS -------------------------------------------------------------
    findFirst(filter=(v) => true) {
        if (this.state) return this.state.findFirst(filter);
    }
    *find(filter=(v) => true) {
        if (this.state) yield *this.state.find(filter);
    }
    *findOverlaps(bounds, filter=(v) => true) {
        if (this.state) yield *this.state.findOverlaps(bounds, filter);
    }


}