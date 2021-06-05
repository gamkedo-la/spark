import { Font } from "../js/font.js";
import { Fmt } from "../js/fmt.js";

let fontSuite = describe("a font", () => {
    let f;
    beforeEach(() => {
        f = new Font();
    });

    let strTests = [
        {spec: {}, xstr: "normal normal normal 12px sans-serif"},
        {spec: {family: "arial"}, xstr: "normal normal normal 12px arial"},
        {spec: {family: "arial", size:24}, xstr: "normal normal normal 24px arial"},
        {spec: {family: "arial", size:24, style:"italic", "variant":"small-caps", "weight":"bold"}, xstr: "italic small-caps bold 24px arial"},
    ]
    for (const test of strTests) {
        it("can convert spec to string: " + Fmt.ofmt(test.spec), ()=>{
            const rslt = new Font(test.spec).toString();
            expect(rslt).toEqual(test.xstr);
        })
    }

    /*
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
    */


})