import { Bounds } from "../js/base/bounds.js";
import { Vect } from "../js/base/vect.js";

let boundsSuite = describe("a bounds", () => {
    let b;
    beforeEach(() => {
        b = new Bounds(0, 0, 2, 4);
    });

    it("has pos property", ()=>{
        const rslt = b.pos;
        expect(rslt.x).toBe(0);
        expect(rslt.y).toBe(0);
    });

    it("has min property", ()=>{
        const rslt = b.min;
        expect(rslt.x).toBe(0);
        expect(rslt.y).toBe(0);
    });

    it("has max property", ()=>{
        const rslt = b.max;
        expect(rslt.x).toBe(2);
        expect(rslt.y).toBe(4);
    });

    it("has mid property", ()=>{
        const rslt = b.mid;
        expect(rslt.x).toBe(1);
        expect(rslt.y).toBe(2);
    });

    it("has width property", ()=>{
        const rslt = b.width;
        expect(rslt).toBe(2);
    });

    it("has height property", ()=>{
        const rslt = b.height;
        expect(rslt).toBe(4);
    });

    // contains
    let containsTests = [
        {pos: new Vect(1,2), xrslt: true},
        {pos: new Vect(0,0), xrslt: true},
        {pos: new Vect(2,4), xrslt: true},
        {pos: new Vect(-1,3), xrslt: false},
        {pos: new Vect(3,3), xrslt: false},
        {pos: new Vect(1,-1), xrslt: false},
        {pos: new Vect(1,5), xrslt: false},
    ]
    for (const test of containsTests) {
        it("can check contains " + test.pos, ()=>{
            const rslt = b.contains(test.pos);
            expect(rslt).toBe(test.xrslt);
        });
    }

    // overlaps
    let overlapsTests = [
        {other: new Bounds(-2,0, 2, 2), xrslt: false},
        {other: new Bounds(0,0, 2, 2), xrslt: new Bounds(0,0, 2, 2)},
        {other: new Bounds(1,3, 2, 2), xrslt: new Bounds(1,3, 1, 1)},
    ]
    for (const test of overlapsTests) {
        it("can check overlaps " + test.other, ()=>{
            const rslt = b.overlaps(test.other);
            expect(rslt).toEqual(test.xrslt);
        });
    }

    // extends
    let extendTests = [
        {orig: new Bounds(1,1, 1, 1), other: new Bounds(1,1, 1, 1), xrslt: new Bounds(1,1, 1, 1)},
        {orig: new Bounds(159,103, 32, 46), other: new Bounds(160,103, 32, 46), xrslt: new Bounds(159,103, 33, 46)},
    ]
    for (const test of extendTests) {
        it("can extend with " + test.other, ()=>{
            const rslt = test.orig.extend(test.other);
            expect(rslt).toEqual(test.xrslt);
        });
    }

});