export { Stats };

import { Config }           from "./config.js";
import { Fmt }              from "./fmt.js";

class Stats {
    static kvs = {};
    static elapsed = 0;
    static interval = 1000;
    static last = {};

    static get enabled() {
        return Config.dbg && Config.dbg.Stats;
    }

    static count(key) {
        if (!this.enabled) return;
        if (!this.kvs.hasOwnProperty(key)) this.kvs[key] = 0;
        this.kvs[key]++;
    }

    static get(key) {
        return this.last[key];
    }

    static report() {
        console.log(Fmt.ofmt(this.last));
    }

    static update(ctx) {
        if (!this.enabled) return;
        this.elapsed += ctx.deltaTime;
        if (this.elapsed >= this.interval) {
            this.last = this.kvs;
            this.kvs = {};
            this.report();
            this.elapsed = 0;
        }
    }

}