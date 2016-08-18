const Config = require('./Config');
const ServiceManager = require('./ServiceManager');

function toMap(data) {
    let map = new Map();

    if (data == Object(data)) {
        for (let [key, value] of data) {
            map.set(key, value);
        }
    }

    return map;
}

class ServiceManagerConfig extends Config {
    constructor(configuration) {
        let invokables = new Map();
        invokables.set('SharedEventManager', 'Flow/EventManager/SharedEventManager');

        let factories = new Map();
        factories.set('EventManager', 'Flow/Mvc/Service/EventManagerFactory');
        factories.set('ModuleManager', 'Flow/Mvc/Service/ModuleManagerFactory');
        factories.set('ServiceManager', (serviceLocator) => serviceLocator);

        let abstractFactories = new Set();

        let aliases = new Map();
        aliases.set('Flow/EventManager/EventManagerInterface', 'EventManager');
        aliases.set('Flow/ServiceManager/ServiceLocatorInterface', 'ServiceManager');
        aliases.set('Flow/ServiceManager/ServiceManager', 'ServiceManager');

        let shared = new Map();
        shared.set('EventManager', false);


        let delegators = new Map();


        let initializers = new Map();
        initializers.set('EventManagerAwareInitializer', (instance, serviceLocator) => {
            if (instance.hasOwnProperty('getEventManager')) {
                let eventManager = instance.getEventManager();

                if (eventManager.hasOwnProperty('setSharedManager')) {
                    eventManager.setSharedManager(serviceLocator.get('SharedEventManager'));
                } else {
                    eventManager.setEventManager(serviceLocator.get('EventManager'));
                }
            }
        });
        initializers.set('ServiceManagerAwareInitializer', (instance, serviceLocator) => {
            if (serviceLocator instanceof ServiceManager && instance.hasOwnProperty('setServiceManager')) {
                instance.setServiceManager(serviceLocator);
            }
        });
        initializers.set('ServiceLocatorAwareInitializer', (instance, serviceLocator) => {
            if (instance.hasOwnProperty('setServiceLocator')) {
                instance.setServiceLocator(serviceLocator);
            }
        });

        let config = new Map([
            ['invokables', invokables],
            ['factories', factories],
            ['abstract_factories', abstractFactories],
            ['aliases', aliases],
            ['shared', shared],
            ['delegators', delegators],
            ['initializers', initializers]
        ]);

        // @todo: merge with configuration
        super(config);
    }
}

module.exports = ServiceManagerConfig;