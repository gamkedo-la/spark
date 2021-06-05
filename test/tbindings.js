export { bindingsSuite };
import { Bindings } from "../js/common/bindings.js";

class TestInput {
    constructor(on) { 
        this.on = on;
    }
    get(key) {
        return (this.on.indexOf(key) != -1) ? 1 : 0;
    }
    toString() {
        return this.on.toString();
    }
}

let bindingsSuite = describe("bindings", () => {
    let b;
    beforeEach(() => {
        b = new Bindings();
    });

    it("can add an input key binding", ()=>{
        let i = new TestInput(["w"]);
        b.bindKey("w", "up", i);
        b.bindKey("s", "down", i);
        expect(b.up).toEqual(1);
        expect(b.get("up")).toEqual(1);
        expect(b.down).toEqual(0);
        expect(b.get("down")).toEqual(0);
    });

    let multiBindTests = [
        {maps: ["w", "up", "ArrowUp", "up"], in: new TestInput(["w"]), xrslt: ["up", 1, "down", 0]},
        {maps: ["w", "up", "ArrowUp", "up"], in: new TestInput(["ArrowUp"]), xrslt: ["up", 1, "down", 0]},
        {maps: ["w", "up", "ArrowUp", "up"], in: new TestInput(["ArrowUp", "w"]), xrslt: ["up", 1, "down", 0]},
        {maps: ["w", "up", "ArrowUp", "up"], in: new TestInput([]), xrslt: ["up", 0, "down", 0]},
    ]
    for (const test of multiBindTests) {
        it("can bind " + test.maps + " w/ input: " + test.in, ()=>{
            for (let i=0; i<test.maps.length; i+=2) {
                b.bindKey(test.maps[i], test.maps[i+1], test.in);
            }
            for (let i=0; i<test.xrslt.length; i+=2) {
                expect(b.get(test.xrslt[i])).toBe(test.xrslt[i+1]);
            }
        })
    }

    it("can add bind multiple keys to same binding", ()=>{
        let i = new TestInput(["w"]);
        b.bindKey("w", "up", i);
        b.bindKey("ArrowUp", "up", i);
        b.bindKey("s", "down", i);
        b.bindKey("ArrowDown", "down", i);
        expect(b.up).toEqual(1);
        expect(b.get("up")).toEqual(1);
        expect(b.down).toEqual(0);
        expect(b.get("down")).toEqual(0);
    });

    it("can remove an input key binding", ()=>{
        let i = new TestInput(["w"]);
        b.bindKey("w", "up", i);
        b.bindKey("s", "down", i);
        expect(b.up).toEqual(1);
        expect(b.get("up")).toEqual(1);
        expect(b.down).toEqual(0);
        expect(b.get("down")).toEqual(0);
        b.unbindKey("s", "down", i);
        expect(b.up).toEqual(1);
        expect(b.down).toEqual(undefined);
        expect(b.get("up")).toEqual(1);
        expect(b.get("down")).toEqual(0);
    });

});