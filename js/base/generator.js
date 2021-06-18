export { Generator };

import { KvStore }          from "./store.js";
import { Fmt }              from "./fmt.js";

class Generator {
    // STATIC VARIABLES ----------------------------------------------------
    static _instance;

    // STATIC PROPERTIES ---------------------------------------------------
    static get instance() {
        if (!this._instance) this._instance = new this();
        return this._instance;
    }

    // STATIC METHODS ------------------------------------------------------
    static generate(spec) {
        let obj = this.instance.generate(spec);
        if (!obj) console.error(`generator failed for ${Fmt.ofmt(spec)}`);
        return obj;
    }

    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        if (!Generator._instance) Generator._instance=this;
        this.registry = spec.registry || new KvStore();
        return Generator._instance;
    }

    // METHODS -------------------------------------------------------------
    register(generator) {
        this.registry.add(generator);
    }

    generate(spec) {
        if (!spec) return undefined;
        let cls = this.registry.get(spec.cls);
        if (cls) return new cls(spec);
        return undefined;
    }

}