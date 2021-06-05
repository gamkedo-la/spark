export { Mathf };

// =========================================================================
// handy math fcns

class Mathf {
    static clamp(val, min, max) {
        return val > max ? max : val < min ? min : val;
    }

    static clampInt(val, min, max) {
        val = parseInt(val);
        return val > max ? max : val < min ? min : val;
    }

    static floorInt(val, base) {
        return parseInt(val/base);
    }

    static round(val, places) {
        return +(Math.round(val + "e+" + places) + "e-" + places);
    }

    static angle(cx, cy, ex, ey) {
        let dx = ex - cx;
        let dy = ey - cy;
        let theta = Math.atan2(dy, dx);     // range (-PI, PI]
        theta *= 180 / Math.PI;             // rads to degs, range (-180, 180]
        //if (theta < 0) theta = 360 + theta; // range [0, 360)
        return theta;
    }

    static distance(x1, y1, x2, y2) {
        let dx = x2-x1;
        let dy = y2-y1;
        return Math.sqrt(dx*dx + dy*dy);
    }

    static rotatePoint(cx, cy, pX, pY, angle) {
        var dx = pX - cx;
        var dy = pY - cy;
        var mag = Math.sqrt(dx * dx + dy * dy);
        let rads = angle * Math.PI/180;
        let x = mag * Math.cos(rads);
        let y = mag * Math.sin(rads);
        return {x: cx+x, y: cy+y};
    }

    static lerp(min, max, minw, maxw, v) {
        if (max === min) return 0;
        return minw + (maxw-minw) * (v-min)/(max-min);
    }

    static addAvgTerm(terms, avg, newTerm) {
        return (terms*avg + newTerm)/(terms+1);
    }

}