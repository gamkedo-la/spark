import { Cmp } from "../js/cmp/cmp.js";
import { BoundsCmp } from "../js/cmp/boundsCmp.js";
import { AreaCmp } from "../js/cmp/areaCmp.js";
import { Entity } from "../js/entity.js";
import { Store } from "../js/store.js";
import { Vect } from "../js/vect.js";
import { Fmt } from "../js/fmt.js";
//import { gizmoDeserialize, gizmoFactory } from "../js/gizmoFactory.js";
import { Bounds } from "../js/bounds.js";
import { Registry } from "../js/registry.js";

Registry.init()

let cmpSuite = describe("a component", () => {
    afterEach(() => {
        Store.instance.clear();
    });

    // apply
    let applyTests = [
        {spec: {cls: "PosCmp", pos: new Vect(1,2)}, tag: "pos", xget: new Vect(1,2)},
        {spec: {cls: "SizeCmp", width: 1, height: 2}, tag: "size", xget: new Vect(1,2)},
        {spec: {cls: "AreaCmp", kind: AreaCmp.kinds.roof, name: "testarea"}, tag: "area", xget: jasmine.objectContaining({kind: AreaCmp.kinds.roof, name:"testarea"})},
        {spec: {cls: "ContainerCmp", contentIDs: [999]}, tag: "contents", xget: [999]},
    ]
    for (const test of applyTests) {
        it("can apply " + Fmt.ofmt(test.spec), ()=>{
            let target = new Entity();
            let cmp = Cmp.generate(test.spec);
            target.addCmp(cmp);
            expect(target[test.tag]).toEqual(test.xget);
            //console.log("srlz: " + target.serialize());
        })
    }


    // apply bounds
    it("can apply bounds component", ()=>{
        let target = new Entity({
            cmps: [
                {cls: "PosCmp", pos: new Vect(1,2)},
                {cls: "SizeCmp", width: 1, height: 2},
            ],
        });
        let cmp = new BoundsCmp({});
        cmp.apply(target);
        expect(target.bounds).toEqual(new Bounds(new Vect(1,2), 1, 2));
    })

    // serialize/deserialize
    let serializeTests = [
        {spec: {cls: "PosCmp", pos: new Vect(1,2)}},
        {spec: {cls: "SizeCmp", width: 1, height: 2}},
        {spec: {cls: "BoundsCmp"}},
        {spec: {cls: "AreaCmp", kind: AreaCmp.kinds.roof, name: "testarea"}},
        {spec: {cls: "ContainerCmp", contentIDs: [999]}},
    ]
    for (const test of serializeTests) {
        it("can serialize/regenerate " + Fmt.ofmt(test.spec), ()=>{
            let c1 = Cmp.generate(test.spec);
            console.log("c1: " + c1);
            let srlz = c1.serialize();
            //console.log("srlz: " + srlz);
            let c2 = Cmp.fromSerial(srlz);
            expect(c2).toEqual(c1);
        })
    }

});