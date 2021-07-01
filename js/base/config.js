export { Config };

/**
 * Static class that stores project wide configuration
 */
class Config {
    static dflts = {
        dfltCanvasId: "canvas",
        dfltUiCanvasId: "uicanvas",
        tileSize: 16,
        scale: 1,
        renderScale: 2,
        dbg : {
            ActionSystem: false,
            ActivityScheduleSystem: true,
            AiDirectiveSystem: true,
            AiGoalSystem: true,
            AiPlanSystem: true,
            AiProcessSystem: true,
            AreaSystem: false,
            EQuerySystem: true,
            PathfindingSystem: true,
            PathFollowSystem: true,
            StateSystem: false,
            Stats: false,
            ViewMgr: true,
            viewAreas: false,
            viewColliders: false,
            viewGrid: false,
            viewGridIndices: true,
        },
        layerMap: {
            l1:     0,
            l2:     1,
            l3:     2,
            l4:     3,
            l5:     4,
            l6:     5,
            max:    5,
        },
        depthMap: {
            bb:  0,
            bm:  1,
            bf:  2,
            fb:  3,
            fm:  4,
            ff:  5,
            max: 5,
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