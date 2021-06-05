import { Vect } from "../js/vect.js";

let vectSuite = describe("a vector", () => {
    let v;
    beforeEach(() => {
        v = new Vect(1,2);
    });

    // set
    let setTests = [
        {args: [1], xX: 1, xY: 1},
        {args: [2,1], xX: 2, xY: 1},
        {args: [new Vect(2,1)], xX: 2, xY: 1},
    ]
    for (const test of setTests) {
        it("can set " + test.args, ()=>{
            const rslt = v.set(...test.args);
            expect(rslt.x).toBe(test.xX);
            expect(rslt.y).toBe(test.xY);
        })
    }

    // add
    let addTests = [
        {args: [1], xX: 2, xY: 3},
        {args: [1,2], xX: 2, xY: 4},
        {args: [new Vect(1,2)], xX: 2, xY: 4},
    ]
    for (const test of addTests) {
        it("can add " + test.args, ()=>{
            const rslt = v.add(...test.args);
            expect(rslt.x).toBe(test.xX);
            expect(rslt.y).toBe(test.xY);
        })
    }

    // sub
    let subTests = [
        {args: [1], xX: 0, xY: 1},
        {args: [2,1], xX: -1, xY: 1},
        {args: [new Vect(2,1)], xX: -1, xY: 1},
    ]
    for (const test of subTests) {
        it("can subtract " + test.args, ()=>{
            const rslt = v.sub(...test.args);
            expect(rslt.x).toBe(test.xX);
            expect(rslt.y).toBe(test.xY);
        })
    }

    // mult
    let multTests = [
        {args: [2], xX: 2, xY: 4},
        {args: [2,3], xX: 2, xY: 6},
        {args: [new Vect(2,3)], xX: 2, xY: 6},
    ]
    for (const test of multTests) {
        it("can multiply " + test.args, ()=>{
            const rslt = v.mult(...test.args);
            expect(rslt.x).toBe(test.xX);
            expect(rslt.y).toBe(test.xY);
        })
    }

    // div
    let divTests = [
        {args: [2], xX: .5, xY: 1},
        {args: [2,8], xX: .5, xY: .25},
        {args: [new Vect(2,8)], xX: .5, xY: .25},
    ]
    for (const test of divTests) {
        it("can divide " + test.args, ()=>{
            const rslt = v.div(...test.args);
            expect(rslt.x).toBe(test.xX);
            expect(rslt.y).toBe(test.xY);
        })
    }

    // dot
    let dotTests = [
        {args: [2,3], xRslt: 8},
        {args: [new Vect(2,3)], xRslt: 8},
    ]
    for (const test of dotTests) {
        it("can dot product " + test.args, ()=>{
            const rslt = v.dot(...test.args);
            expect(rslt).toBe(test.xRslt);
        })
    }

    // dist
    let distTests = [
        {args: [4,6], xRslt: 5},
        {args: [new Vect(4,6)], xRslt: 5},
    ]
    for (const test of distTests) {
        it("can compute distance to " + test.args, ()=>{
            const rslt = v.dist(...test.args);
            expect(rslt).toBe(test.xRslt);
        })
    }

    // normalize
    let normalizeTests = [
        {args: [new Vect(2,0)], xX: 1, xY: 0},
        {args: [new Vect(0,2)], xX: 0, xY: 1},
    ]
    for (const test of normalizeTests) {
        it("can normalize " + test.args, ()=>{
            v.set(...test.args);
            const rslt = v.normalize();
            expect(rslt.x).toBe(test.xX);
            expect(rslt.y).toBe(test.xY);
        })
    }

    // heading
    let headingTests = [
        {args: [new Vect(1,0)], xRslt: 0},
        {args: [new Vect(1,1)], xRslt: 45},
        {args: [new Vect(0,1)], xRslt: 90},
        {args: [new Vect(-1,1)], xRslt: 135},
        {args: [new Vect(-1,0)], xRslt: 180},
        {args: [new Vect(-1,-1)], xRslt: -135},
        {args: [new Vect(0,-1)], xRslt: -90},
        {args: [new Vect(1,-1)], xRslt: -45},
    ]
    for (const test of headingTests) {
        it("can determine heading of " + test.args, ()=>{
            v.set(...test.args);
            const rslt = v.heading();
            expect(rslt).toBe(test.xRslt);
        })
    }

    // rotate
    let rotateTests = [
        {v: new Vect(1,0), a: 90, xX: 0, xY: 1},
        {v: new Vect(1,0), a: -90, xX: 0, xY: -1},
        {v: new Vect(1,1), a: 90, xX: -1, xY: 1},
    ]
    for (const test of rotateTests) {
        it("can rotate " + test.v + " by: " + test.a, ()=>{
            v.set(test.v);
            const rslt = v.rotate(test.a);
            expect(rslt.x).toBeCloseTo(test.xX);
            expect(rslt.y).toBeCloseTo(test.xY);
        })
    }

    // angle
    let angleTests = [
        {v1: new Vect(1,0), v2: new Vect(1,1), xRslt: 45},
        {v1: new Vect(1,-1), v2: new Vect(1,1), xRslt: 90},
        {v1: new Vect(1,1), v2: new Vect(1,-1), xRslt: -90},
        {v1: new Vect(-1,1), v2: new Vect(-1,-1), xRslt: 90},
        {v1: new Vect(-1,-1), v2: new Vect(-1,1), xRslt: -90},
    ]
    for (const test of angleTests) {
        it("can compute angle between " + test.v1 + " and: " + test.v2, ()=>{
            v.set(test.v1);
            const rslt = v.angle(test.v2);
            expect(rslt).toBeCloseTo(test.xRslt);
        })
    }

    // equals
    let equalsTests = [
        {args: [new Vect(1,2)], xRslt: true},
        {args: [1,2], xRslt: true},
    ]
    for (const test of equalsTests) {
        it("can test equality to " + test.args, ()=>{
            const rslt = v.equals(...test.args);
            expect(rslt).toBe(test.xRslt);
        })
    }


})