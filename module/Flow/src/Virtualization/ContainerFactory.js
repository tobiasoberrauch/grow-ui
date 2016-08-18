let Container = require('./Container');

class ContainerFactory
{
    createService(serviceContainer) {
        let containerRunner = require('docker-run');

        return new Container(containerRunner);
    }
}


module.exports = ContainerFactory;