export { Door };

import { Model }            from './base/model.js';
import { Config }           from './base/config.js';
import { ModelState }       from './base/modelState.js';
import { OpenAction }       from './base/action.js';
import { Condition }        from './base/condition.js';
import { Generator }        from './base/generator.js';
import { LevelNode }        from './lvlGraph.js';
import { Direction }        from './base/dir.js';

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
        // -- approaches
        this.approachOffsets = spec.approachOffsets;
        this.exitOffsets = spec.exitOffsets;
        // -- sounds
        if (spec.xopenSfx) this.openSfx = Generator.generate(spec.xopenSfx);
        if (spec.xcloseSfx) this.closeSfx = Generator.generate(spec.xcloseSfx);
    }

    get approaches() {
        if (this.approachOffsets) {
            return this.approachOffsets.map((v) => new LevelNode(this.x+v.x, this.y+v.y, this.layer));
        } else {
            return Direction.cardinals.map((v) => new LevelNode(Direction.applyToX(this.x, v), Direction.applyToY(this.y, v), this.layer));
        }
    }

    exitFor(approach) {
        if (this.approachOffsets && this.exitOffsets && this.approachOffsets.length == this.exitOffsets.length) {
            for (let i=0; i<this.approachOffsets.length; i++) {
                if (approach.x === (this.approachOffsets[i].x + this.x) &&
                    approach.y === (this.approachOffsets[i].y + this.y) &&
                    approach.layer == this.layer) {
                    return new LevelNode(this.x+this.exitOffsets[i].x, this.y+this.exitOffsets[i].y, this.layer)
                }
            }
        }
        return new LevelNode(this.x, this.y, this.layer);
    }

    dointeract(actor) {
        //console.log(this + " dointeract");
        if (this.conditions.has(Condition.opened)) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        //console.log(this + " open");
        if (this.collider) this.collider.active = false;
        this.conditions.add(Condition.opened);
        if (this.openSfx) this.openSfx.play();
    }

    close() {
        //console.log(this + " close");
        if (this.collider) this.collider.active = true;
        this.conditions.delete(Condition.opened);
        if (this.closeSfx) this.closeSfx.play();
    }

    bypassAction() {
        return new OpenAction({target: this});
    }

}