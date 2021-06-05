export { Bindings };

import { Keys } from "./keys.js";

/** ========================================================================
 * Bindings allows for an abstraction of control tags (like up, down, left, right)
 * to be bound to one or more keyboard inputs.
 * - A binding (passed to constructor or bindKeys function looks like {key: <key string>, tag: <tag string>} 
 * - A property is assigned to the bindings object for each tag, referencing that property will return the
 *   key state(s) for that binding.  e.g.: if "up" is bound to "w" and "UpArrow", referencing binding.up will
 *   return if either "w" or "UpArrow" is currently pressed.
 */
class Bindings {

    // STATIC PROPERTIES ---------------------------------------------------
    static get zero() {
        return new Bindings();
    }

    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        // parse spec
        this.input = spec.input || Keys;
        const bindings = spec.bindings || [];
        // initialize
        this.bindings = new Map();
        this.bindKeys(bindings);
    } 

    // METHODS -------------------------------------------------------------
    bindKey(key, tag, input) {
        if (!input) input = this.input;
        // assign get property for tag
        Object.defineProperty(this, tag, {
            configurable: true,
            get: function () {
                return this.get(tag);
            }
        });
        // assign map value for binding
        if (this.bindings.has(tag)) {
            let keyins = this.bindings.get(tag)
            for(const keyin of keyins) {
                if (keyin.key === key && keyin.input === input) return;
            }
            keyins.push({key:key, in:input});
        } else {
            this.bindings.set(tag, [{key:key, in:input}]);
        }
    }

    bindKeys(bindings, input) {
        for (const binding of bindings) {
            this.bindKey(binding.key, binding.tag, input);
        }
    }

    get(tag) {
        let value = 0;
        let keyins = this.bindings.get(tag)
        if (!keyins) return value;
        for (const keyin of keyins) {
            value |= keyin.in.get(keyin.key);
        }
        return value;
    }

    unbindKey(key, tag, input) {
        if (!input) input = this.input;
        let keyins = this.bindings.get(tag)
        if (!keyins) return;
        for (let i=0; i<keyins.length; i++) {
            if (keyins[i].key === key && keyins[i].in === input) {
                keyins.splice(i, 1);
                break;
            }
        }
        if (keyins.length === 0) {
            this.bindings.delete(tag);
            delete this[tag];
        }
    }

}