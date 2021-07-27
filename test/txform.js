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
        {xxform: {}, minx: -0, miny: -0, maxx: 0, maxy: 0, wminx: 0, wminy: 0,  wmaxx: 0, wmaxy: 0, centerx: 0, centery: 0, wcenterx: 0, wcentery: 0},
        {xxform: {scalex: 2, scaley: 2, dx: 10, dy: 20}, minx: -0, miny: -0, maxx: 0, maxy: 0, wminx: 20, wminy: 40,  wmaxx: 20, wmaxy: 40, centerx: 0, centery: 0, wcenterx: 20, wcentery: 40},
        {xxform: {scalex: 2, scaley: 2, x: 10, y: 20}, minx: -0, miny: -0, maxx: 0, maxy: 0, wminx: 10, wminy: 20,  wmaxx: 10, wmaxy: 20, centerx: 0, centery: 0, wcenterx: 10, wcentery: 20},
        {xxform: {width:16, height: 12}, minx: -8, miny: -6, maxx: 8, maxy: 6, wminx: -8, wminy: -6,  wmaxx: 8, wmaxy: 6, centerx: 0, centery: 0, wcenterx: 0, wcentery: 0},
        {xxform: {origx:0, origy: 0, width:16, height: 12}, 
            minx: -0, miny: -0, centerx: 8, centery: 6, maxx: 16, maxy: 12, 
            wminx: 0, wminy: 0, wcenterx: 8, wcentery: 6, wmaxx: 16, wmaxy: 12, },
        {xxform: {scalex: 2, scaley: 2, origx:0, origy: 0, width:16, height: 12}, 
            minx: -0, miny: -0, centerx: 8, centery: 6, maxx: 16, maxy: 12, 
            wminx: 0, wminy: 0, wcenterx: 16, wcentery: 12, wmaxx: 32, wmaxy: 24, },
        {xxform: {dx: 10, dy: 20, scalex: 2, scaley: 2, origx:0, origy: 0, width:16, height: 12}, 
            minx: -0, miny: -0, centerx: 8, centery: 6, maxx: 16, maxy: 12, 
            wminx: 20, wminy: 40, wcenterx: 36, wcentery: 52, wmaxx: 52, wmaxy: 64, },
        {xxform: {dx: 10, dy: 20, width:16, height: 12}, 
            minx: -8, miny: -6, centerx: 0, centery: 0, maxx: 8, maxy: 6, 
            wminx: 2, wminy: 14, wcenterx: 10, wcentery: 20, wmaxx: 18, wmaxy: 26, },
        {xxform: {dx: 166, dy: 0, width:54, height: 0, x: 27, y: 0, origx:0, scalex: 2}, 
            minx: -0, miny: -0, centerx: 27, centery: 0, maxx: 54, maxy: 0, 
            wminx: 359, wminy: 0, wcenterx: 413, wcentery: 0, wmaxx: 467, wmaxy: 0, },
    ]
    for (const test of staticXformTests) {
        it(`static xform of ${Fmt.ofmt(test.xxform)}`, ()=>{
            let xform = new XForm(test.xxform);
            expect(xform.minx).toEqual(test.minx);
            expect(xform.miny).toEqual(test.miny);
            expect(xform.centerx).toEqual(test.centerx);
            expect(xform.centery).toEqual(test.centery);
            expect(xform.maxx).toEqual(test.maxx);
            expect(xform.maxy).toEqual(test.maxy);
            expect(xform.wminx).toEqual(test.wminx);
            expect(xform.wminy).toEqual(test.wminy);
            expect(xform.wcenterx).toEqual(test.wcenterx);
            expect(xform.wcentery).toEqual(test.wcentery);
            expect(xform.wmaxx).toEqual(test.wmaxx);
            expect(xform.wmaxy).toEqual(test.wmaxy);
        });
    }


});