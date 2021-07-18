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
        this.getx = spec.getx;
        this.gety = spec.gety;
        this.getorigx = spec.getorigx;
        this.getorigy = spec.getorigy;
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

    get minx() {
        return (this.getx) ? this.getx() + this._xform.wminx : this._xform.wminx;
    }
    get miny() {
        return (this.gety) ? this.gety() + this._xform.wminy : this._xform.wminy;
    }

    get maxx() {
        return (this.getx) ? this.getx() + this._xform.wmaxx : this._xform.wmaxx;
    }
    get maxy() {
        return (this.gety) ? this.gety() + this._xform.wmaxy : this._xform.wmaxy;
    }

    get x() {
        return (this.getx) ? this.getx() + this._xform.wcenterx : this._xform.wcenterx;
    }
    get y() {
        return (this.gety) ? this.gety() + this._xform.wcentery : this._xform.wcentery;
    }

    update(ctx) {
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

        // update dependents
        this.dependents.update(ctx);

        // fx will always mark updated
        return true;
    }

    _render(ctx) {
        // render dependents
        let x = (this.getx) ? this.getx() + this.xform.minx : this.xform.minx;
        let y = (this.gety) ? this.gety() + this.xform.miny : this.xform.miny;
        //console.log(`fx render @ ${x},${y}`);
        this.dependents.render(ctx, x, y);
    }

}
