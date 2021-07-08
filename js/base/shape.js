export { Shape };
import { Fmt }              from "./fmt.js";
import { Sketch }           from "./sketch.js";

/** ========================================================================
 * A shape is a simple sketch primitive utilizing js Path2D to render a shape
 */
class Shape extends Sketch {

    // CONSTRUCTOR ---------------------------------------------------------
    constructor(spec={}) {
        super(spec);
        this.borderWidth = spec.borderWidth || 0;
        this.fill = spec.hasOwnProperty("fill") ? spec.fill : true;
        this.color = spec.color || "rgba(127,127,127,1)";
        this.borderColor = spec.borderColor || "black";
        let verts = spec.verts || [{x:0,y:0}, {x:20,y:0}, {x:20,y:20}, {x:0,y:20}];
        let [path, min, max] = this.toPath(verts)
        this.path = path;
        this.dx = -min.x;
        this.dy = -min.y;
        this._width = max.x-min.x;
        this._height = max.y-min.y;
    }

    // METHODS -------------------------------------------------------------
    toPath(verts) {
        let path = new Path2D();
        let min = {x: verts[0].x, y:verts[0].y};
        let max = {x: verts[0].x, y:verts[0].y};
        path.moveTo(verts[0].x, verts[0].y);
        for (let i=1; i<verts.length; i++) {
            let vert = verts[i];
            if (vert.x < min.x) min.x = vert.x;
            if (vert.x > max.x) max.x = vert.x;
            if (vert.y < min.y) min.y = vert.y;
            if (vert.y > max.y) max.y = vert.y;
            path.lineTo(vert.x, vert.y);
        }
        path.closePath();
        return [path, min, max];
    }

    _render(ctx, x=0, y=0) {
        if (x+this.dx || y+this.dy) ctx.translate(x+this.dx, y+this.dy);
        let scalex, scaley;
        if ((this._width && this._height) && (this.width != this._width || this.height != this._height)) {
            scalex = this.width/this._width;
            scaley = this.height/this._height;
            ctx.scale(scalex, scaley);
        }
        if (this.fill) {
            ctx.fillStyle = this.color;
            ctx.fill(this.path);
        }
        if (this.borderWidth) {
            ctx.lineWidth = this.borderWidth;
            ctx.strokeStyle = this.borderColor;
            ctx.stroke(this.path);
        }
        if (scalex || scaley) {
            ctx.scale(1/scalex, 1/scaley);
        }
        if (x+this.dx || y+this.dy) ctx.translate(-(x+this.dx), -(y+this.dy));
    }    
}