export { GridView };

import { UxView }           from "./uxView.js";
import { Text }             from "./text.js";
import { Config }           from "./config.js";

class GridView extends UxView {
    cpost(spec={}) {
        super.cpost(spec);
        this.grid = spec.grid;
    }

    get minx() {
        return 0;
    }
    get miny() {
        return 0;
    }
    get maxx() {
        return this.grid.maxx;
    }
    get maxy() {
        return this.grid.maxy;
    }
    get width() {
        return this.maxx-this.minx;
    }
    get height() {
        return this.maxy-this.miny;
    }

    renderGrid(ctx) {
        ctx.strokeStyle = "rgba(255,255,0,.25";
        ctx.lineWidth = 2;
        // vertical
        for (let i=0; i<=this.grid.width; i++) {
            ctx.beginPath()
            ctx.moveTo(i*this.grid.tileSize,0);
            ctx.lineTo(i*this.grid.tileSize,this.grid.maxy);
            ctx.stroke();
        }
        // horizontal
        for (let i=0; i<=this.grid.height; i++) {
            ctx.beginPath()
            ctx.moveTo(0,i*this.grid.tileSize);
            ctx.lineTo(this.grid.maxx,i*this.grid.tileSize);
            ctx.stroke();
        }

    }

    renderIndices(ctx) {
        for (let i=0; i<this.grid.nentries; i++) {
            let x = this.grid.xfromidx(i);
            let y = this.grid.yfromidx(i);
            let text = new Text({text:i.toString(), width: Config.tileSize-2, height: Config.tileSize-2, align: "center", valign: "middle", color: "rgba(255,255,0,.25"});
            text.render(ctx, x+1, y+3);
        }
    }

    _render(ctx) {
        if (!this.grid) return;
        if (!Config.dbgViewGrid) return;
        // grid
        this.renderGrid(ctx);
        this.renderIndices(ctx);
    }
}
