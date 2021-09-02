export { Config };

/**
 * Static class that stores project wide configuration
 */
class Config {
    static dflts = {
        maxRegionSize: 32,
        dfltCanvasId: "canvas",
        dfltUiCanvasId: "uicanvas",
        tileSize: 16,
        scale: 1,
        renderScale: 2,
        dbg : {
            ActionSystem: false,
            ActivityScheduleSystem: false,
            AiDirectiveSystem: false,
            AiGoalSystem: false,
            AiPlanSystem: false,
            AiProcessSystem: false,
            AreaSystem: false,
            DirtySystem: false,
            EQuerySystem: false,
            HungerSystem: false,
            LinkSystem: false,
            MediaLoader: false,
            MoraleSystem: true,
            MouseSystem: true,
            PathfindingSystem: false,
            StateSystem: false,
            Stats: false,
            ViewMgr: true,
            viewAreas: false,
            viewColliders: false,
            viewGrid: false,
            viewGridIndices: true,
            viewXform: false,
            hideNight: false,
            hideGloom: false,
        },
        layerMap: {
            l1:     0,
            l2:     1,
            l3:     2,
            max:    3,
        },
        depthMap: {
            bg:  0,
            bgo:  1,
            fg:  2,
            fgo:  3,
            max: 3,
        },
        actorTags: {
            player: "visible",
            npc: "visible",
        },
    };
    static init(spec={}) {
        Object.assign(this, Config.dflts, spec);
        this.halfSize = this.tileSize * .5;
        this.diagSize = this.tileSize * Math.SQRT2;
    }
}