export { TitleState };

import { State }            from "./base/state.js";
import { Keys }             from "./base/keys.js";
import { Util }             from "./base/util.js";
import { Fmt }              from "./base/fmt.js";
import { Mouse }            from "./base/mouse.js";
import { Templates }        from "./templates.js";
import { PlayState }        from "./playState.js";
import { MenuState }        from "./menuState.js";
import { Base } from "./base/base.js";

// experimenting with adding pizazz to the title screen:
import { SparkFx }          from "./sparkFx.js";
import { Generator }        from "./base/generator.js";
import { TtlCondition }     from "./base/particles.js";

class TitleState extends State {
    cpre(spec) {
        super.cpre(spec);
        spec.xview = {
            cls: "UxCanvas",
            cvsid: "canvas",
            //resize: true,
            tag: "cvs.0",
            xchildren: [
                // TODO: can we somehow spawn a particle here? or animate in any way?
                // can't figure out how to create new sparkFx() etc
                // how do we access each frame on update()? hmmm
                Templates.panel("titleBG", { xsketch: {cls: "Media", tag: "menuBackground"}, xxform: { top: 0, bottom: 0, left: 0, right: 0}}),
                Templates.titleDark(null, "Spark", { xxform: { left: .301, right: .301, top: .305, bottom: .545}}),
                Templates.titleText(null, "Spark", { xxform: { left: .3, right: .3, top: .3, bottom: .55}}),
                Templates.titleDark(null, "-- Click or Press Any Key --", { xxform: { left: .301, right: .299, top: .516, bottom: .449}}),
                Templates.titleText(null, "-- Click or Press Any Key --", { xxform: { left: .3, right: .3, top: .515, bottom: .45}}),
                Templates.titleDark(null, "A HomeTeam GameDev Creation", { xxform: { left: .301, right: .299, top: .801, bottom: .174}}),
                Templates.titleText(null, "A HomeTeam GameDev Creation", { xxform: { left: .3, right: .3, top: .8, bottom: .175}}),
            ],
        };
    }

    cpost(spec) {
        super.cpost(spec);
        Util.bind(this, "onKeyDown", "onClicked");
        Keys.evtKeyPressed.listen(this.onKeyDown);
        Mouse.evtClicked.listen(this.onClicked);
        // add some particles to the title screen that follow the mouse
        Mouse.evtMoved.listen(this.onMoved);
    }

    onKeyDown(evt) {
        if (evt.key === "Escape") {
            let state = new PlayState();
            Base.instance.stateMgr.swap(state);
        } else {
            let state = new MenuState();
            Base.instance.stateMgr.swap(state);
        }
    }

    onClicked(evt) {
        let state = new MenuState();
        Base.instance.stateMgr.swap(state);
    }

    // sparks follow the mouse
    onMoved(evt) {
        //console.log("title screen mouse moved!");
        //console.log(evt);
        
        // FIXME: these particle emitters NEVER DIE?!?
        let xfx = {
            cls: "SparkFx",
            getx: () => evt.x,
            gety: () => evt.y,
            xxform: {scalex:1, scaley:1}, 
            //count: 1, // no effect
            //lifespan: 0.1, // no effect
            // how to set lifespan?
            conditions: { ttl: new TtlCondition({ttl: 10})}, // no effect
            // how to trigger emitter.done? how to move a single emitter?
            depth: 100
        };
        
        // only create one emitter
        // if (!this.mouseFX) this.mouseFX = Generator.generate(xfx);
        // and move it around. FIXME no effect
        // this.mouseFX.x = evt.x;
        // this.mouseFX.y = evt.x;
        
        // very spammy - they NEVER DIE
        if (Math.random()<0.3) this.mouseFX = Generator.generate(xfx);
        
    }

    destroy() {
        Keys.evtKeyPressed.ignore(this.onKeyDown);
        Mouse.evtClicked.ignore(this.onClicked);
        Mouse.evtMoved.ignore(this.onMoved);
        super.destroy();
    }


}
