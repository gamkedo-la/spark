export { Enum };

/** ========================================================================
 * An expandable enum class.  Allows for registration of tags that are 
 * assigned unique ids.  Tags are registered as static properties of the
 * class and then can be referenced by <class>.<tag> to use a numeric value.
 * 
 * Can be subclassed to derive specific enums for specific use cases.
 * Subclasses must be initialized calling the static init method prior to use
 * to ensure unique values for the subclass.
 */
class Enum {
    // STATIC VARIABLES ----------------------------------------------------
    static _id = 1;
    static _idMap = {};

    // STATIC METHODS ------------------------------------------------------
    static register(tag) {
        if (tag in this) {
            return this[tag];
        }
        let id = this._id++;
        this._idMap[id] = tag;
        this[tag] = id;
        return id;
    }

    static init(tags=[], startId=0) {
        this._id = startId;
        this._idMap = {};
        for (const tag of tags) {
            this.register(tag);
        }
    }

    static toString(id) {
        return this._idMap[id];
    }
}