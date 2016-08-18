export default class ListenerOptions {
    constructor(options) {
        this.options = options;
    }

    getModulePaths() {
        return this.options.module_paths;
    }

    setModulePaths(modulePaths) {
        this.options.module_paths = modulePaths;
    }

    getConfigGlobPaths() {

    }

    getConfigStaticPaths() {

    }

    setConfigGlobPaths() {

    }

    setConfigStaticPaths() {

    }

    getExtraConfig() {

    }

    setExtraConfig(extraConfig) {

    }

    getConfigCacheEnabled() {

    }

    setConfigCacheEnabled(enabled) {

    }

    getConfigCacheKey() {

    }

    setConfigCacheKey(configCacheKey) {

    }

    getConfigCacheFile() {

    }

    getCacheDir() {

    }

    setCacheDir(cacheDir) {

    }

    getModuleMapCacheEnabled() {
        return false;
        return this.options.module_map_cache_enabled;
    }

    setModuleMapCacheEnabled() {

    }

    getModuleMapCacheKey() {

    }

    setModuleMapCacheKey() {

    }

    getModuleMapCacheFile() {
        
    }

    getCheckDependencies() {
        return this.checkDependencies;
    }

    setCheckDependencies(checkDependencies) {
        this.checkDependencies = checkDependencies;
    }


    normalizePath() {

    }
}