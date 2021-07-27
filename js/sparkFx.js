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
            interval: 100,
            jitter: .5,
            count: 1,
            group: this.dependents,
            first: true,
            generator: (e) => {
                let dx = -(this.dx*.4) + (Math.random() * .03) - .015;
                let dy = -(this.dy*.4) + (Math.random() * .03) - .015;
                return new SparkParticle({
                    size: 2,
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