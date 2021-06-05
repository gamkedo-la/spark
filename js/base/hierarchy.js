export { Hierarchy }

class Hierarchy {

    // STATIC METHODS ------------------------------------------------------
    /**
     * find root for given object
     * @param {*} obj 
     */
    static root(obj) {
        while(obj && obj.parent) obj = obj.parent;
        return obj;
    }

    /**
     * find object in entire hierarchy
     * @param {*} obj 
     * @param {*} filter 
     */
    static findInRoot(obj, filter) {
        return this.find(this.root(obj), filter);
    }

    /**
     * find object in hierarchy (evaluating object and its children)
     * @param {*} obj 
     * @param {*} filter 
     */
    static find(obj, filter) {
        if (filter(obj)) return obj;
        for (const child of obj.children()) {
            if (filter(child)) return child;
            let match = this.find(child, filter);
            if (match) return match;
        }
        return undefined;
    }

    /**
     * find object in parent hierarchy (evaluating parent hierarchy)
     * @param {*} obj 
     * @param {*} filter 
     */
    static findInParent(obj, filter) {
        for (let parent = obj.parent; parent; parent = parent.parent) {
            if (filter(parent)) return parent;
        }
        return undefined;
    }

}