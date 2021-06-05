export { Prng };

/**
 * PRNG and related utility functions
 * Original seed/randint/randfloat functions from: Blixt @ https://gist.github.com/blixt/f17b47c62508be59987b
 */
class Prng {

    static _seed = 1;

    /**
     * Creates a pseudo-random value generator. The seed must be an integer.
     *
     * Uses an optimized version of the Park-Miller PRNG.
     * http://www.firstpr.com.au/dsp/rand31/
     */
    static seed(v) {
        const last = this._seed;
        this._seed = v % 2147483647;
        if (this._seed <= 0) this._seed += 2147483646;
        return last;
    }

    /**
     * Returns a pseudo-random value between 1 and 2^32 - 2.
     */
    static randomInt() {
        return this._seed = this._seed * 16807 % 2147483647;
    }

    static rangeInt(min, max) {
        let v = this.randomInt();
        v %= Math.abs(max-min);
        return v+min;
    }

    static range(min, max) {
        let v = this.random();
        v *= (max-min);
        return v+min;
    }

    static choose(arr) {
        if (!arr || !arr.length) return undefined;
        if (arr.length === 1) return arr[0];
        let choice = this.rangeInt(0,arr.length);
        return arr[choice];
    }

    /**
     * Returns a pseudo-random floating point number in range [0, 1).
     */
    static random() {
        // We know that result of next() will be 1 to 2147483646 (inclusive).
        return (this.randomInt() - 1) / 2147483646;
    };

}