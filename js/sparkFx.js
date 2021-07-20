import { GameFx }               from "./base/fx.js";
import { ParticleEmitter }      from "./base/particles.js";
import { FadeParticle, SparkParticle, FadeTrailParticle }         from "./sparkParticles.js";
import { Fmt }                  from "./base/fmt.js";

export { TestFx, SparkFx };

class TestFx extends GameFx {
    cpost(spec) {
        super.cpost(spec);
        this.ctrls.push(new ParticleEmitter({
            interval: 50,
            count: 3,
            group: this.dependents,
            generator: (e) => {
                return new FadeParticle({
                    x: (spec.getorigx) ? this.getorigx() : 0,
                    y: (spec.getorigy) ? this.getorigy() : 0,
                });
            },
        }));
        console.log(`spec: ${Fmt.ofmt(spec)} pos: ${this.x},${this.y} xform: ${this.xform}`);
    }
}

class SparkFx extends GameFx {
    cpost(spec) {
        super.cpost(spec);
        this.ctrls.push(new ParticleEmitter({
            interval: 50,
            count: 2,
            group: this.dependents,
            generator: (e) => {
                return new SparkParticle({
                    x: (spec.getorigx) ? this.getorigx() : 0,
                    y: (spec.getorigy) ? this.getorigy() : 0,
                    size: 1,
                    //dx: .05,
                    dx: (Math.random() * .05) - .025,
                    dy: (Math.random() * .05) - .025,
                    emitSpeed: .025,
                });
            },
        }));
        //console.log(`spec: ${Fmt.ofmt(spec)} pos: ${this.x},${this.y} xform: ${this.xform}`);
    }

    iupdate(ctx) {
        //console.log(`SparkFx iupdate`);
        return super.iupdate(ctx);
    }

    _render(ctx, x=0, y=0) {
        //console.log(`sparkfx render @ ${x},${y} xform.min: ${this.xform.minx},${this.xform.miny}`);
        super._render(ctx, x, y);
    }
}