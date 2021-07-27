export { GameFx };

import { Config }                   from "./config.js";
import { Fmt } from "./fmt.js";
import { ParticleGroup }            from "./particles.js";
import { UxView }                   from "./uxView.js";

/**
 * A visual game effect...
 */
class GameFx extends UxView {

    cpre(spec) {
        if (!spec.xxform) spec.xxform = {border: .5, scalex: Config.renderScale, scaley: Config.renderScale};
        super.cpre(spec);
    }
    cpost(spec) {
        super.cpost(spec);
        this.dx = 0;
        this.dy = 0;
        this.getx = spec.getx;
        if (this.getx) {
            this.lastx = this.getx();
            this.xform.dx = this.lastx;
        }
        this.gety = spec.gety;
        if (this.gety) {
            this.lasty = this.gety();
            this.xform.dy = this.lasty;
        }
        if (spec.donePredicate) {
            this.donePredicate = ((fx) => (fx.ctrls.length === 0 || spec.donePredicate(fx)));
        } else {
            this.donePredicate = ((fx) => fx.ctrls.length === 0);
        }
        this.conditions = Object.assign({}, spec.conditions);
        // controllers... 
        // -- emitters or other objects acting as a controller of the effect.  controllers are executed until they are done, then popped from list
        this.ctrls = [];
        // finishers...
        // -- same as controllers, executed when other controllers exit, or when eol is triggered
        this.finishers = [];
        // children...
        // -- any particles or dependent effects that need to be part of the update/rendering sequence
        this.dependents = new ParticleGroup();
    }

    // PROPERTIES ----------------------------------------------------------
    get done() {
        return this.donePredicate(this);
    }

    // METHODS -------------------------------------------------------------
    iupdate(ctx) {
        // update dependents
        this.dependents.update(ctx);

        // update fx speed and update xform
        if (this.getx) {
            let x = this.getx();
            this.dx = (x - this.lastx)/ctx.deltaTime;
            this.xform.dx = x;
            this.lastx = x;
        }
        if (this.gety) {
            let y = this.gety();
            this.dy = (y - this.lasty)/ctx.deltaTime;
            this.xform.dy = y;
            this.lasty = y;
        }
        if (this.dependents) {
            if (this.dependents.width > 0) {
                this.xform.width = this.dependents.width;
                this.xform._origx = -this.dependents.minx/this.dependents.width;
                this.xform._offx = -((this.xform._origx - .5) * this.dependents.width)*Config.renderScale; 
                this.xform.dx = this.lastx + ((this.xform._origx - .5) * this.dependents.width);
            }
            if (this.dependents.height > 0) {
                this.xform.height = this.dependents.height;
                this.xform._origy = -this.dependents.miny/this.dependents.height;
                this.xform._offy = -((this.xform._origy - .5) * this.dependents.height)*Config.renderScale; 
                this.xform.dy = this.lasty + ((this.xform._origy - .5) * this.dependents.height);
            }
        }
        // update conditions
        for (const condition of Object.values(this.conditions)) {
            condition.update(this, ctx);
        }

        // iterate through controllers
        if (!this.done) {
            let ctrl = this.ctrls[0];
            while (ctrl) {
                ctrl.update(ctx);
                if (ctrl.done) {
                    this.ctrls.pop();
                    ctrl = this.ctrls[0];
                } else {
                    break;
                }
            }
        }

        // if eol, iterate through finishers
        if (this.done) {
            let finisher = this.finishers[0];
            while (finisher) {
                finisher.update(ctx);
                if (finisher.done) {
                    this.finishers.pop();
                    finisher = this.finisher[0];
                } else {
                    break;
                }
            }
            // if no controllers left, transition to eol
            if (this.finishers.length === 0) {
                // destroy the fx
                this.destroy();
                return true;
            }
        }

        // fx will always mark updated
        return true;
    }

    _render(ctx) {
        // render dependents
        this.dependents.render(ctx, 0, 0);
    }

}
