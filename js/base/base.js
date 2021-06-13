export { Base };

import { Fmt }              from "./fmt.js";
import { Util }             from "./util.js";
import { MediaLoader }      from "./mediaLoader.js";
import { ImageLoader }      from "./imageLoader.js";
import { SheetLoader }      from "./sheetLoader.js";
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
import { Bindings }         from "./bindings.js";
import { Config }           from "./config.js";
import { Collider, ColliderSet } from "./collider.js";
import { StateMgr }         from "./stateMgr.js";
import { PathFollowSystem } from "./pathFollowSystem.js";
import { ActionSystem }     from "./actionSystem.js";
import { AreaSystem }       from "./areaSystem.js";
import { Area }             from "./area.js";
import { CollisionSystem }  from "./collisionSystem.js";
import { PathfindingSystem } from "./pathfindingSystem.js";
import { DaytimeSystem } from "./daytimeSystem.js";
import { UxDaylightFilter } from "./uxDaylightFilter.js";
import { AiDirectiveSystem } from "./ai/aiDirectiveSystem.js";
import { AiComboInfluence, AiEnvInfluence, AiGzoInfluence } from "./ai/aiInfluence.js";
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
import { ModelState } from "./modelState.js";
import { Condition } from "./condition.js";

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
        // -- registry - mapping of class names to actual class implementation
        self.registry = new Store({getkey: (v)=>v.prototype.constructor.name});
        // -- media - mapping of tag to loaded media specifications
        self.media = new Store({getkey: (v) => v.tag});
        // -- mediaLoader - provides functionality to load media specifications
        self.mediaLoader = new MediaLoader({
            //dbg: true,
            media: self.media,
            refs: spec.media || [],
            loaders: {
                "Image": new ImageLoader({scale:Config.scale}),
                "Sheet": new SheetLoader({scale:Config.scale}),
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
        this.registry.add(Animator);
        // ---- Views
        this.registry.add(UxView);
        this.registry.add(UxCanvas);
        this.registry.add(UxPanel);
        this.registry.add(UxButton);
        this.registry.add(UxText);
        this.registry.add(UxInput);
        this.registry.add(UxDaylightFilter);
        // ---- Fitters
        this.registry.add(Fitter);
        this.registry.add(FitToParent);
        // ---- Collider
        this.registry.add(Collider);
        this.registry.add(ColliderSet);
        // ---- Areas
        this.registry.add(Area);
        // ---- AI
        this.registry.add(AiGoal);
        this.registry.add(AiState);
        this.registry.add(AiDirective);
        this.registry.add(AiGzoInfluence);
        this.registry.add(AiEnvInfluence);
        this.registry.add(AiComboInfluence);
        this.registry.add(ActivitySchedule);
        // ---- keyboard handler
        Keys.init({
            dbg: false
        });
        // ---- mouse system
        this.systemMgr.adopt(new MouseSystem({iterateTTL: 50, dbg: false}));
        // ---- controller system
        this.systemMgr.adopt(new CtrlSystem({
            bindings: new Bindings(this.xbindings),
            dbg: false,
        }));
        // ---- movement system
        this.systemMgr.adopt(new MoveSystem({
            dbg: false,
            findOverlaps: this.findOverlaps,
        }));
        // ---- collision system
        this.systemMgr.adopt(new CollisionSystem({
            dbg: false,
            findOverlaps: this.findOverlaps,
        }));
        this.systemMgr.adopt(new PathFollowSystem({
            dbg: true,
        }));
        // ---- action system
        this.systemMgr.adopt(new ActionSystem({
            dbg: true,
        }));
        // ---- area system
        this.systemMgr.adopt(new AreaSystem({
            dbg: true,
        }));
        // ---- pathfinding system
        this.systemMgr.adopt(new PathfindingSystem({
            dbg: true,
            getgrid: (() => this.grid),
        }));
        // ---- daytime system
        this.systemMgr.adopt(new DaytimeSystem({
            getTimeScale: () => 60,
            //dbg: true,
        }));
        // ---- activity schedule system
        this.systemMgr.adopt(new ActivityScheduleSystem({
            dbg: true,
        }));
        // ---- state system
        this.systemMgr.adopt(new StateSystem({
            dbg: false,
        }));
        // ---- query system
        this.systemMgr.adopt(new EQuerySystem({
            eQueryQ: Atts.eQueryQ,
            dbg: true,
        }));
        // ---- ai directive system
        this.systemMgr.adopt(new AiDirectiveSystem({
            dbg: true,
        }));
        // ---- ai goal system
        this.systemMgr.adopt(new AiGoalSystem({
            dbg: true,
        }));
        // ---- ai plan system
        this.systemMgr.adopt(new AiPlanSystem({
            dbg: true,
        }));
        // ---- ai process system
        this.systemMgr.adopt(new AiProcessSystem({
            dbg: true,
        }));
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