export { PlayState };

import { State }            from "./base/state.js";
import { Base }             from "./base/base.js";
import { Keys }             from "./base/keys.js";
import { Util }             from "./base/util.js";
import { Fmt }              from "./base/fmt.js";
import { Config }           from "./base/config.js";
import { LevelNode }        from "./lvlGraph.js";
import { Mouse }            from "./base/mouse.js";
import { Color }            from "./base/color.js";
import { World }            from "./world.js";
import { GridView }         from "./base/gridView.js";
import { Area, AreaView }   from "./base/area.js";
import { ModelView }        from "./modelView.js";
import { Camera }           from "./base/camera.js";
import { Generator }        from "./base/generator.js";
import { UxGloom }          from "./uxGloom.js";
import { Templates }        from "./templates.js";
import { Atts }             from "./base/atts.js";
import { Vect }             from "./base/vect.js";
import { PauseAction }      from "./actions/pause.js";
import { WaitAction, WaitForDialog }       from "./actions/wait.js";
import { ResumeAction }     from "./actions/resume.js";
import { PanToAction }      from "./actions/panTo.js";
import { PowerUpAction }    from "./actions/powerUp.js";
import { UxPanel }          from "./base/uxPanel.js";
import { Font }             from "./base/font.js";
import { Text }             from "./base/text.js";
import { UxDialogCtrl } from "./uxDialog.js";
import { Bounds } from "./base/bounds.js";
import { Hierarchy } from "./base/hierarchy.js";
import { PlaySoundAction } from "./base/action.js";
import { OptionsState } from "./optionsState.js";
import { UxNpcInfo } from "./uxNpcInfo.js";
import { StoryDialogAction, StoryFadeInAction, StoryFadeOutAction, StoryHideAction, StoryShowAction, UxStory } from "./uxStory.js";
import { UxTutorial } from "./uxTutorial.js";
import { CreditsState } from "./creditsState.js";
import { DisableGloomAction, FinishGameAction } from "./actions/finish.js";
import { Morale } from "./morale.js";
import { Event } from "./base/event.js";

class PlayState extends State {
    static startStoryTag = "startStory";
    static endStoryTag = "endStory";
    static startScript = [
        new StoryFadeInAction({xtarget: "actor2"}),
        new StoryDialogAction({speaker: "actor2", "text": "Alette!", ttl: 2000}),
        new StoryFadeInAction({xtarget: "actor1", ttl: 500}),
        new StoryFadeOutAction({xtarget: "actor1", ttl: 700}),
        new StoryDialogAction({speaker: "actor2", "text": "Alette, wake up my dear!", ttl: 2000}),
        new StoryFadeInAction({xtarget: "actor1", ttl: 1000}),
        new StoryDialogAction({speaker: "actor1", "text": "Mom!?! I thought you were...", ttl: 2000}),
        new StoryDialogAction({speaker: "actor2", "text": "Now, now. I know you???re scared, I know none of this makes any sense...", ttl: 2000}),
        new StoryDialogAction({speaker: "actor1", "text": "Of course it doesn???t! I.. I thought you were dead! And you decide to show up now!?!", ttl: 2500}),
        new StoryDialogAction({speaker: "actor2", "text": "Darling, please listen to me. You have a lot of questions, and I can answer them. But you need to be patient. Forgive me, I know it???s been 5 years.", ttl: 4000}),
        new StoryDialogAction({speaker: "actor2", "text": "When you open your eyes, you will land in the world of Innis Fhaolain.", ttl: 3000}),
        new StoryDialogAction({speaker: "actor1", "text": "What why? And wh-what would I have to do there?", ttl: 2500}),
        new StoryDialogAction({speaker: "actor2", "text": "You are there because, well???", ttl: 2000}),
        new StoryDialogAction({speaker: "actor2", "text": "You are my child, my sweetheart. You have no idea how beautiful you are, and how your beauty will pass on to make everyone's lives a little better. To help others...", ttl: 5000}),
        new StoryDialogAction({speaker: "actor1", "text": "I don???t care about any of that Mama!", ttl: 2500}),
        new StoryDialogAction({speaker: "actor1", "text": "Not when you???re not here with me....", ttl: 2500}),
        new StoryDialogAction({speaker: "actor2", "text": "Who said that I wouldn???t be without you? My presence shall bestow upon you powers, but they will be limited. I have gotten old??? even in the afterlife.", ttl: 5000}),
        new StoryDialogAction({speaker: "actor1", "text": "I???ll admit, I do like helping...", ttl: 2500}),
        new StoryDialogAction({speaker: "actor1", "text": "It makes me feel a little better, and the ones around me???", ttl: 2500}),
        new StoryDialogAction({speaker: "actor1", "text": "But how can I make such a difference? How can I help people? After all, I???m just one person???", ttl: 3500}),
        new StoryDialogAction({speaker: "actor2", "text": "You might be surprised at what may happen. Let???s give it a shot and find out.  Alette, there???s no need to fear. I???ll be with you throughout this journey.", ttl: 5000}),
        new StoryDialogAction({speaker: "actor1", "text": "Well then, let???s get started...???", ttl: 2500}),
        new StoryFadeOutAction({xtarget: "overlay", ttl: 3000}),
        new StoryHideAction(),
        new StoryFadeInAction({xtarget: "main", ttl: 3000}),
    ];

    static endScript = [
        new StoryHideAction(),
        new StoryFadeOutAction({xtarget: "main", ttl: 3000}),
        new StoryShowAction(),
        new StoryFadeInAction({xtarget: "actor2"}),
        new StoryFadeInAction({xtarget: "actor1"}),
        new StoryDialogAction({speaker: "actor1", "text": "Mama!", ttl: 2000}),
        new StoryDialogAction({speaker: "actor2", "text": "Yes my dear Alette!", ttl: 2000}),
        new StoryDialogAction({speaker: "actor2", "text": "I am... I am sorry.  Sorry for leaving you.. sorry for sending...", ttl: 3000}),
        new StoryDialogAction({speaker: "actor1", "text": "Please Mama!  No more apologies.  I am just so happy I am able to see you... even if it's just this one last time...", ttl: 5000}),
        new StoryDialogAction({speaker: "actor2", "text": "My darling child... please don't think of it like that.  I am always with you!  And always will be...", ttl: 4000}),
        new StoryDialogAction({speaker: "actor1", "text": "It's OK Mama.  I see now why you sent me.  Why you had me help your friend...", ttl: 4000}),
        new StoryDialogAction({speaker: "actor1", "text": "I know that in your heart, you wanted to help your friend, but that's not why you sent me...", ttl: 4000}),
        new StoryDialogAction({speaker: "actor1", "text": "It was for me... you were worried... worried I may lose myself... like your friend Nessa.", ttl: 4000}),
        new StoryDialogAction({speaker: "actor2", "text": "My little star, how you shine!  We all have our troubles my child that distract us, that can bring us down...", ttl: 5000}),
        new StoryDialogAction({speaker: "actor2", "text": "But we all have it within ourselves to be the light that shines for others as well.", ttl: 4000}),
        new StoryDialogAction({speaker: "actor2", "text": "That light is needed in the world today.  Not because the giver is without their own troubles...", ttl: 4000}),
        new StoryDialogAction({speaker: "actor1", "text": "But because that light that is shone for others also shines on oneself...", ttl: 3000}),
        new StoryDialogAction({speaker: "actor2", "text": "So be the ~~ Spark ~~ my child!", ttl: 3000}),
        new StoryDialogAction({speaker: "actor2", "text": "And remember, I will always love you... and always be with you...", ttl: 3000}),
        new StoryFadeOutAction({xtarget: "actor2", ttl: 1000}),
        new StoryDialogAction({speaker: "actor1", "text": "I will miss you Mama...", ttl: 3000}),
        new StoryDialogAction({speaker: "actor1", "text": "But I will remember...", ttl: 3000}),
        new StoryDialogAction({speaker: "actor1", "text": "Love you too!", ttl: 3000}),
        new StoryFadeOutAction({xtarget: "overlay", ttl: 3000}),
    ];

    static vendorSparkDialog = {
        dfltTitle: "Aodhan",
        dialogs: {
            start: {
                text: "Ah... Thanks a bunch little one, I don't know what you did; my mind seems to be lifted from the gutter!  Is this how it feels to be happy for a change?  And look, the gloom is lifting... well, I guess just for me...",
                responses: {
                    "...": (d) => d.load("diag2"),
                }
            },
            diag2: {
                text: "I'm so sorry, where are my manners, child?  I never did ask your name... Also, I've never seen you around here... where are you from, who are you?  Anywho... you're always welcome here!",
                responses: {
                    "I'm Alette and...": (d) => d.load("diag3"),
                }
            },
            diag3: {
                title: "Alette",
                text: "(Wow... I actually did it!  Did you see that Mom, wherever you are!  Not quite sure why, but it seems my Spark has really made a difference to this man...)",
                responses: {
                    "...": (d) => d.load("diag4"),
                }
            },
            diag4: {
                title: "Aodhan",
                text: "You still there child... you seem a bit, er, distant?",
                responses: {
                    "Sorry, yes?": (d) => d.load("diag5"),
                }
            },
            diag5: {
                title: "Aodhan",
                text: "You have an incredible gift, I know this now.  Thank you so much once again.  I-I do have a request though... if it's not too much trouble?",
                responses: {
                    "A request?": (d) => d.load("diag6"),
                }
            },
            diag6: {
                title: "Aodhan",
                text: "The innkeeper Ciara, a good friend of mine could use some of your help too.  She's been in a foul mood, but I'm sure she'll talk to you.  Maybe you could figure out what's troubling her and help her out?",
                responses: {
                    "...": (d) => d.load("diag7"),
                }
            },
            diag7: {
                title: "Alette",
                text: "(These folks seem nice enough down deep.  But the rest of the town doesn't seem to be doing too well... and it would seem that I'm stuck here until I figure this out...)",
                responses: {
                    "...": (d) => d.load("diag8"),
                }
            },
            diag8: {
                title: "Alette",
                text: "(And I did enjoy helping this man.  I think I could help the others too... and figure things out along the way.)",
                responses: {
                    "I'll see what I can do": (d) => d.done = true,
                }
            },
        }
    };

    static innkeeperSparkDialog = {
        dfltTitle: "Ciara",
        dialogs: {
            start: {
                text: "Oh my dearest darling!  I'm so sorry for doubting you, I don't know what had come over me!  Thank you so much!  It's true what Aodhan says of you, this Spark of yours is something special!",
                responses: {
                    "...": (d) => d.load("arc1"),
                }
            },
            arc1: {
                title: "Alette",
                text: "(Wow, she's cheery all of a sudden.  I do admit, there's a connection here... my Spark, this gloom... but there's something else.  Ciara wasn't affected by my Spark directly.  Yet the gloom still lifted when I helped her?  Maybe that's the connection?)",
                responses: {
                    "...": (d) => d.load("arc1_1"),
                }
            },
            arc1_1: {
                title: "Alette",
                text: "(And yet I'm still here... which must mean... there's still more work to do?  Is that my purpose?  Not sure why these folks can't just get along without me... but maybe a little more help may help lift my own spirits...)",
                responses: {
                    "...": (d) => d.load("arc1_2"),
                }
            },
            arc1_2: {
                title: "Ciara",
                text: "Is something the matter dear?  You were lost there for a moment.  Is there something on your mind?  Does no good bottling it up...",
                responses: {
                    "...": (d) => d.load("arc1_3"),
                }
            },
            arc1_3: {
                title: "Alette",
                text: "(Don't think I'm quite ready to share yet.  I still have some things to think through... Off to the next soul to save I guess...)",
                responses: {
                    "I'm good, thanks!": (d) => d.done = true,
                }
            },
        }
    };

    static gardenerSparkDialog = {
        dfltTitle: "Finn",
        dialogs: {
            start: {
                text: "Hey kid!  Somehow you did it!  The old well springs back to life and my poor legs get a bit of break!  My family has been gardeners here for generations and has always relied on that well to make our gardens grow.  It means so much to me that you did this for me!",
                responses: {
                    "...": (d) => d.load("arc1"),
                }
            },
            arc1: {
                title: "Alette",
                text: "(And there it is again at the mention of family.  I think of my mother and my heart breaks again.  Will I ever stop feeling this way?)",
                responses: {
                    "...": (d) => d.load("arc1_1"),
                }
            },
            arc1_1: {
                title: "Alette",
                text: "(Yet I can't deny it anymore... with every person I help, it does seem like the magic within me grows.  Did you see that mom?  I actually brought life back to this well?  How's that even possible?)",
                responses: {
                    "...": (d) => d.load("arc1_2"),
                }
            },
            arc1_2: {
                title: "Alette",
                text: "(I also can't help but feel connected to these people here.  They have such a gruff exterior but their hearts do seem so warm way down deep.  It's just finding a way to reach them I guess.)",
                responses: {
                    "...": (d) => d.load("arc1_3"),
                }
            },
            arc1_3: {
                title: "Finn",
                text: "Child, I see sadness in your eyes!  Why cry these tears my child?",
                responses: {
                    "...": (d) => d.load("arc1_4"),
                }
            },
            arc1_4: {
                title: "Alette",
                text: "Let's just say I'm a little homesick.  But I think I know may way back now.  Why I'm here.  Is there anyone else on this island that needs help?",
                responses: {
                    "...": (d) => d.load("arc1_5"),
                }
            },
            arc1_5: {
                title: "Finn",
                text: "I think you've helped all that you can reach my child.  The only other soul on this island is Nessa, bless her.  Poor thing has lost her way more than anyone else...",
                responses: {
                    "Where can I find this Nessa?": (d) => d.load("arc1_6"),
                }
            },
            arc1_6: {
                title: "Finn",
                text: "She has set up a hut near the docks.  She is always alone tinkering with something in there or hangs out by her home on the peninsula.  Careful with that one, right?",
                responses: {
                    "...": (d) => d.load("arc1_7"),
                }
            },
            arc1_7: {
                title: "Alette",
                text: "(I wonder what her story is?  For folks here to think she's too far gone, given their state, I am a bit worried to meet her.  But can't hurt to try I guess.)",
                responses: {
                    "Thanks Finn!": (d) => d.done = true,
                }
            },

        }
    };

    static tinkererSparkDialog = {
        dfltTitle: "Nessa",
        dialogs: {
            start: {
                text: "Do you feel that child?  The gloom has lifted.  Your mother... she... she would be so proud of you!",
                responses: {
                    "...": (d) => d.load("arc1"),
                },
            },
            arc1: {
                text: "And you child... you are glowing!  Shimmering... oh... my dear... tell Aine... tell her I love her.  And know this Alette, you will always be welcome here... no go, your mother is calling you...",
                responses: {
                    "...": (d) => d.done = true,
                },
            }
        },

    };

    static actionSketches = {
        "none":         {cls: "Media", tag: "z_action.none", xfitter: { cls: "FitToParent"}, color: new Color(225,0,0,.75)},
        "leave":        {cls: "Media", tag: "z_action.leave", xfitter: { cls: "FitToParent"}, color: new Color(225,0,0,.75)},
        "occupy":       {cls: "Media", tag: "z_action.occupy", xfitter: { cls: "FitToParent"}, color: new Color(225,0,0,.75)},
        "spark":        {cls: "Media", tag: "z_action.spark", xfitter: { cls: "FitToParent"}, color: new Color(225,0,0,.75)},
        "open":         {cls: "Media", tag: "z_action.open", xfitter: { cls: "FitToParent"}, color: new Color(225,0,0,.75)},
        "talk":         {cls: "Media", tag: "z_action.talk", xfitter: { cls: "FitToParent"}, color: new Color(225,0,0,.75)},
    };

    cpre(spec) {
        super.cpre(spec);
        let xlvl = World.xlvl;
        const media = spec.media || Base.instance.media;
        // construct the UI elements
        spec.xvmgr = {
            cls: "LayeredViewMgr",
            //cls: "ViewMgr",
            worldWidth: xlvl.columns * Config.tileSize,
            worldHeight: xlvl.rows * Config.tileSize,
            dbg: true,
        };
        //spec.xview = {};
        spec.xview = {
            cls: "UxCanvas",
            cvsid: "canvas",
            ui: true,
            tag: "cvs.0",
            xchildren: [
                {
                    tag: "daylight.filter",
                    cls: "UxDaylightFilter",
                },
                {
                    cls: "UxPanel",
                    tag: "mainPanel",
                    xsketch: media.get("buttonBlackBg"),
                    xchildren: [
                        {
                            cls: "UxPanel",
                            tag: "zPanel",
                            xxform: {oleft: 40, otop: 40, right: .91, bottom: .885},
                            xtext: {},
                            xsketch: { cls: 'Rect', color: new Color(50,50,50,1), borderWidth: 5, borderColor: new Color(0,0,0,1) },
                        },
                        Templates.playIconButton("menu", { cls: "Media", tag: "topright_icons.options" }, { xxform: {oright: 40, otop: 40, left: .91, bottom: .885}}),

                    ],
                },
                Templates.panel("dbgPanel", {xxform: { left: .8, right: .025, top: .125, bottom: .5 }, xchildren: [
                    Templates.dbgText("coords", "x,y",              { xxform: { top: 0/8, bottom: 1-1/8 }}),
                    Templates.dbgText(null, "1 - hide debug",       { xxform: { top: 1/8, bottom: 1-2/8 }}),
                    Templates.dbgText(null, "2 - show colliders",   { xxform: { top: 2/8, bottom: 1-3/8 }}),
                    Templates.dbgText(null, "3 - show areas",       { xxform: { top: 3/8, bottom: 1-4/8 }}),
                    Templates.dbgText(null, "4 - show grid",        { xxform: { top: 4/8, bottom: 1-5/8 }}),
                    Templates.dbgText(null, "5 - hide night",       { xxform: { top: 5/8, bottom: 1-6/8 }}),
                    Templates.dbgText(null, "6 - hide gloom",       { xxform: { top: 6/8, bottom: 1-7/8 }}),
                    Templates.dbgText(null, "8 - unlock puzzle",    { xxform: { top: 7/8, bottom: 1-8/8 }}),
                ]}),
                Templates.dbgText("pauseText", "paused",       { xxform: { border: .4 }}),
            ],
        };
        spec.xmodel = World.xlvl;
    }


    cpost(spec) {
        super.cpost(spec);
        this.camera = spec.camera || Camera.main;
        //this.camera.dbg = true;

        Util.bind(this, "onKeyDown", "onClicked", "onMenu", "onCloseDialog", "onCloseNpcInfo", "onCloseStory", "onCloseTutorial");
        Keys.evtKeyPressed.listen(this.onKeyDown);
        Mouse.evtClicked.listen(this.onClicked);
        let gridView = new GridView({depth: 10, grid: this.grid, xxform: {scalex: Config.renderScale, scaley: Config.renderScale}});
        this.gloomView = new UxGloom({
            tag: "gloom", 
            depth: 10, 
            xxform: {
                dx: 16*0, 
                dy: 16*0, 
                origx: 0, 
                origy: 0, 
                border: .5, 
                width: 16*this.model.columns, 
                height: 16*this.model.rows, 
                scalex: Config.renderScale, 
                scaley: Config.renderScale
            },
        });
        this.daylightView = this.findFirst(v=>v.tag === "daylight.filter");

        // load level objects
        this.model.load();

        this.xupSketch = Base.instance.media.get("like");
        this.xdownSketch = Base.instance.media.get("dislike");

        // lookup object references
        this.player = this.findFirst(v=>v.tag === "player");
        this.dbgPanel = this.findFirst(v=>v.tag === "dbgPanel");
        this.dbgPanel.visible = false;
        this.pauseText = this.findFirst(v=>v.tag === "pauseText");
        this.pauseText.visible = false;
        this.menuButton = this.findFirst(v=>v.tag === "menu");
        this.vendor = this.findFirst(v=>v.tag === "aodhan");
        this.innkeeper = this.findFirst(v=>v.tag === "ciara");
        this.gardener = this.findFirst(v=>v.tag === "finn");
        this.tinkerer = this.findFirst(v=>v.tag === "nessa");
        this.menuButton.evtClicked.listen(this.onMenu);
        this.zPanel = this.findFirst(v=>v.tag === "zPanel");
        this.coordsText = this.findFirst(v=>v.tag === "coords");
        // hook camera
        if (this.player) this.camera.trackTarget(this.player);
        this.camera.trackWorld(this.model);

        // hook to game events
        this.eventQ = spec.eventQ || Atts.gameEventQ;
        this.actions = [];

        // ui state

        // audio sfxs
        this.grumbles = [
            Generator.generate({cls: "Media", tag: "grumble1"}),
            Generator.generate({cls: "Media", tag: "grumble2"}),
            Generator.generate({cls: "Media", tag: "grumble3"}),
        ];
        this.cheers = [
            Generator.generate({cls: "Media", tag: "cheer1"}),
            Generator.generate({cls: "Media", tag: "cheer2"}),
            Generator.generate({cls: "Media", tag: "cheer3"}),
        ];
        this.pillarActivateSfx = Generator.generate({cls: "Media", tag: "pillarActivation"}),

        // find game objects...
        this.vendorSparkbase = this.findFirst(v=>v.tag === "vhouse.rune" && v.ownerTag === "Aodhan");
        this.vendorSparkbase2 = this.findFirst(v=>v.tag === "floorRelay" && v.ownerTag === "Aodhan");
        this.innkeeperSparkbase = this.findFirst(v=>v.tag === "inn.wall.rune" && v.ownerTag === "Ciara");
        this.fountainBase = this.findFirst(v=>v.tag === "sparkbase.fountain" && v.x === 504 && v.y === 456);
        this.exampleRelay = this.findFirst(v=>v.tag === "relay" && v.x === 632 && v.y === 504);
        this.gardenerSparkbase = this.findFirst(v=>v.tag === "rockRelay" && v.ownerTag === "Finn");
        this.tinkerRune1 = this.findFirst(v=>v.tag === "sparkbase" && v.ownerTag === "Nessa");
        this.tinkerRune2 = this.findFirst(v=>v.tag === "rune.wall" && v.ownerTag === "Nessa");

        // debug mode
        this.clickMode = "path";

    }

    get grid() {
        return this.model.grid;
    }

    get active() {
        return super.active;
    }
    set active(v) {
        if (v !== this._active) {
            if (this.view) this.view.active = v;
            if (this.viewMgr && v) this.viewMgr.renderall = true;
            if (this.daylightView) {
                this.daylightView.visible = v;
            }
            super.active = v;
        }
    }

    onKeyDown(evt) {
        if (!this.view.active) return;
        if (evt.key === "1") {
            this.dbgPanel.visible = !this.dbgPanel.visible;
        }
        if (evt.key === "2") {
            Config.dbg.viewColliders = !Config.dbg.viewColliders;
            this.viewMgr.renderall = true;
        }
        if (evt.key === "3") {
            Config.dbg.viewAreas = !Config.dbg.viewAreas;
            this.viewMgr.renderall = true;
        }
        if (evt.key === "4") {
            Config.dbg.viewGrid = !Config.dbg.viewGrid;
            this.viewMgr.renderall = true;
        }
        if (evt.key === "5") {
            Config.dbg.hideNight = !Config.dbg.hideNight;
            this.viewMgr.renderall = true;
        }
        if (evt.key === "6") {
            Config.dbg.hideGloom = !Config.dbg.hideGloom;
            this.viewMgr.renderall = true;
        }
        if (evt.key === "7") {
            Config.dbg.Stats = !Config.dbg.Stats;
        }
        if (evt.key === "8") {
            if (!this.vendorMoraleMax) {
                this.eventQ.push(new Event("npc.moraleMax", {actor: this.vendor}));
                this.vendor.morale.value = Morale.max;
                this.vendorMoraleMax = true;
            } else if (!this.innkeeperMoraleMax) {
                this.eventQ.push(new Event("npc.moraleMax", {actor: this.innkeeper}));
                this.innkeeper.morale.value = Morale.max;
                this.innkeeperMoraleMax = true;
            } else if (!this.gardenerMoraleMax) {
                this.eventQ.push(new Event("npc.moraleMax", {actor: this.gardener}));
                this.gardener.morale.value = Morale.max;
                this.gardenerMoraleMax = true;
            } else if (!this.tinkererMoraleMax) {
                this.eventQ.push(new Event("npc.moraleMax", {actor: this.tinkerer}));
                this.tinkerer.morale.value = Morale.max;
                this.tinkererMoraleMax = true;
            }
        }
        if (evt.key === "9") {
            switch(this.clickMode) {
            case "check":
                this.clickMode = "path";
                break;
            case "path":
                this.clickMode = "check";
                break;
            }
        }
        if (evt.key === "p") {
            Atts.paused = !Atts.paused;
            this.pauseText.visible = Atts.paused;
        }
        if (evt.key === "m"){      
           Base.instance.audioMgr.muteToggle();
        }
        if (evt.key === "Escape"){      
            this.onMenu();
        }
    }

    checkClickedForCollision(x, y) {
        let target = new LevelNode(x, y, this.player.layer);
        console.log("check collisions for target: " + target);
        let xbounds = new Bounds(target.x-Config.halfSize, target.y-Config.halfSize, Config.tileSize, Config.tileSize);
        for (const other of this.findOverlaps(xbounds, (v) => ((v.collider) && v.layer === this.player.layer))) {
            let overlap = xbounds.overlaps(other.collider);
            console.log(`found collider: ${other} overlap: ${overlap}`);
        }

        // pull up pathfinding system
        let pfsys = Hierarchy.find(Base.instance.systemMgr, (o => o.cls === "PathfindingSystem"));
        let graph = pfsys.lvlGraph;

        // get neighbors of current target
        let neighbors = graph.getNeighbors(target, this.player.collider.blocking);
        for(const n of neighbors) {
            console.log(`==> neighbor: ${n}`);
        }
    }

    pathToClick(x, y) {
        // check for player occupying something...
        if (this.player.occupyId) {
            let interactTarget = this.entities.get(this.player.occupyId);
            if (interactTarget) interactTarget.dointeract(this.player);
        }
        // set up pathfinding
        let target = new LevelNode(x, y, this.player.layer);
        this.player.wantPathTo = target;
    }

    panToClick(x, y) {
        if (this.camera.panTarget) {
            this.camera.stopPan();
            this.camera.center();
        } else {
            let target = new Vect(x,y);
            this.camera.startPan(target);
        }
    }


    onClicked(evt) {
        if (!this.view.active) return;
        if (Atts.paused) return;
        // ignore if within button
        if (this.menuButton.mouseOver) return;
        // ignore if clicking over npc
        if (this.player.view.mouseOver ||
            this.vendor.view.mouseOver || 
            this.innkeeper.view.mouseOver || 
            this.gardener.view.mouseOver) return;
        // create view for target reticle
        let xview = {
            cls: "UxPanel",
            ui: true,
            xsketch: { cls: "Media", tag: "mouseReticle" },
            xxform: { scalex: Config.renderScale, scaley: Config.renderScale, x: evt.x, y: evt.y, width: 16, height: 16 },
            closeOnSketchDone: true,
        };
        let view = Generator.generate(xview);
        //let localMousePos = this.editorPanel.xform.getLocal(new Vect(evt.x, evt.y))
        let x = evt.x + this.camera.minx;
        let y = evt.y + this.camera.miny;
        x = x/Config.renderScale;
        y = y/Config.renderScale;
        switch (this.clickMode) {
            case "check":
                this.checkClickedForCollision(x,y);
                break;
            case "path":
                this.pathToClick(x,y);
                break;
            case "pan":
                this.panToClick(x,y);
                break;
        }
    }

    onGizmoCreate(evt) {
        if (!this.active) return;
        super.onGizmoCreate(evt);
        let gzo = evt.actor;
        if (gzo.cat === "Model") {
            if (this.model) {
                // add to level
                this.model.add(gzo);
                // add view
                this.addView(gzo);
            }
        }
    }

    onMenu(evt) {
        let state = new OptionsState();
        // then the state manager is told to swap the current state (which is the menu state) with the new play state.
        Base.instance.stateMgr.push(state);
        // pause game
        Atts.paused = true;
        // hook destroy event for dialog
        state.evtDestroyed.listen(() => Atts.paused = false);
    }

    onGizmoDestroy(evt) {
        if (!this.active) return;
        super.onGizmoDestroy(evt);
        let gzo = evt.actor;
        if (gzo.cat === "Model") {
            this.model.remove(gzo);
        }
    }

    addView(obj) {
        let view;
        if (obj instanceof(Area)) {
            let xview = {
                area: obj,
                xxform: Object.assign({scalex:Config.renderScale, scaley:Config.renderScale}, obj.xxform),
            }
            view = new AreaView(xview);
        } else {
            let viewCls = obj.viewCls || "ModelView";
            let xview = {
                cls: obj.viewCls || "ModelView",
                xsketch: obj.xsketch,
                wantMouse: obj.hoverable,
                xxform: Object.assign({scalex:Config.renderScale, scaley:Config.renderScale}, obj.xxform),
                model: obj,
            };
            view = Generator.generate(xview);
            obj.view = view;
        }
        // rig model destroy to view destroy
        if (view) obj.evtDestroyed.listen((evt) => view.destroy());
    }

    *findOverlaps(bounds, filter=(v) => true) {
        yield *this.grid.findOverlaps(bounds, filter);
    }

    destroy() {
        if (this.music) this.music.stop();
        Keys.evtKeyPressed.ignore(this.onKeyDown);
        Mouse.evtClicked.ignore(this.onClicked);
        super.destroy();
    }


    updateZPanel(ctx) {
        // determine current action
        let action = Atts.interactAction;
        //// FIXME
        //let action = "spark";
        if (this.lastAction !== action) {
            // update z panel w/ new icon for given action
            let sketch = Generator.generate(PlayState.actionSketches[action]);
            this.zPanel.sketch = sketch;
            this.lastAction = action;
            return true;
        }
        return false;
    }

    updateCoords(ctx) {
        let x = (Mouse.x + this.camera.minx)/Config.renderScale;
        let y = (Mouse.y + this.camera.miny)/Config.renderScale;
        if (this.lastCoordX !== x || this.lastCoordY !== y) {
            this.lastCoordX = x;
            this.lastCoordY = y;
            let node = new LevelNode(x, y, 0);
            this.coordsText.text = `${node.x},${node.y}`;
            return true;
        }
        return false;
    }

    updateCamera(ctx) {
        this.camera.update(ctx);
        return false;
    }

    startMoraleIndicator(target, up=true) {
        // create new indicator
        let dx = target.x*Config.renderScale/2 - this.camera.minx;
        let dy = target.y*Config.renderScale/2 - this.camera.miny;
        let xview = {
            cls: "UxMoraleIndicator",
            ui: true,
            target: target,
            xsketch: (up) ? this.xupSketch: this.xdownSketch,
            ttl: 1000,
            dx: 0,
            dy: -.01,
            getx: () => target.x*Config.renderScale - this.camera.minx,
            gety: () => target.y*Config.renderScale - this.camera.miny,
            xxform: { dx: -16, dy: -50, x: dx, y: dy, scalex: Config.renderScale/2, scaley: Config.renderScale/2 },
        };
        let view = new UxMoraleIndicator(xview);
    }

    genChat(target, msg) {
        // measure text
        let font = new Font({size: 16});
        let size = Text.measure(font, msg);

        let xview = {
            cls: "UxChatBubble",
            ui: true,
            target: target,
            xsketch: { cls: 'Media', tag: "buttonOff.small" },
            ttl: 3000,
            getx: () => target.x*Config.renderScale - this.camera.minx,
            gety: () => target.y*Config.renderScale - this.camera.miny,
            xxform: { width: size.x+10, height: size.y+10, dx: -8, dy: -25, x: target.x*Config.renderScale-this.camera.minx, y: target.y*Config.renderScale-this.camera.miny, scalex: Config.renderScale, scaley: Config.renderScale },
            xchildren: [
                Templates.playText(null, msg, {xxform: {left: .05, right: .05}}),
            ],
        };
        let view = new UxChatBubble(xview);
    }

    genDialog(dialog) {
        // don't start new dialog if dialog is already running
        if (this.currentDialog) return;
        // create new dialog controller
        this.currentDialog = new UxDialogCtrl({dialog: dialog});
        // disable play state ui and mouse clicks
        this.view.active = false;
        // pause game
        Atts.paused = true;
        // hook destroy event for dialog
        this.currentDialog.evtDestroyed.listen(this.onCloseDialog);
    }

    onCloseDialog() {
        // clear dialog
        this.currentDialog = null;
        // re-enable play state
        this.view.active = true;
        // unpause game
        Atts.paused = false;
    }

    genNpcInfo(npc) {
        // don't start new if already running
        if (this.currentNpcInfo) return;
        // create new view
        this.currentNpcInfo = new UxNpcInfo({npc: npc});
        // disable play state ui and mouse clicks
        this.view.active = false;
        // pause game
        Atts.paused = true;
        // hook destroy event for dialog
        this.currentNpcInfo.evtDestroyed.listen(this.onCloseNpcInfo);
    }

    onCloseNpcInfo() {
        // clear npc info
        this.currentNpcInfo = null;
        // re-enable play state
        this.view.active = true;
        // unpause game
        Atts.paused = false;
    }

    genStory(script, tag) {
        // don't start new if already running
        if (this.currentStory) return;
        this.currentStoryTag = tag;
        // create new view
        this.currentStory = new UxStory({script: script});
        // disable play state ui and mouse clicks
        this.view.active = false;
        // pause game
        Atts.paused = true;
        // hook destroy event for dialog
        this.currentStory.evtDestroyed.listen(this.onCloseStory);
    }

    onCloseStory() {
        // clear npc info
        this.currentStory = null;
        // re-enable play state
        this.view.active = true;
        // unpause game
        Atts.paused = false;
        // generate tutorial
        if (this.currentStoryTag === PlayState.startStoryTag) {
            this.genTutorial();
        } else {
            this.eventQ.push(new Event("game.credits"));
        }
    }

    genTutorial() {
        // don't start new if already running
        if (this.currentStory) return;
        // create new view
        this.tutorial = new UxTutorial({state: this});
        // disable play state ui and mouse clicks
        this.view.active = false;
        // pause game
        Atts.paused = true;
        // hook destroy event for dialog
        this.tutorial.evtDestroyed.listen(this.onCloseTutorial);
    }

    onCloseTutorial() {
        // clear npc info
        this.tutorial = null;
        // re-enable play state
        this.view.active = true;
        // unpause game
        Atts.paused = false;
    }

    updateGameEvents(ctx) {
        while (this.eventQ.length) {
            let evt = this.eventQ.shift();
            //console.log(`game event: ${Fmt.ofmt(evt)}`);
            let sfx;
            switch (evt.tag) {
                case "npc.moraleMax":
                    // spark base activation for aodhan
                    if (evt.actor.tag === "aodhan") {
                        // push new actions to queue...
                        this.actions.push(new PauseAction());
                        this.actions.push(new PanToAction({target: this.vendorSparkbase}));
                        this.actions.push(new PlaySoundAction({sfx: this.pillarActivateSfx}));
                        this.actions.push(new PowerUpAction({target: this.vendorSparkbase}));
                        this.actions.push(new WaitAction());
                        this.actions.push(new PanToAction({target: this.vendorSparkbase2}));
                        this.actions.push(new PlaySoundAction({sfx: this.pillarActivateSfx}));
                        this.actions.push(new PowerUpAction({target: this.vendorSparkbase2}));
                        this.actions.push(new WaitAction());
                        this.actions.push(new PanToAction({target: this.vendor}));
                        this.actions.push(new WaitForDialog({xdialog: Object.assign({}, PlayState.vendorSparkDialog, {actor: this.player, npc: this.vendor})}));
                        this.actions.push(new PanToAction({target: this.player}));
                        this.actions.push(new ResumeAction());
                        // update other npc state
                        this.vendor.introDone = true;
                        this.innkeeper.wantIntro = true;
                    } else if (evt.actor.tag === "ciara") {
                        this.actions.push(new PauseAction());
                        this.actions.push(new PanToAction({target: this.innkeeperSparkbase}));
                        this.actions.push(new PlaySoundAction({sfx: this.pillarActivateSfx}));
                        this.actions.push(new PowerUpAction({target: this.innkeeperSparkbase}));
                        this.actions.push(new WaitAction());
                        this.actions.push(new PanToAction({target: this.innkeeper}));
                        this.actions.push(new WaitForDialog({xdialog: Object.assign({}, PlayState.innkeeperSparkDialog, {actor: this.player, npc: this.innkeeper})}));
                        this.actions.push(new PanToAction({target: this.player}));
                        this.actions.push(new ResumeAction());
                        // update other npc state
                        this.innkeeper.introDone = true;
                        this.gardener.wantIntro = true;
                    } else if (evt.actor.tag === "finn") {
                        this.actions.push(new PauseAction());
                        this.actions.push(new PanToAction({target: this.gardenerSparkbase}));
                        this.actions.push(new PlaySoundAction({sfx: this.pillarActivateSfx}));
                        this.actions.push(new PowerUpAction({target: this.gardenerSparkbase}));
                        this.actions.push(new WaitAction());
                        this.actions.push(new PanToAction({target: this.gardener}));
                        this.actions.push(new WaitForDialog({xdialog: Object.assign({}, PlayState.gardenerSparkDialog, {actor: this.player, npc: this.gardener})}));
                        this.actions.push(new PanToAction({target: this.player}));
                        this.actions.push(new ResumeAction());
                        this.gardener.introDone = true;
                        this.tinkerer.wantIntro = true;
                    } else if (evt.actor.tag === "nessa") {
                        this.actions.push(new PauseAction());
                        this.actions.push(new PanToAction({target: this.tinkerRune1}));
                        this.actions.push(new PlaySoundAction({sfx: this.pillarActivateSfx}));
                        this.actions.push(new PowerUpAction({target: this.tinkerRune1}));
                        this.actions.push(new PanToAction({target: this.tinkerRune2}));
                        this.actions.push(new PlaySoundAction({sfx: this.pillarActivateSfx}));
                        this.actions.push(new PowerUpAction({target: this.tinkerRune2}));
                        this.actions.push(new WaitAction());
                        this.actions.push(new DisableGloomAction());
                        this.actions.push(new PanToAction({target: this.tinkerer}));
                        this.actions.push(new WaitForDialog({xdialog: Object.assign({}, PlayState.tinkererSparkDialog, {actor: this.player, npc: this.tinkerer})}));
                        this.actions.push(new PanToAction({target: this.player}));
                        this.actions.push(new FinishGameAction());
                        this.tinkerer.introDone = true;
                    }

                    break;
                case "npc.moraleUp":
                    this.startMoraleIndicator(evt.actor, true);
                    sfx = Util.choose(this.cheers);
                    sfx.play();
                    break;
                case "npc.moraleDown":
                    this.startMoraleIndicator(evt.actor, false);
                    sfx = Util.choose(this.grumbles);
                    sfx.play();
                    break;
                case "npc.chat":
                    this.genChat(evt.actor, evt.msg);
                    break;
                case "npc.dialog":
                    this.genDialog(evt.dialog);
                    break;
                case "npc.click":
                    this.genNpcInfo(evt.actor);
                    break;
                case "game.finish":
                    this.genStory(PlayState.endScript, PlayState.endStoryTag);
                    break;
                case "game.credits":
                    let state = new CreditsState();
                    Base.instance.stateMgr.push(state);
                    break;
            }

        }
        return false;
    }

    firstUpdate(ctx) {
        this.music = Generator.generate(Base.instance.media.get("gameplayMusic"));
        this.music.play();
    }

    iupdate(ctx) {
        if (!this.storyInitialized) {
            this.storyInitialized = true;
            this.genStory(PlayState.startScript, PlayState.startStoryTag);
        }
        if (!this.firstUpdated && Base.instance.audioMgr.resumed) {
            this.firstUpdated = true;
            this.firstUpdate(ctx);
        }
        this.updated = super.iupdate(ctx);
        this.updated |= this.updateZPanel(ctx);
        this.updated |= this.updateCoords(ctx);
        // camera control
        this.updated |= this.updateCamera(ctx);
        // handle game events...
        this.updated |= this.updateGameEvents(ctx);
        return this.updated;
    }

}


class UxMoraleIndicator extends UxPanel {

    // CONSTRUCTOR ---------------------------------------------------------
    cpre(spec) {
        super.cpre(spec);
        if (spec.xsketch && !spec.xsketch.xfitter) spec.xsketch.xfitter = {};
    }
    cpost(spec={}) {
        super.cpost(spec);
        this.target = spec.target || { x: 0, y: 0};
        this.ttl = spec.ttl || 1000;
        this.dx = spec.dx || 0;
        this.dy = spec.dy || 0;
        this.getx = spec.getx || (() => 0);
        this.gety = spec.gety || (() => 0);
    }

    iupdate(ctx) {
        this.updated |= super.iupdate(ctx);
        this.ttl -= ctx.deltaTime;
        if (this.ttl <= 0) {
            this.destroy();
            return true;
        }
        this.xform._offx = this.getx();
        this.xform._offy = this.gety();
        this.xform.dx += (this.dx * ctx.deltaTime);
        this.xform.dy += (this.dy * ctx.deltaTime);
        if (this.dx || this.dy) this.updated = true;
        return this.updated;
    }
}

class UxChatBubble extends UxPanel {

    // CONSTRUCTOR ---------------------------------------------------------
    cpost(spec={}) {
        super.cpost(spec);
        this.target = spec.target || { x: 0, y: 0};
        this.ttl = spec.ttl || 3000;
        this.getx = spec.getx || (() => 0);
        this.gety = spec.gety || (() => 0);
    }

    iupdate(ctx) {
        this.updated |= super.iupdate(ctx);
        this.ttl -= ctx.deltaTime;
        if (this.ttl <= 0) {
            this.destroy();
            return true;
        }
        this.xform._offx = this.getx();
        this.xform._offy = this.gety();
        if (this.dx || this.dy) this.updated = true;
        return this.updated;
    }
}