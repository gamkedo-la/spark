export { Door };

import { Model }            from './base/model.js';
import { Config }           from './base/config.js';
import { ModelState }       from './base/modelState.js';
import { OpenAction }       from './base/action.js';
import { Condition } from './base/condition.js';
import { Fmt } from './base/fmt.js';

class Door extends Model {
    cpre(spec) {
        super.cpre(spec);
        if (!spec.hasOwnProperty("dfltState")) spec.dfltState = ModelState.close;
        if (!spec.hasOwnProperty("state")) spec.state = ModelState.close;
    }
    constructor(spec={}) {
        super(spec);
        // -- position
        this.x = spec.x || 0;
        this.y = spec.y || 0;
        // -- autoClose
        this.autoClose = (spec.hasOwnProperty("autoClose") ? spec.autoClose : true);
        // -- interactRange
        this.interactRange = spec.interactRange || Config.tileSize * 4;
        // -- interactable
        this.interactable = true;
    }

    dointeract(actor) {
        console.log(this + " dointeract");
        if (this.conditions.has(Condition.opened)) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        console.log(this + " open");
        if (this.collider) this.collider.active = false;
        this.conditions.add(Condition.opened);
    }

    close() {
        console.log(this + " close");
        if (this.collider) this.collider.active = true;
        this.conditions.delete(Condition.opened);
    }

    bypassAction() {
        return new OpenAction({target: this});
    }

}