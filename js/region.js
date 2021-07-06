export { Region };

import { Base }             from "./base/base.js";
import { Config } from "./base/config.js";
import { Fmt }              from "./base/fmt.js";

class Region {

    constructor(spec={}) {
        this.tag = spec.tag || "region";
        this.areas = [];
        this.objs = [];
        this.autoAreas = [];

        //console.log(`region spec: ${Fmt.ofmt(spec)}`);

        let columns = spec.columns || this.columns;
        let rows = spec.rows || this.rows;
        let offx = spec.offx || 0;
        let offy = spec.offy || 0;
        let layers = spec.layers || {}
        let xareas = spec.xareas || [];

        //console.log(` region rows ${rows} columns ${columns}`);

        this.tileSize = spec.tileSize || Config.tileSize;
        this.halfSize = Math.round(this.tileSize * .5);
        this.assets = spec.assets || Base.instance.assets;
        this.generator = spec.generator || Base.instance.generator;
        this.layerMap = spec.layerMap || Level.dfltLayerMap;
        this.depthMap = spec.depthMap || Level.dfltDepthMap;

        let autoArea = spec.hasOwnProperty("autoArea") ? spec.autoArea : false;

        // load areas
        let minx = offx * this.tileSize;
        for (const xarea of xareas) {
            let miny = offy * this.tileSize;
            // update to reflect absolute area position
            xarea.bounds.x += minx;
            xarea.bounds.y += miny;
            let obj = this.generator.generate(xarea);
            this.areas.push(obj);
        }

        // load layer data
        for (const [layerName, layerData] of Object.entries(layers)) {
            let layerId = this.layerMap[layerName];
            // FIXME FIXME FIXME
            let miny = ((offy-layerId)*this.tileSize);
            //let miny = ((offy-layerId)*this.halfSize);
            // handle auto generation of layer data
            if (autoArea) {
                let xarea = {
                    cls: "Area",
                    layer: layerId,
                    tag: `${this.tag}.${layerId}`,
                    links: [], 
                    x: minx,
                    y: miny,
                    width: columns*this.tileSize,
                    height: rows*this.tileSize,
                };
                //console.log("xarea: " + Fmt.ofmt(xarea));
                let area = this.generator.generate(xarea);
                //console.log("area: " + area);
                this.areas.push(area);
                this.autoAreas.push(area);
            }

            for (const [depthName, depthData] of Object.entries(layerData)) {
                let depthId = this.depthMap[depthName];
                for (let i=0; i<columns; i++) {
                    for (let j=0; j<rows; j++) {
                        let idx = i + columns*j;
                        let id = depthData[idx];
                        if (!id) continue;
                        let flags = id[0];
                        let assetId = id.slice(1);
                        let xobj = this.assets.fromId(assetId);
                        if (xobj) {
                            let x = ((i+offx)*this.tileSize) + this.halfSize;
                            let y = ((j+offy-layerId)*this.tileSize) + this.halfSize;
                            xobj = Object.assign({
                                x: x, 
                                y: y, 
                                depth: depthId,
                                layer: layerId,
                            }, xobj);
                            //if (layerId !== 0) console.log("xobj: " + Fmt.ofmt(xobj));
                            let obj = this.generator.generate(xobj);
                            this.objs.push(obj);
                        }
                    }
                }
            }
        }

        // link roof areas
        if (autoArea) {
            for (const area of this.autoAreas) {
                for (const other of this.autoAreas) {
                    if (other.layer > area.layer) {
                        area.links.push(other.tag);
                        //console.log("area: " + area + " roofs: " + area.links);
                    }
                }
            }
        }
    }
}