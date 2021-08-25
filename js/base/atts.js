export { Atts };

/**
 * Atts class that stores project wide global attributes and provides getters
 */
class Atts {
    static dflts = {
        tileSize: 32,
        paused: false,
    };
    static init(spec={}) {
        Object.assign(this, Atts.dflts, spec);
    }

    static getter(tag, dflt) {
        return () => (this.hasOwnProperty(tag)) ? this[tag] : dflt;
    }
}