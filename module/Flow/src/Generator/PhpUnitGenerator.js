const fs = require('fs');

class PhpUnitGenerator {
    constructor(finder, config) {
        this.finder = finder;
        this.config = config;
    }
    generate(path) {
        console.log(fs.readdirSync(path));
    }
}


module.exports = PhpUnitGenerator;