export { Direction };

import { Config } from "./config.js";

class Direction {
    static none =           0;
    static north =          1;
    static northEast =      2;
    static east =           4;
    static southEast =      8;
    static south =          16;
    static southWest =      32;
    static west =           64;
    static northWest =      128;
    static cardinal =       Direction.north|Direction.south|Direction.east|Direction.west;
    static diagonal =       Direction.northWest|Direction.southWest|Direction.northEast|Direction.soutEast;

    static all = [
        this.north,
        this.northEast,
        this.east,
        this.southEast,
        this.south,
        this.southWest,
        this.west,
        this.northWest,
    ]
    static strMap = {
        [this.north]:       "north",
        [this.northEast]:   "northEast",
        [this.east]:        "east",
        [this.southEast]:   "southEast",
        [this.south]:       "south",
        [this.southWest]:   "southWest",
        [this.west]:        "west",
        [this.northWest]:   "northWest",
    };

    static cardinals = [
        this.north,
        this.east,
        this.south,
        this.west,
    ];

    static diagonals = [
        this.northEast,
        this.southEast,
        this.southWest,
        this.northWest,
    ];

    static composites = {
        [this.northWest]: this.north|this.west,
        [this.northEast]: this.north|this.east,
        [this.southWest]: this.south|this.west,
        [this.southEast]: this.south|this.east,
    };

    static toString(dir) {
        return this.strMap[dir] || "invalid";
    }

    // kinds should be cardinals, diagonals, or all
    static nextInRotation(kinds, current, clockwise=true) {
        let idx = kinds.indexOf(current);
        if (idx === -1) return current;
        if (clockwise) {
            idx = (idx+1)%kinds.length;
            return kinds[idx];
        } else {
            idx = (kinds.length + idx - 1) % kinds.length;
            return kinds[idx];
        }
    }

    static fromHeading(heading) {
        if (heading >= -Math.PI*.70 && heading < -Math.PI*.3) {
            return this.north;
        } else if (heading >= -Math.PI*.3 && heading < Math.PI*.3) {
            return this.east;
        } else if (heading >= Math.PI*.3 && heading < Math.PI*.7) {
            return this.south;
        } else {
            return this.west;
        }
    }

    static asHeading(dir) {
        switch (dir) {
        case this.north:
            return -Math.PI*.5;
        case this.south:
            return Math.PI*.5;
        case this.east:
            return 0;
        case this.west:
            return Math.PI;
        case this.northWest:
            return -Math.PI*.75;
        case this.northEast:
            return -Math.PI*.25;
        case this.southWest:
            return Math.PI*.75;
        case this.southEast:
            return Math.PI*.25;
        }
        return 0;
    }

    static applyToX(x, dir, offset=Config.tileSize) {
        switch(dir) {
        case Direction.west:
        case Direction.northWest:
        case Direction.southWest:
            return x+offset;
        case Direction.east:
        case Direction.northEast:
        case Direction.southEast:
            return x-offset;
        }
        return x;
    }

    static applyToY(y, dir, offset=Config.tileSize) {
        switch(dir) {
        case Direction.north:
        case Direction.northWest:
        case Direction.northEast:
            return y-offset;
        case Direction.south:
        case Direction.southWest:
        case Direction.northWest:
            return y+offset;
        }
        return y;
    }

    static opposite(dir) {
        switch(dir) {
        case Direction.north:
            return Direction.south;
        case Direction.south:
            return Direction.north;
        case Direction.west:
            return Direction.east;
        case Direction.east:
            return Direction.west;
        case Direction.northWest:
            return Direction.southEast;
        case Direction.southEast:
            return Direction.northWest;
        case Direction.northEast:
            return Direction.southWest;
        case Direction.southWest:
            return Direction.northEast;
        }
        return Direction.none;
    }

}