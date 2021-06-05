export { colorSuite };
import { Color } from "../js/color.js";

let colorSuite = describe("a color", () => {
    let c;
    beforeEach(() => {
        c = new Color();
    });

    // rgb2hsl
    let rgb2hslTests = [
        {rgb: [0,0,0], hsl: [0,0,0]},
        {rgb: [255,0,0], hsl: [0,100,50]},
        {rgb: [0,255,0], hsl: [120,100,50]},
        {rgb: [0,0,255], hsl: [240,100,50]},
        {rgb: [255,255,0], hsl: [60,100,50]},
        {rgb: [0,255,255], hsl: [180,100,50]},
        {rgb: [255,0,255], hsl: [300,100,50]},
        {rgb: [255,255,255], hsl: [0,0,100]},
        {rgb: [160,151,158], hsl: [313,5,61]},
    ]
    for (const test of rgb2hslTests) {
        it("can set and compute HSL for RGB: " + test.rgb, ()=>{
            c.r = test.rgb[0];
            c.g = test.rgb[1];
            c.b = test.rgb[2];
            const rslt = [c.h, c.s, c.l];
            expect(rslt).toEqual(test.hsl);
        })
    }

    // hsl2rgb
    let hsl2rgbTests = [
        {rgb: [0,0,0], hsl: [0,0,0]},
        {rgb: [255,0,0], hsl: [0,100,50]},
        {rgb: [0,255,0], hsl: [120,100,50]},
        {rgb: [0,0,255], hsl: [240,100,50]},
        {rgb: [255,255,0], hsl: [60,100,50]},
        {rgb: [0,255,255], hsl: [180,100,50]},
        {rgb: [255,0,255], hsl: [300,100,50]},
        {rgb: [255,255,255], hsl: [0,0,100]},
        {rgb: [161,151,158], hsl: [313,5,61]},
    ]
    for (const test of hsl2rgbTests) {
        it("can set and compute HSL for RGB: " + test.hsl, ()=>{
            c.h = test.hsl[0];
            c.s = test.hsl[1];
            c.l = test.hsl[2];
            const rslt = [c.r, c.g, c.b];
            expect(rslt).toEqual(test.rgb);
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