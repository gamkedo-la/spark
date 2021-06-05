import { Fmt } from "../fmt";

export { AiSet };

// =========================================================================
class AiSet {

    // CONSTRUCTOR ---------------------------------------------------------
    constructor(...sets) {
        this.kvs = Object.assign({}, ...sets);
    }

    // METHODS -------------------------------------------------------------
    get(key, dflt=undefined) {
        return (this.kvs.hasOwnProperty(key)) ? this.kvs[key] : dflt;
    }

    set(key, value) {
        this.kvs[key] = value;
    }

    copy() {
        return new AiSet(this.kvs);
    }

    contains(key) {
        return this.kvs.hasOwnProperty(key);
    }

    match(predicates) {
        for (pred of predicates) {
            if (!pred(this.kvs)) return false;
        }
        return true;
    }

    toString() {
        return Fmt.toString(this.constructor.name, Fmt.ofmt(this.kvs));
    }

}