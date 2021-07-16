export { UxGloom };

import { Atts }             from "./base/atts.js";
import { Condition }        from "./base/condition.js";
import { Config }           from "./base/config.js";
import { Store }            from "./base/store.js";
import { UxView }           from "./base/uxView.js";
import { Vect }             from "./base/vect.js";

class UxGloom extends UxView {
    // CONSTRUCTOR ---------------------------------------------------------
    cpre(spec={}) {
        super.cpre(spec);
    }
    cpost(spec={}) {
        super.cpost(spec);
        this.sparkSources = spec.sparkSources || Atts.sparkSources;
        this.trackedSources = new Store();
        this.rebuild = true;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.gloomPct = spec.gloomPct || .9;
    }

    // METHODS -------------------------------------------------------------
    iupdate(ctx) {
        // check if any tracked sources become powered down
        for (const src of this.trackedSources) {
            if (!src.conditions.has(Condition.powered)) {
                this.trackedSources.remove(src.gid);
                this.updated = true;
                this.rebuild = true;
            }
        }
        for (const src of this.sparkSources) {
            if (src.conditions.has(Condition.powered) && !this.trackedSources.contains(src)) {
                this.trackedSources.add(src);
                this.updated = true;
                this.rebuild = true;
            }
        }
        return this.updated;
    }

    _render(ctx) {
        if (Config.dbg.hideGloom) return;
        if (this.rebuild) {
            this.canvas.width = this.xform.width;
            this.canvas.height = this.xform.height;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            // render gloom layer
            this.ctx.fillStyle = `rgba(0,0,0,${this.gloomPct})`;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            // render spark sources as exclusions based on their range (use gradient to smooth edge)
            this.ctx.globalCompositeOperation = "destination-out";
            for (const src of this.trackedSources) {
                this.ctx.beginPath();
                let lpos = this.xform.getLocal(new Vect(src.x*Config.renderScale, src.y*Config.renderScale));
                for (let i=0; i<5; i++) {
                    this.ctx.arc(lpos.x, lpos.y, src.range+((i*2)-6), 0, Math.PI*2);
                    this.ctx.fillStyle = `rgba(255,255,255,${1-(i)/5})`;
                    this.ctx.fill();
                }
            }
            this.ctx.globalCompositeOperation = "source-over";
            this.rebuild = false;
        }
        ctx.globalCompositeOperation = 'saturation';
        ctx.drawImage(this.canvas, this.xform.minx, this.xform.miny);
        ctx.globalCompositeOperation = 'source-over';
    }

}