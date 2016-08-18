import fs from 'fs';

export default class Finder {
    constructor() {
        this.dir = '';
    }
    static create() {
        return new Finder();
    }
    in(dir) {
        this.dir = dir;

        return this;
    }
    // *[Symbol.iterator]() {
    //     yield* fs.readdirSync(this.dir);
    // }
}