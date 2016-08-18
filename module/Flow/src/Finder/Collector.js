class Collector extends Map {
    getConfig() {
        return this.get('config');
    }

    setConfig(config) {
        this.set('config', config);
    }
}

module.exports = Collector;