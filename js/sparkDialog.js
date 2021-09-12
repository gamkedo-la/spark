export { SparkDialog };
import { Text } from "./base/text.js";

class SparkDialog {
    static dialogs = {

        test: {
            dfltTitle: "Test NPC Title",
            dialogs: {
                start: {
                    text: Text.rlorem,
                    responses: {
                        "response 1": (d) => d.load("next1"),
                        "response 2": (d) => d.load("next1"),
                    },
                },
                next1: {
                    text: Text.rlorem,
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