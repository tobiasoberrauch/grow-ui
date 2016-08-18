import ModuleEvent from "../../ModuleManager/ModuleEvent";
import ModuleManager from "../../Mvc/Service/ModuleManager";
import ListenerOptions from "../../ModuleManager/Listener/ListenerOptions";
import DefaultListenerAggregate from "../../ModuleManager/Listener/DefaultListenerAggregate";


export default class ModuleManagerFactory {
    createService(serviceLocator) {
        if (!serviceLocator.has('ServiceListener')) {
            serviceLocator.setFactory('ServiceListener', 'Flow/Mvc/Service/ServiceListenerFactory');
        }
        let configuration = serviceLocator.get('ApplicationConfig');
        let listenerOptions = new ListenerOptions(configuration.module_listener_options);
        let defaultListeners = new DefaultListenerAggregate(listenerOptions);

        let serviceListener = serviceLocator.get('ServiceListener');
        serviceListener.addServiceManager(
            serviceLocator,
            'service_manager',
            'Flow/ModuleManager/Feature/ServiceProvider',
            'getServiceConfig'
        );

        let events = serviceLocator.get('EventManager');
        events.attach(defaultListeners);
        // events.attach(serviceListener);

        let moduleEvent = new ModuleEvent();
        moduleEvent.setParameter('ServiceManager', serviceLocator);

        let moduleManager = new ModuleManager(configuration.modules, events);
        moduleManager.setEvent(moduleEvent);

        return moduleManager;
    }
}