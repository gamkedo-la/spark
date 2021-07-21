export { FadeParticle, FadeTrailParticle, SparkParticle };

import { Color }                    from "./base/color.js";
import { Fmt }                      from "./base/fmt.js";
import { Particle, ParticleGroup, TtlCondition }   from "./base/particles.js";

// a simple fade particle
class FadeParticle extends Particle {
    constructor(spec={}) {
        let ttl = spec.ttl || 1000;
        spec.conditions = Object.assign({ ttl: new TtlCondition({ ttl: ttl })}, spec.conditions);
        let ttlPredicate = ((p) => p.conditions.ttl.value );
        spec.donePredicate = (spec.donePredicate) ? ((p) => (spec.donePredicate(p) || ttlPredicate(p))) : ttlPredicate;
        super(spec);
        this.dx = spec.dx || (Math.random() * .1) - .05;
        this.dy = spec.dy || (Math.random() * .1) - .05;
        this.size = spec.size || Math.random() * 3;
        this.color = spec.color || new Color(255,201,92,1);
        this.fade = this.color.a;
        this.fadeRate = this.fade/ttl;
        //console.log(`fade particle spec: ${Fmt.ofmt(spec)}`);
    }

    update(ctx) {
        super.update(ctx);
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
        //console.log(`render Fade @ ${x},${y} this.pos: ${this.x},${this.y}`);
        if (this.done) return;
        ctx.beginPath();
        ctx.arc(this.x + x, this.y + y, this.size, 0, Math.PI*2);
        ctx.fillStyle = this.color.toString();
        ctx.fill();
    }

}

// a simple fade particle
class FadeTrailParticle extends Particle {
    constructor(spec={}) {
        let ttl = spec.ttl || 1000;
        spec.conditions = Object.assign({ ttl: new TtlCondition({ ttl: ttl })}, spec.conditions);
        let ttlPredicate = ((p) => p.conditions.ttl.value );
        spec.donePredicate = (spec.donePredicate) ? ((p) => (spec.donePredicate(p) || ttlPredicate(p))) : ttlPredicate;
        super(spec);
        this.dx = spec.dx || (Math.random() * .1) - .05;
        this.dy = spec.dy || (Math.random() * .1) - .05;
        this.size = spec.size || Math.random() * 3;
        this.color = spec.color || new Color(255,201,92,1);
        this.fade = this.color.a;
        this.fadeRate = this.fade/ttl;
        this.trailSampleTTL = spec.trailSampleTTL || 50;
        this.trailSampleTimer = this.trailSampleTTL;
        this.trailLength = spec.trailLength || 5;
        this.trailx = [];
        this.traily = [];
        this.traildx = spec.traildx || 0;
        this.traildy = spec.traildy || 0;
        this.trailWidth = spec.trailWidth || this.size * .75;
    }

    update(ctx) {
        super.update(ctx);
        if (this.done) return;
        let dt = ctx.deltaTime;
        // trail
        this.trailSampleTimer -= dt;
        if (this.trailSampleTimer <= 0) {
            this.trailSampleTimer = this.trailSampleTTL;
            this.trailx.unshift(this.x);
            this.traily.unshift(this.y);
            if (this.trailx.length > this.trailLength) {
                this.trailx.pop();
                this.traily.pop();
            }
        }
        for (let i=0; i<this.trailx.length; i++) {
            this.trailx[i] += (this.traildx * dt);
            this.traily[i] += (this.traildy * dt);
        }
        //console.log(`trailx: ${this.trailx}`);
        // update position
        this.x += (this.dx * dt);
        this.y += (this.dy * dt);
        // fade... slowly fade to nothing
        this.fade -= (dt * this.fadeRate);
        this.color.a = this.fade;
    }

    render(ctx, x=0, y=0) {
        if (this.done) return;
        // head
        ctx.beginPath();
        ctx.arc(this.x + x, this.y + y, this.size, 0, Math.PI*2);
        ctx.fillStyle = this.color.toString();
        ctx.fill();
        // trail
        for (let i=0; i<this.trailx.length; i++) {
            ctx.beginPath();
            ctx.lineWidth = this.trailWidth;
            ctx.lineCap = 'round';
            if (i===0) {
                ctx.moveTo(this.x, this.y);
            } else {
                ctx.moveTo(this.trailx[i-1], this.traily[i-1]);
            }
            ctx.lineTo(this.trailx[i], this.traily[i]);
            let ao = this.fade - (i*this.fade)/this.trailLength
            ctx.strokeStyle = this.color.asRGB(ao);
            ctx.stroke();
            ctx.closePath();
        }
    }

}

// a spark particle
class SparkParticle extends Particle {
    constructor(spec={}) {
        let ttl = spec.ttl || 1000;
        spec.conditions = Object.assign({ ttl: new TtlCondition({ttl: ttl})}, spec.conditions);
        let ttlPredicate = ((p) => p.conditions.ttl.value );
        spec.donePredicate = (spec.donePredicate) ? ((p) => (spec.donePredicate(p) || ttlPredicate(p))) : ttlPredicate;
        super(spec);
        this.dx = spec.dx || (Math.random() * .1) - .05;
        this.dy = spec.dy || (Math.random() * .1) - .05;
        this.size = spec.size || Math.random() * 3;
        this.color = spec.color || new Color(190,232,251,1);
        this.fade = this.color.a;
        this.fadeRate = this.fade/ttl;
        this.width = spec.width || 1;
        this.emitTTL = spec.emitTTL || 100;
        this.emitTimer = this.emitTTL;
        this.emitCount = spec.emitCount || 1;
        this.group = new ParticleGroup();
        this.emitSpeed = spec.emitSpeed || .05;
        this.emitColor = spec.emitColor || new Color(150,192,201,1);
        this.angle = spec.hasOwnProperty("angle") ? spec.angle : Math.random() * Math.PI * 2;
        this.angleRate = spec.angleRate || (Math.random() > .5) ? .02 : -.02;
        //console.log(`SparkParticle spec: ${Fmt.ofmt(spec)}`);
    }

    update(ctx) {
        super.update(ctx);
        if (this.done) return;
        let dt = ctx.deltaTime;
        // sub-particles
        this.group.update(ctx);
        // update position
        this.x += (this.dx * dt);
        this.y += (this.dy * dt);
        // fade... slowly fade to nothing
        this.fade -= (dt * this.fadeRate);
        this.color.a = this.fade;
        // angle
        this.angle += (this.angleRate * dt);
        if (this.angle > Math.PI*2) this.angle = this.angle - Math.PI*2;
        // emit...
        this.emitTimer -= dt;
        if (this.emitTimer <= 0) {
            this.emitTimer = this.emitTTL;
            let color = this.emitColor.copy();
            color.a = this.fade;
            for (let i=0; i<this.emitCount; i++) {
                let angle = Math.random() * Math.PI*2;
                let p = new FadeTrailParticle({
                    x: this.x,
                    y: this.y,
                    dx: this.dx + Math.cos(angle) * this.emitSpeed,
                    dy: this.dy + Math.sin(angle) * this.emitSpeed,
                    traildx: this.dx,
                    traildy: this.dy,
                    size: this.size * .75,
                    ttl: 500,
                    color: color,
                });
                this.group.add(p);
            }
        }
    }

    render(ctx, x=0, y=0) {
        if (this.done) return;
        //console.log(`SparkParticle render: pos: ${x},${y} this.pos: ${this.x},${this.y}`);
        // sub-particles
        this.group.render(ctx, x, y);
        ctx.translate(this.x+x, this.y+y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.moveTo(-this.size,0);
        ctx.lineTo(this.size,0);
        ctx.moveTo(0,-this.size);
        ctx.lineTo(0,this.size);
        ctx.lineWidth = this.width;
        ctx.strokeStyle = this.color.toString();
        ctx.stroke();
        //ctx.arc(this.x + x, this.y + y, this.size, 0, Math.PI*2);
        //ctx.fillStyle = this.color.toString();
        //ctx.fill();
        ctx.rotate(-this.angle);
        ctx.translate(-(this.x+x), -(this.y+y));
    }

}