import { SparkAssets }      from "./sparkAssets.js";
import { SparkRegistry }    from "./registry.js";
import { Templates }        from "./templates.js";
import { Game }             from "./base/game.js";
import { Base }             from "./base/base.js";
import { Keys }             from "./base/keys.js";
import { Mouse }            from "./base/mouse.js";
import { State }            from "./base/state.js";
import { Util }             from "./base/util.js";
import { Fmt }              from "./base/fmt.js";
import { TestFx, SparkFx }  from "./sparkFx.js";
import { Config }           from "./base/config.js";
import { Vect }             from "./base/vect.js";
import { TtlCondition }     from "./base/particles.js";
import { Hierarchy }        from "./base/hierarchy.js";
import { UxView }           from "./base/uxView.js";
import { Generator }        from "./base/generator.js";

class PlayFxView extends UxView {
    cpost(spec) {
        super.cpost(spec);
        this.angle = 0;
        this.angleRate = .001;
        this.color = "white";
        this.size = 2;
    }

    setup() {
        this.centerx = (this.xform.wminx + this.width/2)/Config.renderScale;
        this.centery = (this.xform.wminy + this.height/2)/Config.renderScale;
        this.radius = Math.min(this.centerx, this.centery) * .75;
        this.dotx = this.centerx + Math.cos(this.angle) * this.radius;
        this.doty = this.centery + Math.sin(this.angle) * this.radius;
        console.log(`radius: ${this.radius}`);
        console.log(`center: ${this.centerx},${this.centery}`);
        console.log(`dot: ${this.dotx},${this.doty}`);
        this.addCenterFx("TestFx");
        this.addCirclingFx("SparkFx");
    }

    addCenterFx(cls) {
        if (this.centerFx) this.centerFx.destroy();
        let xfx = {
            cls: cls,
            xxform: {dx: this.centerx, dy: this.centery, scalex: Config.renderScale, scaley: Config.renderScale}, 
            depth: 10,
        }
        this.centerFx = Generator.generate(xfx);
    }

    addCirclingFx(cls) {
        if (this.circlingFx) this.circlingFx.destroy();
        let xfx = {
            cls: cls,
            getx: () => this.dotx,
            gety: () => this.doty,
            //xxform: {origx: 0, origy: 0, dx: this.dotx, dy: this.doty, scalex: Config.renderScale, scaley: Config.renderScale}, 
            xxform: {origx: 0, origy: 0, dx: this.centerx, dy: this.centery, scalex: Config.renderScale, scaley: Config.renderScale}, 
            //xxform: {origx: 0, origy: 0, dx: this.dotx, dy: this.doty, },
            depth: 10,
        }
        this.circlingFx = Generator.generate(xfx);
    }

    iupdate(ctx) {
        if (!this.first) {
            this.first = true;
            this.setup();
            console.log(`parent dim: ${this.parent.xform.width},${this.parent.xform.height}`);
            //this.centerx = (this.xform.wminx + this.width/2)/Config.renderScale;
            //this.centery = (this.xform.wminy + this.height/2)/Config.renderScale;
        }
        //console.log(`model center: ${this.x},${this.y}`);
        this.angle += ctx.deltaTime * this.angleRate;
        if (this.angle > Math.PI*2) this.angle -= Math.PI*2
        this.dotx = this.centerx + Math.cos(this.angle) * this.radius;
        this.doty = this.centery + Math.sin(this.angle) * this.radius;
        //console.log(`dot: ${this.dotx},${this.doty}`);
        return true;
    }

    _render(ctx) {
        ctx.translate(this.xform.minx, this.xform.miny);
        ctx.scale(Config.renderScale, Config.renderScale);
        ctx.beginPath();
        ctx.arc(this.dotx, this.doty, this.size, 0, Math.PI*2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.scale(1/Config.renderScale, 1/Config.renderScale);
        ctx.translate(-this.xform.minx, -this.xform.miny);
    }
}

class ParticlesState extends State {
    cpre(spec) {
        super.cpre(spec);
        spec.xview = {
            cls: "UxCanvas",
            cvsid: "canvas",
            resize: true,
            xchildren: [
                Templates.editorPanel(null, { xxform: {}, xchildren: [
                    Templates.editorPanel("particlePanel", { xxform: {right: .2}, xchildren: [
                        { cls: "PlayFxView" },
                    ]}),
                    Templates.editorPanel("buttonPanel", { xxform: {left: .8}} ),
                ]}),
                //Templates.editorButton("copyButton", "copy", { xxform: { left: .65, right: .25, top: .9, bottom: .05 }}),
                //Templates.editorButton("backButton", "back", { xxform: { left: .75, right: .15, top: .9, bottom: .05 }}),
            ],
        };
    }

    cpost(spec) {
        super.cpost(spec);
        Util.bind(this, "onKeyDown", "onClick");
        Keys.evtKeyPressed.listen(this.onKeyDown);
        Mouse.evtClicked.listen(this.onClick);
        this.particlePanel = Hierarchy.find(this.view, v=>v.tag === "particlePanel");
    }

    onKeyDown(evt) {
        if (!this.active) return;
        console.log("ParticlesState onKeyDown: " + Fmt.ofmt(evt));
    }

    onClick(evt) {
        //if (!this.active) return;
        console.log("ParticlesState onClick: " + Fmt.ofmt(evt));
        let local = new Vect(evt.x/Config.renderScale, evt.y/Config.renderScale);
        let xfx = {
            conditions: { ttl: new TtlCondition({ttl: 1000})},
            donePredicate: ((fx) => fx.conditions.ttl.value ),
            depth: 10,
            xxform: {scalex: Config.renderScale, scaley: Config.renderScale},
            getx: () => local.x,
            gety: () => local.y,
        };
        let fx = new TestFx(xfx);
    }

    destroy() {
        if (this.view) this.view.destroy();
        Keys.evtKeyPressed.ignore(this.onKeyDown);
        Mouse.evtClicked.ignore(this.onClicked);
        super.destroy();
    }

}

/** ========================================================================
 * Main Spark Game Specification and Setup
 */
class Particles extends Game {

    // STATIC METHODS ------------------------------------------------------
    static init() {
        // -- global base init
        Base.init();
        // -- game-dependent registry
        SparkRegistry.init();
        // -- game templates
        Templates.init();
        // -- assets
        SparkAssets.init();
    }

    // CONSTRUCTOR ---------------------------------------------------------
    constructor() {
        // build out game spec
        const spec = { 
            //media: SparkAssets.media, 
            //assets: SparkAssets.assets,
        };
        super(spec);
    }

    // METHODS -------------------------------------------------------------
    setup() {
        super.setup();
        // -- register Spark classes
        SparkRegistry.setup(this.base.registry);
        this.base.registry.add(PlayFxView);
        // -- register systems
        // initialize and start master game state
        let state = new ParticlesState();
        this.base.stateMgr.push(state);
    }

}


/** ========================================================================
 * start the game when page is loaded
 */
window.onload = async function() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    let lastUpdate = Math.round(performance.now());
    let loopID = 0;
    const maxDeltaTime = 1000/20;

    // static initialization of any game global state
    Particles.init();

    // create game
    const game = new Particles();
    // -- load
    await game.load();
    // -- setup
    game.setup()
    // -- start main process loop
    window.requestAnimationFrame(loop);

    function getDeltaTime(hts) {
        const dt = Math.min(maxDeltaTime, hts - lastUpdate);
        lastUpdate = hts;
        return dt;
    }

    function loop(hts) {
        // compute delta time
        let ctx = {
            deltaTime: getDeltaTime(Math.round(hts)),
        }
        game.update(ctx);
        game.render();
        // setup 
        loopID = window.requestAnimationFrame(loop);
    }

    window.Game = game;
}
