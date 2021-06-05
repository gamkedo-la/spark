export { EQuery };

class EQuery {
    constructor(predicate=()=>false, cb=()=>false) {
        this.predicate = predicate;
        this.cb = cb;
        this.matches = [];
        this.done = false;
    }
}