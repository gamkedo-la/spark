export { SparkDialog };

class SparkDialog {
    static dialogs = {

        test: {
            dfltTitle: "Clarice",
            dialogs: {
                start: {
                    text: "There you are!  I was beginning to worry, but I see you were successful in your task!  That is a very fine sword, last wielded by Valore to quell the " +
                        "rising darkness near a century ago.  It seems you must follow in your great grandmother's footsteps, for the darkness approaches.",
                    responses: {
                        "What happened?": (d) => d.load("next1"),
                    },
                },
                next1: {
                    text: "Fisherman Godwin was attacked just outside of Dagger's Gate.  Luckily, he was able to make it back to the " +
                        "village and we were able to heal his wounds.  Seek him out in his hut by " +
                        "the river.  Find out as much as you can about the creatures that attacked him.  We must protect our people!",
                    responses: {
                        "Ok": (d) => {
                            d.done = true;
                            //quests.finish("m2");
                            //quests.start("m3");
                        },
                    }
                },
            },
        },
    };

}