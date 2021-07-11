export { FadeParticle };

import { Particle } from "./base/particles.js";

// a simple fade particle
class FadeParticle extends Particle {
    constructor(spec={}) {
        super(spec);
        this.dx = spec.dx || .01;
        this.dy = spec.dy || 0;
        this.size = spec.size || 3;
        this.color = spec.color || new Color(255,201,92,1);
        this.ttl = spec.ttl || 1000;
        this.fade = this.color.a;
        this.fadeRate = this.fade/this.ttl;
    }

    update(ctx) {
        let dt = ctx.deltaTime;
        if (this.done) return;
        // update position
        this.x += (this.dx * dt);
        this.y += (this.dy * dt);
        // fade... slowly fade to nothing
        this.fade -= (dt * this.fadeRate);
        this.color.a = this.fade;
        // time-to-live
        this.ttl -= dt;
        if (this.ttl <= 0) this._done = true;
    }

    render(ctx) {
        if (this._done) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
        ctx.fillStyle = this.color.toString();
        ctx.fill();
    }

}