export { LinkSystem };

import { System }               from "./base/system.js";

/**
 * system to manage object links
 */
class LinkSystem extends System {
    cpre(spec) {
        spec.iterateTTL = spec.iterateTTL || 200;
        spec.fixedPredicate = spec.fixedPredicate || ((e) => e.srcLinkTag || e.dstLinkTag);
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
        if (e.srcLinkTag) {
            if (!e.srcLinkTag in this.states || this.states[e.gid] !== e.state) {
                this.states[e.srcLinkTag] = e.state;
                // push state updates to links
                targets = this.targets[e.srcLinkTag];
                for (const target of targets) {
                    target.state = e.state;
                    target.updated = true;
                }
            }
        }
        // handle dest link
        if (e.dstLinkTag) {
            if (!e.dstLinkTag in this.targets) {
                this.targets[e.dstLinkTag] = [];
            }
            if (!e in this.targets[e.dstLinkTag]) {
                this.targets[e.dstLinkTag].push(e);
                if (e.dstLinkTag in this.states) {
                    e.state = this.states[e.dstLinkTag];
                }
            }
        }
    }

}