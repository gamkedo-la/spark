export { Stairs };

import { Generator }        from './base/generator.js';
import { Model }            from './base/model.js';

class Stairs extends Model {
    constructor(spec={}) {
        super(spec);
        // -- position
        this.x = spec.x || 0;
        this.y = spec.y || 0;
        // -- sketch
        this.xsketch = spec.xsketch || {};
        this.up = spec.hasOwnProperty("up") ? spec.up : false;
        // -- activator
        if (spec.xactivator) {
            this.activator = Generator.generate(Object.assign({"cls": "Collider", x: this.x, y: this.y, blocking: false, nbcolor: "rgba(127,127,0,.4)"}, spec.xactivator));
            //console.log("activator: " + this.activator);
        }
        // -- collider
        if (spec.xcollider) {
            this.collider = Generator.generate(Object.assign({"cls": "Collider", x: this.x, y: this.y}, spec.xcollider));
        }
    }

    get otherLayer() {
        return this.layer + ((this.up) ? 1 : -1);
    }

    doactivate(actor, overlap) {
        console.log("doactivate w: " + actor + " layer: " + actor.layer);
        if (this.up) {
            actor.layer++;
        } else {
            actor.layer--;
        }
    }
}