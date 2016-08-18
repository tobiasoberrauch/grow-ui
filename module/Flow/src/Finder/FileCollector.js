let fs = require('fs');
let Collector = require('./Collector');

class FileCollector extends Collector {
    constructor(fileName) {
        super();

        this.set('fileName', fileName);
    }
    collect() {
        return fs.readFileSync(this.config.rootPath + '/composer.json', 'utf-8');
    }
    getFileName() {
        return this.get('fileName');
    }
}

module.exports = FileCollector;