export { AiInfluence, AiGzoInfluence, AiEnvInfluence, AiComboInfluence };

import { Fmt }              from "../fmt.js";
import { Generator }        from "../generator.js";

class AiInfluence {
    static dfltScore = 0;
    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        this.dfltScore = spec.hasOwnProperty("dfltScore") ? spec.dfltScore : AiInfluence.dfltScore;
    }

    // METHODS -------------------------------------------------------------
    score(env, gzo) {
        return this.dfltScore;
    }

    toString() {
        return Fmt.toString(this.constructor.name, this.dfltScore);
    }
}

class AiGzoInfluence extends AiInfluence {
    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        super(spec);
        this.tag = spec.tag || "tag";
        this.scaler = spec.scaler;
    }

    // METHODS -------------------------------------------------------------
    score(env, gzo) {
        if (gzo.hasOwnProperty(this.tag)) {
            let v = gzo[this.tag];
            if (this.scaler) v = this.scaler(v);
            return v;
        }
        return this.dfltScore;
    }

    toString() {
        return Fmt.toString(this.constructor.name, this.tag);
    }
}

class AiEnvInfluence extends AiInfluence {
    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        super(spec);
        this.tag = spec.tag || "tag";
        this.scaler = spec.scaler;
    }

    // METHODS -------------------------------------------------------------
    score(env, gzo) {
        if (env.hasOwnProperty(this.tag)) {
            let v = env[this.tag];
            if (this.scaler) v = this.scaler(v);
            return v;
        }
        return this.dfltScore;
    }

    toString() {
        return Fmt.toString(this.constructor.name, this.tag);
    }
}

class AiComboInfluence extends AiInfluence {
    dfltWeight = 1;
    constructor(spec={}) {
        super(spec);
        this.weights = [];
        this.influences = [];
        this.totalWeight = 0;
        //for (const xinf of spec.xinfluences || []) {
        let xinfluences = spec.xinfluences || [];
        for (const xinf of xinfluences) {
            let weight = xinf.hasOwnProperty("weight") ? xinf.weight : AiComboInfluence.weight;
            let influence = xinf.hasOwnProperty("xinfluence") ? Generator.generate(xinf.xinfluence) : new AiInfluence({score: 1});
            this.totalWeight += weight;
            this.weights.push(weight);
            this.influences.push(influence);
        }
    }

    score(env, gzo) {
        let score = 0;
        if (this.totalWeight === 0) return 0;
        for (let i=0; i<this.weights.length; i++) {
            score += this.weights[i] * this.influences[i].score(env, gzo);
        }
        return score/this.totalWeight;
    }

    toString() {
        return Fmt.toString(this.constructor.name, this.influences);
    }
}