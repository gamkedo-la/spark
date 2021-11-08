export { Morale };

class Morale {
    // min 0, max 9, range 10
    static dflt = 5;
    static max = 9;

    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        this.value = spec.hasOwnProperty("value") ? spec.value : Morale.dflt;
        this.likes = spec.likes || {};
        this.dislikes = spec.dislikes || {};
        this.start = this.value;
        this.events = [];
    }

    reset() {
        if (this.value !== Morale.max) {
            this.value = this.start;
        }
    }

}