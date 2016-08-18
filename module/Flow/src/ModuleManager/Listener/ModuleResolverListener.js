import ClassLoader from "../../Loader/ClassLoader";

export default class ModuleResolverListener {
    __invoke(event) {
        let moduleName = event.getModuleName();
        
        return ClassLoader.loadModule(moduleName);
    }
}