export default class OnBootstrapListener {
    __invoke(event) {
        let module = event.getModule();

        if (!Reflect.getPrototypeOf(module).hasOwnProperty('onBootstrap')) {
            return;
        }
        let moduleManager = event.getTarget();
        let eventManager = moduleManager.getEventManager();
        let sharedEvents = eventManager.getSharedManager();

        sharedEvents.attach(
            'Flow/Mvc/Application',
            'bootstrap',
            [module, 'onBootstrap']
        );
    }
}