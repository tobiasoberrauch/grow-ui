export default class ModuleAutoLoader {
    constructor(options = null) {
        if (options) {
            this.paths = new Set();
            this.setOptions(options);
        }
    }

    setOptions(options) {
        this.registerPaths(options);

        return this;
    }

    getModuleClassMap() {
    }

    setModuleClassMap(classMap) {
    }

    autoload(className) {
    }

    loadModuleFromDir(dirPath, className) {
    }

    loadModuleFromPhar(pharDir, className) {
    }

    register() {

    }

    unregister() {
    }

    registerPaths(paths) {
        for (let path of paths) {
            this.registerPath(path);
        }
    }

    registerPath(path) {
        this.paths.add(ModuleAutoLoader.normalizePath(path));
    }

    getPaths() {
    }

    pharFileToModuleName() {
    }

    static normalizePath(path) {
        return path;
    }
}