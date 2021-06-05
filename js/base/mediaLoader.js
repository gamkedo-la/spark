export { MediaLoader };

import { Fmt }          from "./fmt.js";

class MediaLoader {
    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        this.refs = spec.refs || {};
        this.media = spec.media;
        this.loaders = spec.loaders || {};
        this.dbg = spec.dbg;
    }

    // METHODS -------------------------------------------------------------

    async load() {
        return new Promise( (resolve) => {
            let promises = [];
            for (const ref of this.refs) {
                // resolve asset loader for this ref
                const kind = ref.loader;
                const loader = this.loaders[kind];
                // if loader is not specified, assume raw asset definition
                if (!loader) {
                    if (this.dbg) console.log("loaded spec: " + Fmt.ofmt(ref));
                    if (this.media) this.media.add(ref);
                    continue;
                }
                let promise = loader.load(ref);
                promise.then((rslt) => { 
                    for (const spec of Object.values(rslt)) {
                        if (this.dbg) console.log("loaded spec: " + Fmt.ofmt(spec));
                        if (this.media) this.media.add(spec);
                    }
                });
                promises.push(promise);
            }
            Promise.all(promises).then(() => {
                if (this.dbg) console.log("media loaded...");
                resolve();
            })
        });
    }

}