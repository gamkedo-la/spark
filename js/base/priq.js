export { PriorityQueue }

class PriorityQueue {
    // CONSTRUCTOR ---------------------------------------------------------
    constructor() {
        this.tree = [];
    }

    // PROPERTIES ----------------------------------------------------------
    get empty() {
        return this.tree.length == 0;
    }

    // METHODS -------------------------------------------------------------
    parent(idx) {
        return parseInt((idx-1)/2, 10);
    }

    left(idx) {
        return (idx*2)+1;
    }

    right(idx) {
        return (idx*2)+2;
    }

    compare(idx1, idx2) {
        if (idx1>=this.tree.length) {
            return false;
        }
        if (idx2>=this.tree.length) {
            return true;
        }
        return this.tree[idx1].key < this.tree[idx2].key;
    }

    bubbleUp(idx) {
        if (idx == 0) return;
        let pi = this.parent(idx);
        if (this.compare(idx, pi)) {
            this.swap(idx, pi);
            this.bubbleUp(pi);
        }
    }

    bubbleDown(idx) {
        if (idx >= this.tree.length/2) return;
        let li = this.left(idx);
        let ri = this.right(idx);
        if (this.compare (li,idx) || this.compare(ri,idx)) {
            if (this.compare (ri, li)) {
                this.swap(idx, ri);
                this.bubbleDown(ri);
            } else {
                this.swap(idx, li);
                this.bubbleDown(li);
            }
        }
    }

    swap(idx1, idx2) {
        let v = this.tree[idx1];
        this.tree[idx1] = this.tree[idx2];
        this.tree[idx2] = v;
    }

    add(key, value) {
        let idx = this.tree.length;
        let node = {key: key, value: value};
        this.tree.push(node);
        this.bubbleUp(idx);
    }

    extract() {
        if (this.tree.empty) return false;
        // swap head w/ tail
        this.swap(0, this.tree.length-1);
        // setup return kv
        let kv = this.tree[this.tree.length-1];
        // remove tail
        this.tree.splice(this.tree.length-1,1);
        // repair tree
        this.bubbleDown(0);
        // return
        return kv;
    }

    toString() {
        return this.tree.map((v)=> { return v.key + ":" + v.value }).join(",")
    }

}