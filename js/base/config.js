export { Config };

/**
 * Static class that stores project wide configuration
 */
class Config {
    static dflts = {
        dfltCanvasId: "canvas",
        tileSize: 32,
        scale: 2,
        dbgViewColliders: false,
        dbgViewAreas: false,
        dbgViewGrid: false,
        dbgStats: true,
        layerMap: {
            main:   0,
            upper:  1,
            upper2: 2,
            max:    2,
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