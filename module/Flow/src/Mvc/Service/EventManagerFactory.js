import EventManager from '../../EventManager/EventManager';

export default class {
    createService(serviceLocator) {
        let eventManager = new EventManager();
        eventManager.sharedManager = serviceLocator.get('SharedEventManager');

        return eventManager;
    }
}