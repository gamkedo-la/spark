export { Util };

// =========================================================================
class Util {

    static spliceStr(str, index, count, add) {
        var ar = str.split('');
        ar.splice(index, count, add);
        return ar.join('');
    }

    static colorRect(ctx, x, y, boxWidth, boxHeight, fillColor, alpha=1) {
        let origAlpha = ctx.globalAlpha;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = fillColor;
        ctx.fillRect(x, y, boxWidth, boxHeight);
        ctx.globalAlpha = origAlpha;
    }

    static colorRectOutline(ctx, x, y, boxWidth, boxHeight, fillColor, alpha=1) {
        let origAlpha = ctx.globalAlpha;
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = fillColor;
        ctx.strokeRect(x, y, boxWidth, boxHeight);
        ctx.globalAlpha = origAlpha;
    }

    static loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.addEventListener("load", () => resolve(img));
            img.addEventListener("error", err => reject(err));
            img.src = src;
        });
    }

    static loadJson(src) {
        return new Promise((resolve, reject) => {
            // read json file contents
            let xhr = new XMLHttpRequest();
            xhr.addEventListener("load", () => {
                let obj = JSON.parse(xhr.responseText);
                resolve(obj)
            });
            xhr.addEventListener("error", err => reject(err));
            xhr.open("GET", src, true);
            xhr.setRequestHeader("Cache-Control", "no-store");
            xhr.send();
        });
    }

    static objKeyValue(obj, key, dflt) {
        return (obj && obj.hasOwnProperty(key)) ? obj[key] : dflt;
    }

    static bind(obj, ...names) {
        for (const name of names) {
            obj[name] = obj[name].bind(obj);
        }
    }

    static iterable(obj) {
        if (obj == null) return false;
        if (typeof obj[Symbol.iterator] === 'function') return true;
        return false;
    }

    static empty(obj) {
        if (!obj) return true;
        if (this.iterable(obj)) {
            for (const _ of obj) return false;
            return true;
        }
        if (obj.length) return false;
        return true;
    }

    static arraysEqual(a, b) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length !== b.length) return false;
        for (let i=0; i<a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }

    static arrayContains(array, obj) {
        if (!obj.equals) return false;
        for (const v of array) {
            if (obj.equals(v)) return true;
        }
        return false;
    }

}