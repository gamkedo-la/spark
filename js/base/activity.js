export { Activity };

class Activity {
    // STATIC VARIABLES ----------------------------------------------------
    // -- reference activities
    static none =           0;
    static idle =           1;
    // -- id: running id for newly defined goals
    static _id = 2;
    // -- id to string map
    static idMap = {
        0: "none",
        1: "idle",
    };

    // STATIC METHODS ------------------------------------------------------
    static register(tag) {
        if (tag in this) {
            return this[tag];
        }
        let id = this._id++;
        this.idMap[id] = tag;
        this[tag] = id;
        return id;
    }
    static toString(id) {
        return this.idMap[id];
    }

}