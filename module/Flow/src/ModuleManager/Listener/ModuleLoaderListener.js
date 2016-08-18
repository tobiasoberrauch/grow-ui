import AbstractListener from "./AbstractListener";
import ModuleAutoLoader from "../../Loader/ModuleAutoLoader";

export default class ModuleLoaderListener extends AbstractListener {
    constructor(options = null) {
        super(options);

        this.generateCache = this.options.getModuleMapCacheEnabled();
        this.moduleLoader = new ModuleAutoLoader(this.options.getModulePaths());
        this.callbacks = new Set();

        if (this.hasCachedClassMap()) {
            this.generateCache = false;
            this.moduleLoader.setModuleClassMap(this.getCachedConfig());
        }
    }

    attach(eventManager) {
        this.callbacks.add(eventManager.attach(
            'loadModules',
            [this.moduleLoader, 'register'],
            9000
        ));

        if (this.generateCache) {
            this.callbacks.add(eventManager.attach(
                'loadModules.post',
                [this, 'onLoadModulesPost']
            ));
        }
    }

    detach(eventManager) {
        for (let callback of this.callbacks) {
            if (eventManager.detach(callback)) {
                this.callbacks.delete(callback);
            }
        }
    }

    hasCachedClassMap() {
        return !!(this.options.getModuleMapCacheEnabled() && this.getCachedConfig());
    }

    getCachedConfig() {
        return this.options.getModuleMapCacheFile();
    }

    onLoadModulesPost(event) {
        this.moduleLoader.unregister();
        
        this.writeArrayToFile(
            this.options.getModuleMapCacheFile(),
            this.moduleLoader.getModuleClassMap()
        );
    }
}