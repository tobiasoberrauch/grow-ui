import ServiceListener from './ServiceListener';

export default class ServiceListenerFactory {
    createService(serviceLocator) {
        let serviceListener = new ServiceListener();

        return serviceListener;
    }
}