export { Event, EvtChannel };
import { Fmt } from "./fmt.js";

/** ========================================================================
 * represents an instance of an event that is triggered, along w/ associated event data
 */
class Event {
    // STATIC VARIABLES ----------------------------------------------------
    static _id = 1;
    static _idMap = {};
    static _tagMap = {};

    // STATIC METHODS ------------------------------------------------------
    static code(tag) {
        if (tag in this._tagMap) {
            return this._tagMap[tag];
        }
        let id = this._id++;
        this._idMap[id] = tag;
        this._tagMap[tag] = id;
        //console.log("=-=-= defined event for: " + tag + " id: " + id);
        return id;
    }

    static tag(code) {
        return this._idMap[code] || 0;
    }

    // CONSTRUCTOR ---------------------------------------------------------
    constructor(tag, atts={}) {
        this.id = Event.code(tag);
        this.tag = tag;
        Object.assign(this, atts);
    }

    // METHODS -------------------------------------------------------------
    toString() {
        return Fmt.ofmt(this, this.constructor.name);
    }
}

/** ========================================================================
 * represents an event channel for a specific event tag
 */
class EvtChannel {
    // CONSTRUCTOR ---------------------------------------------------------
    constructor(tag, data) {
        this._tag = tag;
        this._id = Event.code(tag);
        this._listeners = [];
        this._data = data;
    }

    // PROPERTIES ----------------------------------------------------------
    get length() {
        return this._listeners.length;
    }
    get tag() {
        return this._tag;
    }
    get id() {
        return this._id;
    }

    // METHODS -------------------------------------------------------------
    listen(fcn) {
        if (!fcn) return;
        this._listeners.push({once: false, fcn: fcn});
    }

    once(fcn) {
        if (!fcn) return;
        this._listeners.push({once: true, fcn: fcn});
    }

    ignore(fcn) {
        if (!fcn) {
            this._listeners = [];
            return;
        }
        for (let i=0; i<this._listeners.length; i++) {
            if (this._listeners[i].fcn === fcn) {
                this._listeners.splice(i, 1);
                return;
            }
        }
    }

    trigger(data) {
        // cascade data
        // - channel data (this._data)
        // - trigger data (_data)
        if (!this._listeners.length) return;
        let evtData = Object.assign({}, this._data, data);
        let evt = new Event(this._id, evtData)
        let listeners = this._listeners.slice(0);
        for (let i=0; i<listeners.length; i++) {
            listeners[i].fcn(evt);
            if (listeners[i].once) this.ignore(listeners[i].fcn);
        }
    }

    toString() {
        return Fmt.toString(this.constructor.name, this._tag, Fmt.ofmt(this._data));
    }

}
