import { Fmt } from "./fmt.js";

export { Feat };

class Feat {
    constructor() {
    }

    execute() {
    }

    toString() {
        return Fmt.ofmt(this, this.constructor.name);
    }
}