let PhpContainer = require('./PhpContainer');

class PhpContainerFactory
{
    createService() {
        let containerRuntime = require('docker-run');
        let phpContainer = new PhpContainer(containerRuntime);

        return phpContainer;
    }
}


module.exports = PhpContainerFactory;