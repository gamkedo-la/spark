import { Store } from "../js/store.js";
import { Entity } from "../js/entity.js";
import { Fmt } from "../js/fmt.js";

let StoreSuite = describe("a store", () => {
    afterEach(() => {
        Store.instance.clear();
    });

    it("can add an entity automatically", ()=>{
        let triggers = {
            "added": 0,
            "removed": 0,
        };
        Store.instance.evtAdded.listen( () => { triggers.added++; } );
        Store.instance.evtRemoved.listen( () => triggers.removed++ );
        console.log("triggers: " + Fmt.ofmt(triggers));
        let g = new Entity();
        expect(Store.instance.length).toBe(1);
        expect(triggers.added).toBe(1);
        expect(triggers.removed).toBe(0);
        console.log("triggers: " + Fmt.ofmt(triggers));
        g.destroy();
        expect(triggers.added).toBe(1);
        expect(triggers.removed).toBe(1);
        expect(Store.instance.length).toBe(0);
    });

    it("can find first matching entity", ()=>{
        let g1 = new Entity();
        g1.query = "hello";
        let g2 = new Entity();
        g2.query = "world";
        let match = Store.instance.findFirst((g) => (g.query === "hello"));
        expect(match).toBe(g1);
        Store.instance.clear();
    });

    it("can find multiple matching gizmos", ()=>{
        let g1 = new Entity();
        g1.query = "good";
        let g2 = new Entity();
        g2.query = "bad";
        let g3 = new Entity();
        g3.query = "good";
        let match = Store.instance.findAll((g) => (g.query === "good"));
        expect(match).toContain(g1);
        expect(match).toContain(g3);
        Store.instance.clear();
    });

});