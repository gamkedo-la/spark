export { AreaView, Area };

import { Model }            from "./model.js";
import { Bounds }           from "./bounds.js";
import { Store }            from "./store.js";
import { EvtChannel }       from "./event.js";
import { Util }             from "./util.js";
import { UxView }           from "./uxView.js";
import { Config }           from "./config.js";

class AreaView extends UxView {
    cpost(spec={}) {
        super.cpost(spec);
        this.area = spec.area;
    }
    _render(ctx) {
        if (!Config.dbg.viewAreas) return;
        if (this.area) this.area.render(ctx);
    }
}

class Area extends Model {

    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec) {
        super.cpost(spec);
        // -- bounds
        this.x = spec.x || 0;
        this.y = spec.y || 0;
        this.width = spec.width || 0;
        this.height = spec.height || 0;
        // -- color (for debug rendering)
        this.color = spec.color || "rgba(0,0,255,.25)";
        // -- actorTags
        this.actorTags = spec.actorTags || Config.actorTags;
        // -- actorCounts: for each tag value, keep track of counter
        this.actorCounts = {};
        for (const att of Object.values(this.actorTags)) {
            this.actorCounts[att] = 0;
        }
        // -- linked areas
        this.links = spec.links || [];
        // -- entities: store of all objects within area
        this.entities = new Store({getkey: (v) => v.gid});
        // event channels
        Util.bind(this, "onObjUpdate", "onObjDestroy");
        this.__evtEntered = new EvtChannel("entered", {area: this});
        this.__evtLeft = new EvtChannel("left", {area: this});
    }

    // EVENTS --------------------------------------------------------------
    get evtEntered() { return this.__evtEntered; }
    get evtLeft() { return this.__evtLeft; }

    get minx() {
        return this.x;
    }
    get maxx() {
        return this.x + this.width;
    }
    get miny() {
        return this.y;
    }
    get maxy() {
        return this.y + this.height;
    }

    onObjUpdate(evt) {
        let actor = evt.actor;
        if (actor && ((this.layer !== undefined && this.layer !== actor.layer) || (!this.overlaps(actor) && !this.contains(actor)))) {
            //console.log("actor: " + actor + " left: " + this);
            this.remove(actor);
        }
    }

    onObjDestroy(evt) {
        let actor = evt.actor;
        if (actor) this.remove(actor);
    }

    add(obj) {
        if (!obj) return;
        if (obj.tag in this.actorTags) {
            this.actorCounts[this.actorTags[obj.tag]]++;
        }
        obj.evtUpdated.listen(this.onObjUpdate);
        obj.evtDestroyed.listen(this.onObjDestroy);
        this.entities.add(obj);
        this.evtEntered.trigger({actor: obj});
    }

    remove(obj) {
        if (!obj) return;
        if (obj.tag in this.actorTags) {
            this.actorCounts[this.actorTags[obj.tag]]--;
            if (this.actorCounts[this.actorTags[obj.tag]] < 0) this.actorCounts[this.actorTags[obj.tag]] = 0;
        }
        this.entities.remove(obj.gid);
        obj.evtUpdated.ignore(this.onObjUpdate);
        obj.evtDestroyed.ignore(this.onObjUpdate);
        this.evtLeft.trigger({actor: obj});
    }

    getCount(att) {
        if (att in this.actorCounts) {
            return this.actorCounts[att];
        }
        return 0;
    }

    overlaps(other) {
        return Bounds.overlaps(this, other, false);
    }

    contains(other) {
        return Bounds.contains(this, other);
    }

    includes(gid) {
        return this.entities.get(gid) != undefined;
    }

    *[Symbol.iterator]() {
        yield *this.entities;
    }

    render(renderCtx) {
        renderCtx.fillStyle = this.color;
        renderCtx.fillRect(this.minx, this.miny, this.width, this.height);
    }

}