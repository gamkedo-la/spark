import { GameFx }               from "./base/fx.js";
import { ParticleEmitter }      from "./base/particles.js";
import { FadeParticle }         from "./sparkParticles.js";

ParticleEmitter

export { TestFx };

class TestFx extends GameFx {
    cpost(spec) {
        super.cpost(spec);

        this.ctrls.push(new ParticleEmitter({
            interval: 150,
            count: 1,
            group: this.dependents,
            generator: (e) => {
                return new FadeParticle({
                    x: (spec.absolutePosition) ? this.x : 0,
                    y: (spec.absolutePosition) ? this.y : 0,
                });
            },
        }));
    }
}