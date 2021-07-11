import { ParticleGroup } from "./particles";
import { UxView } from "./uxView";

export { GameFx };

/**
 * A visual game effect...
 */
class GameFx extends UxView {

    cpost(spec) {
        super.cpost(spec);

        this.getx = spec.getx;
        this.gety = spec.gety;

        this.donePredicate = spec.donePredicate || ((p) => false);
        this.conditions = {};
        if (spec.conditions) {
            spec.conditions.array.forEach(element => {
                this.conditions[element.tag] = element;
            });
        }

        // controllers... 
        // -- emitters or other objects acting as a controller of the effect.  controllers are executed until they are done, then popped from list
        this.ctrls = [];
        // finishers...
        // -- same as controllers, executed when other controllers exit, or when eol is triggered
        this.finishers = [];
        // children...
        // -- any particles or dependent effects that need to be part of the update/rendering sequence
        this.dependents = new ParticleGroup();
        this.waitOnChild = (spec.hasOwnProperty("waitOnChild")) ? spec.waitOnChild : true;
    }

    get x() {
        return (this.getx) ? this.getx() + this._xform.wcenterx: + this._xform.wcenterx;
    }
    get y() {
        return (this.gety) ? this.gety() + this._xform.wcentery: + this._xform.wcentery;
    }

    update(ctx) {
        // don't update if done
        if (this.done) return;

        // check for end of life of fx
        if (!this.eol && this.geteol(ctx)) {
            if (this.dbg) console.log("setting eol");
            this.eol = true;
        }
        // iterate through controllers
        for (let i=this.ctrls.length-1; i>=0; i--) {
            // if controller is done, or fx eol... remove ctrl
            if (this.ctrls[i].done || this.eol) {
                this.ctrls[i].destroy();
                this.ctrls.pop();
                if (this.dbg) console.log("controller is done");
            // otherwise, update top controller
            } else {
                this.ctrls[i].update(ctx);
                break;
            }
        }
        // if no controllers left, transition to eol
        if (this.ctrls.length === 0) {
            this.eol = true;
            if (this.dbg) console.log("all controllers are done, eol");
        }
        // if eol, iterate through finishers
        if (this.eol) {
            for (let i=this.finishers.length-1; i>=0; i--) {
                // if finisher is done, remove
                if (this.finishers[i].done) {
                    this.finishers[i].destroy();
                    this.finishers.pop();
                // otherwise, update top finisher
                } else {
                    this.finishers[i].update(ctx);
                    break;
                }
            }
        }
        // if no finishers left, transition to done
        if (this.eol && this.finishers.length === 0 && !this.waitOnChild) {
            this.done = true;
            this.destroy();
        // otherwise... update children
        } else {
            for (let i=this.children.length-1; i>=0; i--) {
                // check for done
                if (this.children[i].done) {
                    this.children.splice(i, 1);
                // or update
                } else {
                    this.children[i].update(ctx);
                }
            }
            if (this.eol && this.children.length === 0) {
                this.done = true;
                this.destroy();
            }
        }
    }

    render(ctx) {
        // render dependents
        this.dependents.render(ctx, this.x, this.y);
    }

    destroy() {
        //console.log("fx destroy: " + this);
    }

    toString() { 
        return Fmt.toString(this.constructor.name);
    }

}
