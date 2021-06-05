export { channelSuite, emitterSuite };
import { Channel, Emitter } from "../js/emitter.js";

let channelSuite = describe("a channel", () => {
    let c;
    beforeEach(() => {
        c = new Channel("mychannel", {cdata: "channel data"});
    });

    it("only calls once listeners one time", ()=>{
        let count = 0;
        c.once(() => count++);
        c.trigger({tdata: "hello"});
        expect(count).toEqual(1);
        c.trigger({tdata: "hello"});
        expect(count).toEqual(1);
    });

    it("calls normal listeners multiple times", ()=>{
        let count = 0;
        c.listen(() => count++);
        c.trigger({tdata: "hello"});
        expect(count).toEqual(1);
        c.trigger({tdata: "hello"});
        expect(count).toEqual(2);
    });

    it("can pull channel data from triggered event", ()=>{
        let data;
        c.listen((d) => { data = d.cdata; });
        c.trigger({tdata: "hello"});
        expect(data).toEqual("channel data");
    });

    it("can pull event data from triggered event", ()=>{
        let data;
        c.listen((d) => {data = d.tdata;});
        c.trigger({tdata: "hello"});
        expect(data).toEqual("hello");
    });

    it("can ignore listeners", ()=>{
        let count1 = 0;
        let count2 = 0;
        let f1 = () => count1++;
        let f2 = () => count2++;
        c.listen(f1);
        c.listen(f2);
        c.trigger({tdata: "hello"});
        expect(count1).toEqual(1);
        expect(count2).toEqual(1);
        c.ignore(f1);
        c.trigger({tdata: "hello"});
        expect(count1).toEqual(1);
        expect(count2).toEqual(2);
        c.ignore();
        c.trigger({tdata: "hello"});
        expect(count1).toEqual(1);
        expect(count2).toEqual(2);
    });

});

let emitterSuite = describe("an emitter", () => {
    let e;
    beforeEach(() => {
        e = new Emitter({edata: "emitter data"});
    });

    it("only calls once listeners one time", ()=>{
        let count = 0;
        e.once("update", () => count++);
        e.trigger("update", {tdata: "hello"});
        expect(count).toEqual(1);
        e.trigger("update", {tdata: "hello"});
        expect(count).toEqual(1);
    });

    it("calls normal listeners multiple times", ()=>{
        let count = 0;
        e.listen("update", () => count++);
        e.trigger("update", {tdata: "hello"});
        expect(count).toEqual(1);
        e.trigger("update", {tdata: "hello"});
        expect(count).toEqual(2);
    });

    it("can pull channel data from triggered event", ()=>{
        let data;
        e.listen("update", (d) => {data = d.edata;});
        e.trigger("update", {tdata: "hello"});
        expect(data).toEqual("emitter data");
    });

    it("can pull event data from triggered event", ()=>{
        let data;
        e.listen("update", (d) => {data = d.tdata;});
        e.trigger("update", {tdata: "hello"});
        expect(data).toEqual("hello");
    });

    it("can ignore listeners", ()=>{
        let count1 = 0;
        let count2 = 0;
        let count3 = 0;
        let f1 = () => count1++;
        let f2 = () => count2++;
        let f3 = () => count3++;
        e.listen("update", f1);
        e.listen("update", f2);
        e.listen("change", f3);
        e.broadcast();
        expect(count1).toEqual(1);
        expect(count2).toEqual(1);
        expect(count3).toEqual(1);
        e.ignore("update", f1);
        e.broadcast();
        expect(count1).toEqual(1);
        expect(count2).toEqual(2);
        expect(count3).toEqual(2);
        e.ignore("update");
        e.broadcast();
        expect(count1).toEqual(1);
        expect(count2).toEqual(2);
        expect(count3).toEqual(3);
        e.ignore();
        e.broadcast();
        expect(count1).toEqual(1);
        expect(count2).toEqual(2);
        expect(count3).toEqual(3);
    });

    it("can broadcast w/ filter", ()=>{
        let count1 = 0;
        let count2 = 0;
        let count3 = 0;
        let f1 = () => count1++;
        let f2 = () => count2++;
        let f3 = () => count3++;
        e.listen("frank", f1);
        e.listen("charlie", f2);
        e.listen("chuck", f3);
        e.broadcast({tdata: "hello"}, (evt) => (evt == "frank"));
        expect(count1).toEqual(1);
        expect(count2).toEqual(0);
        expect(count3).toEqual(0);
        e.broadcast({tdata: "hello"}, (evt) => (evt.startsWith("ch")));
        expect(count1).toEqual(1);
        expect(count2).toEqual(1);
        expect(count3).toEqual(1);
    });

    it("can mixin w/ existing object", ()=>{
        let count = 0;
        let obj = {};
        Emitter({edata: "emitter data"}, obj);
        obj.listen("update", () => count++);
        obj.trigger("update", {tdata: "hello"});
        expect(count).toEqual(1);
    });

    it("can handle cascading event", ()=>{
        let t1count = 0;
        let t2count = 0;
        let t3count = 0;
        let t1 = Emitter({edata: "t1"});
        let t2 = Emitter({edata: "t2"});
        let t3 = Emitter({edata: "t3"});
        // setup cascade
        t1.link(t2);
        t2.link(t3);
        t1.listen("update", (evt) => t1count++);
        t2.listen("update", (evt) => t2count++);
        t3.listen("update", (evt) => t3count++);
        t1.trigger("update", {tdata: "hello"});
        expect(t1count).toEqual(1);
        expect(t2count).toEqual(1);
        expect(t3count).toEqual(1);
    });

    it("can handle cascading event w/ no local listener", ()=>{
        let t3count = 0;
        let t1 = Emitter({edata: "t1"});
        let t2 = Emitter({edata: "t2"});
        let t3 = Emitter({edata: "t3"});
        // setup cascade
        t1.link(t2);
        t2.link(t3);
        t3.listen("update", (evt) => t3count++);
        t1.trigger("update", {tdata: "hello"});
        expect(t3count).toEqual(1);
    });


});

