export { Config };

/**
 * Static class that stores project wide configuration
 */
class Config {
    static dflts = {
        dfltCanvasId: "canvas",
        tileSize: 16,
        scale: 1,
        renderScale: 2,
        dbgViewColliders: false,
        dbgViewAreas: false,
        dbgViewGrid: true,
        dbgStats: true,
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
            bg:  0,
            bo:  1,
            fg:  2,
            fo:  3,
            max: 3,
        },
        actorTags: {
            player: "visible",
        },
    };
    static init(spec={}) {
        Object.assign(this, Config.dflts, spec);
        this.halfSize = this.tileSize * .5;
        this.diagSize = this.tileSize * Math.SQRT2;
    }
}