export { Door };

import { Model }            from './base/model.js';
import { Config }           from './base/config.js';
import { ModelState }       from './base/modelState.js';
import { Generator }        from './base/generator.js';
import { OpenAction }       from './base/action.js';

class Door extends Model {
    constructor(spec={}) {
        super(spec);
        // -- position
        this.x = spec.x || 0;
        this.y = spec.y || 0;
        // -- sketch
        this.xsketch = spec.xsketch || {};
        // -- state
        this.state = spec.state || ModelState.close;
        // -- autoClose
        this.autoClose = (spec.hasOwnProperty("autoClose") ? spec.autoClose : true);
        // -- interactRange
        this.interactRange = spec.interactRange || Config.tileSize * 2;
        // -- interactable
        this.interactable = true;
        // -- collider
        if (spec.xcollider) {
            this.collider = Generator.generate(Object.assign({"cls": "Collider", x: this.x, y: this.y}, spec.xcollider));
        }
    }

    dointeract(actor) {
        console.log(this + " dointeract");
        if (this.state !== ModelState.open) {
            this.open();
        }
    }

    open() {
        console.log(this + " open");
        if (this.collider) this.collider.active = false;
        this.state = ModelState.open;
    }

    close() {
        console.log(this + " close");
        if (this.collider) this.collider.active = true;
        this.state = ModelState.close;
    }

    bypassAction() {
        return new OpenAction({target: this});
    }

}