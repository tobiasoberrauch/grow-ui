export default class AutoLoaderListener {
    __invoke(event) {
        let module = event.getModule();

        if (!this.hasAutoLoaderConfig()) {
            return;
        }

        let autoLoaderConfig = module.getAutoLoaderConfig();
        AutoLoaderFactory.create(autoLoaderConfig);
    }

    hasAutoLoaderConfig(module) {
        return Reflect.getPrototypeOf(module).hasOwnProperty('getAutoLoaderConfig');
    }
}