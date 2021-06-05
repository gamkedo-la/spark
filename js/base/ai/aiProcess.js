export { AiProcess };

import { Fmt }                  from "../fmt.js";


class AiProcess {
    constructor(spec={}) {
    }

    prepare(actor) {
        return true;
    }

    update(ctx) {
        this.done = true;
        return true;
    }

    finalize() {
        return true;
    }

    toString() {
        return Fmt.toString(this.constructor.name);
    }

}