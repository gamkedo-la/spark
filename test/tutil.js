export { utilSuite };
import { Util } from "../js/util.js";

class test1 {
    data = "test1.data";
    action() {
        return "test1.action";
    }
    get greet() {
        return "test1.greet";
    }
}

class test2 {
    data = "test2.data";
    action() {
        return "test2.action";
    }
    get farewell() {
        return "test2.farewell";
    }
}

let utilSuite = describe("utilities", () => {

    it("can mixin class instances to plain object", ()=>{
        let target = {};
        Util.mixin(target, new test1());
        Util.mixin(target, new test2());
        expect(target.data).toEqual("test2.data");
        expect(target.greet).toEqual("test1.greet");
        expect(target.action()).toEqual("test2.action");
        expect(target.farewell).toEqual("test2.farewell");
    });

    it("can mixin class instances to class object with no overrides", ()=>{
        let target = new test1();
        Util.mixin(target, new test2(), false);
        expect(target.data).toEqual("test1.data");
        expect(target.greet).toEqual("test1.greet");
        expect(target.action()).toEqual("test1.action");
        expect(target.farewell).toEqual("test2.farewell");
    });

    it("can mixin class instances to class object with excludes", ()=>{
        let target = new test1();
        Util.mixin(target, new test2(), true, ["action"]);
        expect(target.data).toEqual("test2.data");
        expect(target.greet).toEqual("test1.greet");
        expect(target.action()).toEqual("test1.action");
        expect(target.farewell).toEqual("test2.farewell");
    });

});