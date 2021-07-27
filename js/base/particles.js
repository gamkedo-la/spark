export { Particle, ParticleGroup, ParticleEmitter, TtlCondition };

import { Fmt } from "./fmt.js";
import { Stats } from "./stats.js";

/** ========================================================================
 * The base particle class
 */
class Particle {

    // CONSTRUCTOR ---------------------------------------------------------
    /**
     * Create a new particle
     */
    constructor(spec={}) {
        Stats.count("Particle.new");
        this.x = spec.x || 0;
        this.y = spec.y || 0;
        this.donePredicate = spec.donePredicate || ((p) => false);
        this.conditions = Object.assign({}, spec.conditions);
    }

    // PROPERTIES ----------------------------------------------------------
    get done() {
        return this.donePredicate(this);
    }

    get minx() {
        return this.x;
    }
    get miny() {
        return this.y;
    }
    get maxx() {
        return this.x;
    }
    get maxy() {
        return this.y;
    }

    // METHODS -------------------------------------------------------------
    update(ctx) {
        // update conditions
        for (const condition of Object.values(this.conditions)) {
            condition.update(this, ctx);
        }
    }

    render(ctx, x=0, y=0) {
    }

    toString() { 
        return Fmt.toString(this.constructor.name, this.x, this.y);
    }

}

/** ========================================================================
 * A collection of particles
 */
class ParticleGroup {
    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        this.particles = [];
        this.minx = 0;
        this.miny = 0;
        this.maxx = 0;
        this.maxy = 0;
    }

    // PROPERTIES ----------------------------------------------------------
    get empty() {
        return this.particles.length === 0;
    }

    get width() {
        return this.maxx - this.minx;
    }
    get height() {
        return this.maxy - this.miny;
    }

    // METHODS -------------------------------------------------------------
    /**
     * Add a tracked particle or emitter
     * @param {*} p
     */
    add(p) {
        if (p.minx < this.minx) this.minx = p.minx;
        if (p.miny < this.miny) this.miny = p.miny;
        if (p.maxx > this.maxx) this.maxx = p.maxx;
        if (p.maxy > this.maxy) this.maxy = p.maxy;
        this.particles.push(p);
    }

    /**
     * Remove a particle or emitter from tracked list
     * @param {*} p
     */
    remove(p) {
        let idx = this.particles.indexOf(p);
        if (idx >= 0) this.particles.splice(idx, 1);
    }

    /**
     * Execute the main update thread for all things particles
     */
    update(ctx) {
        this.minx = 0;
        this.miny = 0;
        this.maxx = 0;
        this.maxy = 0;
        // iterate through tracked particles
        for (let i=this.particles.length-1; i>=0; i--) {
            const p = this.particles[i];
            // update each object
            p.update(ctx);
            // if any particles are done, remove them
            if (p.done) {
                this.particles.splice(i, 1);
            } else {
                if (p.minx < this.minx) this.minx = p.minx;
                if (p.miny < this.miny) this.miny = p.miny;
                if (p.maxx > this.maxx) this.maxx = p.maxx;
                if (p.maxy > this.maxy) this.maxy = p.maxy;
            }
        }
    }

    render(ctx, x=0, y=0) {
        for (let i=this.particles.length-1; i>=0; i--) {
            const p = this.particles[i];
            if (p.render) p.render(ctx, x, y);
        }
    }


}

/** ========================================================================
 * A basic particle emitter which calls the specified generator function based on interval
 */
class ParticleEmitter {

    // CONSTRUCTOR ---------------------------------------------------------
    /**
     * Create a new particle emitter
     */
    constructor(spec={}) {
        this.generator = spec.generator || (() => undefined),
        this.group = spec.group;
        this.interval = spec.interval || 1000,
        this.jitter = spec.jitter || 0,
        this.ttl = spec.ttl || 0,
        this.count = spec.count || 1,
        // next time to emit
        this.tte;
        this.gettte();

        this.donePredicate = spec.donePredicate || ((p) => false);
        this.conditions = Object.assign({}, spec.conditions);

    }

    // PROPERTIES ----------------------------------------------------------
    /**
     * Indicates if the emitter has completed its life-cycle (and can be discarded)
     */
    get done() {
        return this.donePredicate(this);
    }

    // METHODS -------------------------------------------------------------
    /**
     * computes new time to emit based on interval and jitter
     */
    gettte() {
        this.tte = this.interval;
        if (this.jitter) {
            let ij = this.jitter * this.interval;
            this.tte += ((Math.random() * ij * 2) - ij);
        }
        if (this.tte < 10) this.tte = 10; // minimum interval;
    }

    /**
     * run generator to emit particle
     */
    emit() {
        for (let i=0; i<this.count; i++) {
            let p = this.generator(this);
            if (this.group) this.group.add(p);
        }
    }

    /**
     * Update the particle emitter.  This is where new particles get generated based on the emitter schedule.
     */
    update(ctx) {
        // don't update if emitter is done
        if (this.done) return;
        if (!this.first) {
            this.first = true;
            this.emit();
        }
        // update conditions
        for (const condition of Object.values(this.conditions)) {
            condition.update(this, ctx);
        }
        // update tte
        this.tte -= ctx.deltaTime;
        // run generator if tte is zero
        if (this.tte <= 0) {
            this.emit();
            // compute next tte
            this.gettte();
        }
    }

}

class TtlCondition {
    constructor(spec={}) {
        this.ttl = spec.ttl || 0;
        this.value = false;
    }

    update(p, ctx) {
        this.ttl -= ctx.deltaTime;
        if (this.ttl <= 0) {
            this.value = true;
        }
    }
}