let PhpUnitGenerator = require('./PhpUnitGenerator');

class PhpUnitGeneratorFactory {
    createService(serviceContainer) {
        let finder = serviceContainer.get('Finder');
        let config = serviceContainer.get('Config');

        return new PhpUnitGenerator(finder, config);
    }
}


module.exports = PhpUnitGeneratorFactory;