export { LinkSystem };

import { System }               from "./base/system.js";

/**
 * system to manage object links
 */
class LinkSystem extends System {
    cpre(spec) {
        spec.iterateTTL = spec.iterateTTL || 0;
        spec.fixedPredicate = spec.fixedPredicate || ((e) => (e.linkSrcTag || e.linkDstTag));
        super.cpre(spec);
    }
    cpost(spec) {
        super.cpost(spec);
        this.targets = {};
        this.states = {};
    }

    // METHODS -------------------------------------------------------------
    iterate(ctx, e) {
        // handle source link
        if (e.linkSrcTag) {
            if (!e.linkSrcTag in this.states || this.states[e.linkSrcTag] !== e.state) {
                if (this.dbg) console.log(`found link src: ${e} for tag: ${e.linkSrcTag}`);
                this.states[e.linkSrcTag] = e.state;
                // push state updates to links
                let targets = this.targets[e.linkSrcTag] || [];
                for (const target of targets) {
                    target.state = e.state;
                    target.updated = true;
                }
            }
        }
        // handle dest link
        if (e.linkDstTag) {
            let targets = this.targets[e.linkDstTag];
            if (!targets) {
                targets = [];
                this.targets[e.linkDstTag] = targets;
            }
            if (!targets.includes(e)) {
                if (this.dbg) console.log(`found link dst: ${e} for tag: ${e.linkDstTag}`);
                targets.push(e);
                if (e.linkDstTag in this.states) {
                    e.state = this.states[e.linkDstTag];
                }
            }
        }
    }

}