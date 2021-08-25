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

class TitleState extends State {
    cpre(spec) {
        super.cpre(spec);
        spec.xview = {
            cls: "UxCanvas",
            cvsid: "canvas",
            //resize: true,
            tag: "cvs.0",
            xchildren: [
                Templates.titleText(null, "Spark", { xxform: { left: .3, right: .3, top: .3, bottom: .55}}),
                Templates.titleText(null, "-- Press Any Key --", { xxform: { left: .3, right: .3, top: .515, bottom: .45}}),
                Templates.titleText(null, "A HomeTeam GameDev Creation", { xxform: { left: .3, right: .3, top: .8, bottom: .175}}),
            ],
        };
    }

    cpost(spec) {
        super.cpost(spec);
        Util.bind(this, "onKeyDown", "onClicked");
        Keys.evtKeyPressed.listen(this.onKeyDown);
        Mouse.evtClicked.listen(this.onClicked)
    }

    onKeyDown(evt) {
        //console.log("titleState onKeyDown: " + Fmt.ofmt(evt));
        if (evt.key === "Escape") {
            let state = new PlayState();
            Base.instance.stateMgr.swap(state);
        } else {}
            let state = new MenuState();
            Base.instance.stateMgr.swap(state);
    }

    onClicked(evt) {
        let state = new MenuState();
        Base.instance.stateMgr.swap(state);
    }

    destroy() {
        Keys.evtKeyPressed.ignore(this.onKeyDown);
        Mouse.evtClicked.ignore(this.onClicked);
        super.destroy();
    }


}
