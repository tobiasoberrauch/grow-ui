import fs from "fs";
import AbstractListener from "./AbstractListener";
import Config from "../../Config/Config";

export default class ConfigListener extends AbstractListener {
    constructor(options = null) {
        super(options);

        this.callbacks = new Set();
        this.configs = new Set();
        this.mergedConfig = new Set();
        this.mergedConfigObject = null;
        this.paths = new Set();

        if (this.hasCachedConfig()) {
            this.skipConfig = true;
            this.setMergedConfig(this.getCachedConfig());
        } else {
            this.addConfigGlobPaths(this.getOptions().getConfigGlobPaths());
            this.addConfigStaticPaths(this.getOptions().getConfigStaticPaths());
        }
    }

    attach(events) {
        this.callbacks.add(events.attach('loadModules', [this, 'onLoadModulesPre'], 1000));

        if (this.skipConfig) {
            return this;
        }

        this.callbacks.add(events.attach('loadModule', [this, 'onLoadModule']));
        this.callbacks.add(events.attach('loadModules', [this, 'onLoadModules'], -1000));
        this.callbacks.add(events.attach('mergeConfig', [this, 'onMergeConfig'], 1000));

        return this;
    }

    onLoadModulesPre(event) {
        event.setConfigListener(this);

        return this;
    }

    onLoadModule(event) {
        let module = event.getModule();

        if (!(Reflect.getPrototypeOf(module).hasOwnProperty('getConfig'))) {
            return this;
        }

        this.addConfig(event.getModuleName(), module.getConfig());
    }

    onMergeConfig() {
        for (let path of this.paths) {
            this.addConfigByPath(path.path, path.type);
        }

        let extraConfig = this.getOptions().getExtraConfig();
        this.mergedConfig = extraConfig ? extraConfig : new Set();

        for (let config of this.configs) {
            this.mergedConfig = new Set(...this.mergedConfig, ...config);
        }

        return this;
    }

    onLoadModules(event) {
        // Trigger MERGE_CONFIG event. This is a hook to allow the merged application config to be
        // modified before it is cached (In particular, allows the removal of config keys)
        event.getTarget().getEventManager().trigger('mergeConfig', event);

        if (this.getOptions().getConfigCacheEnabled() && false === this.skipConfig) {
            let configFile = this.getOptions().getConfigCacheFile();
            this.writeToFile(configFile, this.getMergedConfig(false));
        }

        return this;
    }

    detach(events) {
        for (let callback of this.callbacks) {
            if (events.detach(callback)) {
                this.callbacks.delete(callback);
            }
        }
    }

    getMergedConfig(returnConfigAsObject = true) {
        if (returnConfigAsObject) {
            if (null === this.mergedConfigObject) {
                this.mergedConfigObject = new Config(this.mergedConfig);
            }

            return this.mergedConfigObject;
        }

        return this.mergedConfig;
    }

    setMergedConfig(config) {
        this.mergedConfig = config;
        this.mergedConfigObject = null;

        return this;
    }

    addConfigGlobPaths(globalPaths) {
        this.addConfigPaths(globalPaths, 'global_path');

        return this;
    }

    addConfigGlobPath(globalPath) {
        this.addConfigPath(globalPath, 'global_path');

        return this;
    }

    addConfigStaticPaths(staticPaths) {
        this.addConfigPaths(staticPaths, 'static_path');

        return this;
    }

    addConfigStaticPath(staticPath) {
        this.addConfigPath(staticPath, 'static_path');

        return this;
    }

    addConfigPaths(paths, type) {

    }

    addConfigPath(path, type) {

    }

    addConfig(key, config) {

    }

    addConfigByPath(path, type) {

    }

    hasCachedConfig() {
        let options = this.getOptions();

        return !!(options.getConfigCacheEnabled() && fs.exists(options.getConfigCacheFile()));
    }

    getCachedConfig() {
        return require(this.getOptions().getConfigCacheFile());
    }
}