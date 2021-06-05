import { Prng } from "../js/base/prng.js";

describe("PRNG Generator", () => {

    it("can generate determinate random floats", ()=>{
        Prng.seed(101);
        let v1 = Prng.random();
        expect(v1).toEqual(0.0007904628299087871);
        let v2 = Prng.random();
        expect(v2).toEqual(0.28531660212699006);
        Prng.seed(101);
        v1 = Prng.random();
        expect(v1).toEqual(0.0007904628299087871);
        v2 = Prng.random();
        expect(v2).toEqual(0.28531660212699006);
    });

    it("can generate determinate random ints", ()=>{
        Prng.seed(101);
        let v1 = Prng.randomInt();
        expect(v1).toEqual(1697507);
        let v2 = Prng.randomInt();
        expect(v2).toEqual(612712738);
        Prng.seed(101);
        v1 = Prng.randomInt();
        expect(v1).toEqual(1697507);
        v2 = Prng.randomInt();
        expect(v2).toEqual(612712738);
    });

});