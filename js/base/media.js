export { Media };

import { Base } from "./base.js";

class Media {
    constructor(spec) {
        let media = spec.media || Base.instance.media;
        let generator = spec.generator || Base.instance.generator;
        let tag = spec.tag || "tag";
        // strip media tags from media spec
        let xobj = Object.assign({}, spec);
        delete xobj.media;
        delete xobj.generator;
        delete xobj.tag;
        delete xobj.cls;
        Object.assign(xobj, media.get(tag));
        //let xobj = media.get(tag);
        if (xobj) return generator.generate(xobj);
        return undefined;
    }
}