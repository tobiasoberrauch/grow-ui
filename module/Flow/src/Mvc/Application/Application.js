let ServiceManager = require('../../ServiceManager/ServiceManager');
let ServiceManagerConfig = require('../../ServiceManager/ServiceManagerConfig');

class Application {
    static init(configuration) {
        let serviceManagerConfig = configuration.hasOwnProperty('service_manager') ? configuration.service_manager : [];
        let serviceManager = new ServiceManager(new ServiceManagerConfig(serviceManagerConfig));
        serviceManager.setService('ApplicationConfig', configuration);
        serviceManager.get('ModuleManager').loadModules();

        let listenersFromAppConfig = configuration.hasOwnProperty('listeners') ? configuration.listeners : [];
        let config = serviceManager.get('Config');
        let listenersFromConfigService = config.has('listeners') ? config.get('listeners') : [];

        let listeners = listenersFromAppConfig.concat(listenersFromConfigService);

        return serviceManager.get('Application').bootstrap(listeners);
    }

    bootstrap() {
        
    }

    run() {
        console.log('run');
    }
}

module.exports = Application;