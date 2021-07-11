import { GameFx } from "./base/fx.js";

export { TestFx };

class TestFx extends GameFx {
    cpost(spec) {
        super.cpost(spec);

        this.ctrls.push(new ParticleEmitter({
            getx: () => fx.x,
            gety: () => fx.y,
            interval: 50,
            count: 3,
            generator: (e) => {
                let xpart = {
                    psys: this,
                    x: e.x,
                    y: e.y,
                    size: Math.round(Math.random()*3) + 1,
                    color: (Math.random() > .75) ? new Color(235,138,6,1) : new Color(255,201,92,1),
                    dx: (Math.random() - .5)*.04,
                    dy: (Math.random() - .5)*.04,
                    ttl: 500,
                }
                return new FadeParticle(xpart);
            },
        }));
    }
}