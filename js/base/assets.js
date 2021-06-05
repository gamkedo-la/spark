export { Assets };

import { Store }        from "./store.js";

/** =======================================================================
 * Assets implements a store for all game asset specifications, referenced by tag
 * or by unique id.
 */
class Assets {

    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        this.idMap = new Store({getkey: (v) => v.id});
        this.tagMap = new Store({getkey: (v) => v.tag});
        let refs = spec.refs || [];
        for (const ref of refs) {
            this.add(ref)
        }
    }

    // METHODS -------------------------------------------------------------
    add(ref) {
        if (ref && ref.id) {
            if (this.idMap.get(ref.id)) console.error("duplicate asset id detected: " + ref.id);
            this.idMap.add(ref);
        }
        if (ref && ref.tag) {
            if (this.tagMap.get(ref.tag)) console.error("duplicate asset tag detected: " + ref.tag);
            this.tagMap.add(ref);
        }
    }

    fromId(id) {
        return this.idMap.get(id);
    }

    fromTag(tag) {
        return this.tagMap.get(tag);
    }

    *[Symbol.iterator]() {
        yield *this.tagMap;
    }

}