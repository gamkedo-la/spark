import { GameFx }               from "./base/fx.js";
import { ParticleEmitter }      from "./base/particles.js";
import { FadeParticle, SparkParticle }         from "./sparkParticles.js";
import { Fmt }                  from "./base/fmt.js";

export { TestFx, SparkFx };

class TestFx extends GameFx {
    cpost(spec) {
        super.cpost(spec);
        this.ctrls.push(new ParticleEmitter({
            interval: 75,
            count: 2,
            group: this.dependents,
            generator: (e) => {
                let dx = -(this.dx*.5) + (Math.random() * .1) - .05;
                let dy = -(this.dy*.5) + (Math.random() * .1) - .05;
                return new FadeParticle({
                    dx: dx,
                    dy: dy,
                });
            },
        }));
    }
}

class SparkFx extends GameFx {
    cpost(spec) {
        super.cpost(spec);
        this.ctrls.push(new ParticleEmitter({
            interval: 33,
            jitter: .5,
            count: 1,
            group: this.dependents,
            generator: (e) => {
                let dx = -(this.dx) + (Math.random() * .05) - .025;
                let dy = -(this.dy) + (Math.random() * .05) - .025;
                return new SparkParticle({
                    size: 1,
                    dx: dx,
                    dy: dy,
                    emitSpeed: .025,
                });
            },
        }));
    }

    iupdate(ctx) {
        return super.iupdate(ctx);
    }

    _render(ctx, x=0, y=0) {
        super._render(ctx, x, y);
    }
}