import { Fmt } from "../js/fmt.js";
import { Vect } from "../js/vect.js";
import { Entity } from "../js/entity.js";
//import { gizmoDeserialize } from "../js/gizmoFactory.js";
import { Store } from "../js/store.js";

let entitySuite = describe("an entity", () => {
    afterEach(() => {
        Store.instance.clear();
    });

    it("can be adopted", ()=>{
        let g1 = new Entity();
        let g2 = new Entity();
        g1.adopt(g2);
        expect(g2.parent).toBe(g1);
        expect(g1.children).toContain(g2);
    });

    it("can be orphaned", ()=>{
        let g1 = new Entity();
        let g2 = new Entity();
        g1.adopt(g2);
        g2.orphan();
        expect(g2.parent).toBeFalsy();
        expect(g1.children).not.toContain(g2);
    });

    it("is orphaned after destroyed", ()=>{
        let g1 = new Entity();
        let g2 = new Entity();
        g1.adopt(g2);
        g2.destroy();
        expect(g2.parent).toBeFalsy();
        expect(g1.children).not.toContain(g2);
    });

    it("is orphaned after parent destroyed", ()=>{
        let g1 = new Entity();
        let g2 = new Entity();
        g1.adopt(g2);
        g1.destroy();
        expect(g2.parent).toBeFalsy();
        expect(g1.children).not.toContain(g2);
    });

    it("cannot create cycle in parent", ()=>{
        let g1 = new Entity();
        let g2 = new Entity();
        let g3 = new Entity();
        g1.adopt(g2);
        g2.adopt(g3);
        g3.adopt(g1);
        expect(g2.parent).toBe(g1);
        expect(g3.parent).toBe(g2);
        expect(g1.parent).toBeFalsy();
    });

    it("cannot create cycle in child", ()=>{
        let g1 = new Entity();
        let g2 = new Entity();
        let g3 = new Entity();
        g1.adopt(g2);
        g2.adopt(g3);
        g1.adopt(g3);
        expect(g2.parent).toBe(g1);
        expect(g3.parent).toBe(g2);
        expect(g1.parent).toBeFalsy();
    });

    it("can be serialized", ()=>{
        let g1 = new Entity({
            cmps: [
                {_kind: "PosCmp", pos: new Vect(1,2)},
            ],
        })
        let srlz = g1.serialize();
        let g2 = Entity.fromSerial(srlz);
        expect(g2).toEqual(g1);
    });

});