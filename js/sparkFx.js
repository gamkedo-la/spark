import { GameFx }               from "./base/fx.js";
import { ParticleEmitter }      from "./base/particles.js";
import { FadeParticle }         from "./sparkParticles.js";

export { TestFx };

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
    }
}