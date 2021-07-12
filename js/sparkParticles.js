export { FadeParticle };

import { Color }                    from "./base/color.js";
import { Fmt }                      from "./base/fmt.js";
import { Particle, TtlCondition }   from "./base/particles.js";

// a simple fade particle
class FadeParticle extends Particle {
    constructor(spec={}) {
        let ttl = spec.ttl || 1000;
        spec.conditions = Object.assign({ ttl: new TtlCondition(ttl)}, spec.conditions);
        let ttlPredicate = ((p) => p.conditions.ttl.value );
        spec.donePredicate = (spec.donePredicate) ? ((p) => (spec.donePredicate(p) || ttlPredicate(p))) : ttlPredicate;
        super(spec);
        this.dx = spec.dx || (Math.random() * .1) - .05;
        this.dy = spec.dy || (Math.random() * .1) - .05;
        this.size = spec.size || Math.random() * 3;
        this.color = spec.color || new Color(255,201,92,1);
        this.fade = this.color.a;
        this.fadeRate = this.fade/ttl;
    }

    update(ctx) {
        if (this.done) return;
        let dt = ctx.deltaTime;
        // update position
        this.x += (this.dx * dt);
        this.y += (this.dy * dt);
        // fade... slowly fade to nothing
        this.fade -= (dt * this.fadeRate);
        this.color.a = this.fade;
    }

    render(ctx, x=0, y=0) {
        if (this._done) return;
        ctx.beginPath();
        ctx.arc(this.x + x, this.y + y, this.size, 0, Math.PI*2);
        ctx.fillStyle = this.color.toString();
        ctx.fill();
    }

}