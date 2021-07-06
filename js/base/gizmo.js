export { Gizmo }

import { Generator }        from "./generator.js";
import { Util }             from "./util.js";
import { Fmt }              from "./fmt.js";
import { EvtChannel }       from "./event.js";
import { Hierarchy }        from "./hierarchy.js";

// __var    => non-serialized value
// _var     => indicates backing store
// var      => standard variable


/** ========================================================================
 * Gizmo is the base class for all game state objects, including game model and view components.
 * - global gizmo events are triggered on creation/destruction
 * - objects can have parent/child relationships
 */
class Gizmo {

    // STATIC VARIABLES ----------------------------------------------------
    static _id = 1;
    static __evtCreated = new EvtChannel("created");
    static __evtDestroyed = new EvtChannel("destroyed");

    // STATIC PROPERTIES ---------------------------------------------------
    static get gid() {
        return this._id++;
    }
    static set gid(v) {
        if (v >= this._id) this.id = v+1;
    }

    // STATIC EVENTS -------------------------------------------------------
    static get evtCreated() { return this.__evtCreated; }
    static get evtDestroyed() { return this.__evtDestroyed; }

    // CONSTRUCTOR ---------------------------------------------------------
    cpre(spec={}) {
    }
    constructor(spec={}) {
        // -- category
        this.__cat = spec.cat || "Gizmo";
        // -- cls
        this.cls = this.constructor.name;
        this.cpre(spec);
        //Util.bind(this, "onChildUpdate");
        // -- id
        if (spec.hasOwnProperty("gid")) {
            this.gid = spec.gid;
            Gizmo.gid = this.gid;
        } else {
            this.gid = Gizmo.gid;
        }
        // -- tag
        this.tag = spec.tag || `${this.cls}.${this.gid}`;
        // -- active
        this._active = (spec.hasOwnProperty("active")) ? spec.active : true;
        // -- parent
        this.__parent = (spec.hasOwnProperty("parent")) ? spec.parent : undefined;
        // -- children
        this.__children = [];
        if (spec.hasOwnProperty("xchildren")) {
            for (const xchild of spec.xchildren) {
                xchild.parent = this;
                let child = Generator.generate(xchild);
                if (child) this.adopt(child);
            }
        } else if (spec.hasOwnProperty("children")) {
            for (const child of spec.children) {
                if (child) this.adopt(child);
            }
        }
        // -- state flags
        this.updated = false;
        // -- events/handlers
        this.__evtActivated = new EvtChannel("activated", {actor: this});
        this.__evtDeactivated = new EvtChannel("deactivated", {actor: this});
        this.__evtUpdated = new EvtChannel("updated", {actor: this});
        this.__evtDestroyed = new EvtChannel("destroyed", {actor: this});
        this.cpost(spec);
        //console.log("==== constructor onChildUpdate: " + this.onChildUpdate);
        //console.log("triggering created for: " + this + " cat: " + this.cat + " cls: " + this.constructor.name);
        Gizmo.evtCreated.trigger({actor: this});
    }
    cpost(spec) {
    }


    // PROPERTIES ----------------------------------------------------------
    get parent() {
        return this.__parent;
    }

    get active() {
        let active = this._active;
        if (this.parent) active &= this.parent.active;
        return active;
    }
    set active(v) {
        v = (v) ? true : false;
        if (v != this._active) {
            this._active = v;
            if (v) {
                this.evtActivated.trigger();
            } else {
                this.evtDeactivated.trigger();
            }
        }
    }

    get cat() {
        return this.__cat;
    }

    // EVENTS --------------------------------------------------------------
    get evtActivated() { return this.__evtActivated; }
    get evtDeactivated() { return this.__evtDeactivated; }
    get evtDestroyed() { return this.__evtDestroyed; }
    get evtUpdated() { return this.__evtUpdated; }

    // EVENT HANDLERS ------------------------------------------------------
    /*
    onChildUpdate(evt) {
        //console.log("this: " + this);
        //console.log("this.__evtUpdated: " + this.__evtUpdated);
        this.evtUpdated.trigger(evt);
    }
    */

    // METHODS -------------------------------------------------------------
    *children() {
        for (const child of this.__children) {
            yield child;
        }
    }

    adopt(child) {
        // ensure child is orphaned
        let parent = child.parent;
        if (parent) {
            child.orphan();
            // avoid cycles in parent
            if (Hierarchy.findInRoot(parent, (v) => v === child)) return;
        }
        // avoid cycles in child
        if (Hierarchy.find(child, (v) => v === this)) return;
        // assign parent/child links
        child.__parent = this;
        this.__children.push(child);
        // cascade child events
        //console.log("adopt onChildUpdate: " + this.onChildUpdate);
        //child.evtUpdated.listen(this.onChildUpdate);
    }

    orphan() {
        if (this.__parent) {
            let parent = this.__parent;
            let idx = parent.__children.indexOf(this);
            if (idx != -1) {
                parent.__children.splice(idx, 1);
                //this.evtUpdated.ignore(parent.onChildUpdate);
            }
            this.__parent = undefined;
        }
    }

    destroy() {
        for (const child of this.children()) child.orphan();
        this.orphan();
        this.evtDestroyed.trigger();
        Gizmo.evtDestroyed.trigger({actor: this});
    }

    update(ctx) {
        // handle all child updates
        for (const child of this.__children) {
            if (child.update) this.updated |= child.update(ctx);
        }
        // handle internal updates
        this.updated |= this.iupdate(ctx);
        // trigger update event if needed
        if (this.updated) {
            this.evtUpdated.trigger();
        }
        let updated = this.updated;
        this.updated = false;
        return updated;
    }

    // internal update
    iupdate() {
        return false;
    }

    toString() {
        return Fmt.toString(this.cls, this.gid, this.tag);
    }

}