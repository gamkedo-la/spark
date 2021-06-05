import { RoData } from "../js/rodata.js";

let roDataSuite = describe("a read only data object", () => {

    it("can expose src attributes", ()=>{
        let src = {
            foo: "hello",
            bar: "world",
        };
        let ro = new RoData(src, {foo: "foo", bar: "bar"});
        expect(ro.foo).toEqual("hello");
        expect(ro.bar).toEqual("world");
    });

    it("can handle undefined attributes", ()=>{
        let src = {
            foo: "hello",
            bar: "world",
        };
        let ro = new RoData(src, {baz: "baz"});
        expect(ro.baz).toEqual(undefined);
        expect(ro.foo).toEqual(undefined);
        expect(ro.bar).toEqual(undefined);
    });

});