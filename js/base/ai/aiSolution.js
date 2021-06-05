export { AiSolution };

import { Fmt } from "../fmt.js";

class AiSolution {
    static pending = 0;
    static ready = 1;
    static failed = 2;
    static done = 3;

    constructor(state) {
        this.state = state;
        this.plans = [];
        this.processes = [];
        this.currentIndex = 0;
        this.cost = 0;
        this.utility = 0;
        this.terms = 0;
        this.status = AiSolution.pending;
    }

    toString() {
        return Fmt.toString(this.constructor.name, this.plans);
    }
}