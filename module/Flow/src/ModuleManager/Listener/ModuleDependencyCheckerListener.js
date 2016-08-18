export default class ModuleDependencyCheckerListener {
    constructor() {
        this.loaded = new Map();
    }

    __invoke(event) {
        let module = event.getModule();

        if (Reflect.getPrototypeOf(module).hasOwnProperty('getModuleDependencies')) {
            let dependencies = module.getModuleDependencies();

            for (let dependencyModule of dependencies) {
                if (!this.loaded.has(dependencyModule)) {
                    throw new Exception('Module depends on other module');
                }
            }
        }

        this.loaded.set(event.getModuleName(), true);
    }
}