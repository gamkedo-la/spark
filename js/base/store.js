export { Store, KvStore, SortedStore, CachingFindStore }

import { Fmt } from "./fmt.js";
import { EvtChannel } from "./event.js";

class Store {

    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        this.getkey = spec.getkey || ((v) => v.gid);
        this.items = new Map();
        let events = (spec.hasOwnProperty("events")) ? spec.events : false;
        // event channels
        if (events) {
            this.__evtAdded = new EvtChannel("added", {actor: this});
            this.__evtRemoved = new EvtChannel("removed", {actor: this});
        } else {
            this.__evtAdded = { trigger: ()=>false };
            this.__evtRemoved = { trigger: ()=>false };
        }
    }

    // PROPERTIES ----------------------------------------------------------
    get length() {
        return this.items.size;
    }

    // EVENTS --------------------------------------------------------------
    get evtAdded() { return this.__evtAdded; }
    get evtRemoved() { return this.__evtRemoved; }

    // METHODS -------------------------------------------------------------
    add(obj) {
        if (obj) {
            this.items.set(this.getkey(obj), obj);
            this.evtAdded.trigger({target: obj});
        }
    }

    remove(key) {
        let obj = this.items.get(key);
        if (obj) {
            this.items.delete(key);
            this.evtRemoved.trigger({target: obj});
        }
    }

    contains(obj) {
        if (obj) {
            return this.items.has(this.getkey(obj));
        }
        return false;
    }

    get(key) {
        return this.items.get(key);
    }

    clear(destroy=true) {
        if (destroy) {
            for (let obj of this) {
                if (obj.destroy) obj.destroy();
            }
        }
        this.items.clear();
    }

    *[Symbol.iterator]() {
        for (const obj of this.items.values()) {
            yield obj;
        }
    }

    *find(filter=(v) => true) {
        for (const obj of this.items.values()) {
            if (filter(obj)) yield obj;
        }
    }

    findFirst(filter=(v) => true) {
        for (const obj of this.items.values()) {
            if (filter(obj)) return obj;
        }
        return undefined;
    }

    toString() {
        return Fmt.toString(this.constructor.name);
    }

}

class KvStore extends Store {

    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        super(spec);
    }

    // METHODS -------------------------------------------------------------
    set(key, value) {
        this.items.set(key, value);
        this.evtAdded.trigger({target: {key: key, value: value}});
    }

}

class SortedStore extends Store {

    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        super(spec);
        this.items = [];
        this.cmpFcn = spec.cmpFcn;
    }

    // PROPERTIES ----------------------------------------------------------
    get length() {
        return this.items.length;
    }

    // METHODS -------------------------------------------------------------
    /**
     * add object to the group, sorted by comparison function
     * @param {*} obj - object to add
     */
    add(obj) {
        if (this.cmpFcn) {
            for (let i=0; i<this.items.length; i++) {
                if (this.cmpFcn(obj, this.items[i]) < 0) {
                    this.items.splice(i, 0, obj);
                    this.evtAdded.trigger({target: obj});
                    return;
                }
            }
        }
        this.items.push(obj);
        this.evtAdded.trigger({target: obj});
    }

    /**
     * remove object from group
     * @param {*} obj - object to remove
     */
    remove(obj) {
        let index = this.items.indexOf(obj);
        if (index !== -1) {
            this.items.splice(index, 1);
            this.evtRemoved.trigger({target: obj});
        }
    }

    contains(obj) {
        return this.items.indexOf(obj) !== -1;
    }

    clear(destroy=true) {
        if (destroy) {
            for (let obj of this) {
                if (obj.destroy) obj.destroy();
            }
        }
        this.items.splice(0);
    }

    *[Symbol.iterator]() {
        for (const obj of this.items) {
            yield obj;
        }
    }

}

class CachingFindStore extends Store {

    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        super(spec);
        this.searchCache = new Map();
    }

    *find(filter=(v) => true, cache=true) {
        if (!cache) {
            yield *super.find(filter);
            return;
        }
        if (!this.searchCache.has(filter)) {
            let entries = [];
            this.searchCache.set(filter, entries);
            for (const e of super.find(filter)) {
                entries.push(e);
                yield e;
            }
        } else {
            yield *this.searchCache.get(filter);
        }
    }

    add(obj) {
        if (obj) {
            super.add(obj);
            this.searchCache.clear();
        }
    }

    remove(obj) {
        if (obj) {
            super.remove(obj);
            this.searchCache.clear();
        }
    }
    
    clear(destroy=true) {
        super.clear(destroy);
        this.searchCache.clear();
    }

}