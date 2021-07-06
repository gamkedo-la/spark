import { Vect } from "../js/base/vect.js";
import { XForm } from "../js/base/xform.js";

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

});