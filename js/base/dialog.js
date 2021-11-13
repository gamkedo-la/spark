export { Dialog };

    import { Fmt } from "./fmt.js";
import { Text } from "./text.js";

/** ========================================================================
 * Dialog represents an active dialog and any state management associated with it.
 */
class Dialog {

    // CONSTRUCTOR ---------------------------------------------------------
    /**
     * Create a new dialog
     * @param {*} spec 
     *      -- actor
     *      -- dialogs
     *      -- start
     *      -- dfltTitle
     */
    constructor(spec={}) {
        this.actor = spec.actor;
        this.npc = spec.npc;
        this._done = false;
        // parse spec
        if (spec.hasOwnProperty("dialogs") && spec.dialogs) {
            this._dialogs = spec.dialogs;
        } else {
            this._dialogs = {
                start: {
                    text: Text.rlorem,
                    responses: {}
                }
            }
            let num = Math.floor(Math.random() * 3) + 1;
            for (let i=0; i<num; i++) {
                this._dialogs.start.responses[Text.rword] = (d) => d.done = true;
            }
        }
        let startKey = spec.start || "start";
        this._dfltTitle = spec.dfltTitle || "Dialog Title";
        console.log(`dialog spec: ${Fmt.ofmt(spec)}`);
        // setup
        this._currentDialog = {};
        this.load(startKey);
    }

    // PROPERTIES ----------------------------------------------------------
    get done() {
        return this._done;
    }
    set done(v) {
        return this._done = v;
    }

    get title() {
        return this._currentDialog.title || this._dfltTitle;
    }

    get text() {
        return this._currentDialog.text;
    }

    get responses() {
        return Object.keys(this._currentDialog.responses);
    }

    // METHODS -------------------------------------------------------------
    chooseResponse(response) {
        // store dialog response
        this._currentDialog.response = response;
        // execute dialog response function
        let rfcn = this._currentDialog.responses[response];
        if (rfcn) {
            rfcn(this);
        } else {
            this.done = true;
        }
    }

    load(key) {
        let d = this._dialogs[key];
        if (!d) {
            console.error("invalid dialog selection: " + key);
            return;
        }
        this._currentDialog = d;
    }

}