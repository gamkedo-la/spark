import { Vect }             from "../js/base/vect.js";
import { XForm }            from "../js/base/xform.js";
import { Fmt }              from "../js/base/fmt.js";

let suite = describe("an xform", () => {
    let root;
    beforeEach(() => {
        root = new XForm({origx: 0, origy: 0, width: 800, height: 600});
    });

    // getLocal
    let getLocalTests = [
        {xxform: {}, worldPos: new Vect(0,0), xLocal: new Vect(0,0)},
        {xxform: {origx: 0, origy: 0, width: 800, height: 600}, worldPos: new Vect(0,0), xLocal: new Vect(0,0)},
    ]
    for (const test of getLocalTests) {
        it("can get local position from world position " + test.worldPos, ()=>{
            let xform = new XForm(test.xxform);
            const rslt = xform.getLocal(test.worldPos);
            expect(rslt).toEqual(test.xLocal);
        })
    }

    // static transform tests
    let staticXformTests = [
        {xxform: {}, minx: -0, miny: -0, maxx: 0, maxy: 0, wminx: 0, wminy: 0,  wmaxx: 0, wmaxy: 0},
    ]
    for (const test of staticXformTests) {
        it(`static xform of ${Fmt.ofmt(test.xxform)}`, ()=>{
            let xform = new XForm(test.xxform);
            expect(xform.wminx).toEqual(test.wminx);
            expect(xform.wminy).toEqual(test.wminy);
            expect(xform.wmaxx).toEqual(test.wmaxx);
            expect(xform.wmaxy).toEqual(test.wmaxy);
            expect(xform.minx).toEqual(test.minx);
            expect(xform.miny).toEqual(test.miny);
            expect(xform.maxx).toEqual(test.maxx);
            expect(xform.maxy).toEqual(test.maxy);
        });
    }


});