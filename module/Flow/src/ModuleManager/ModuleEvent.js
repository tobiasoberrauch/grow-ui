import Event from "../EventManager/Event";

export default class ModuleEvent extends Event {
    getModuleName() {
        return this.moduleName;
    }

    setModuleName(moduleName) {
        if (typeof moduleName !== 'string') {
            throw new InvalidArgumentException();
        }

        this.moduleName = moduleName;

        return this;
    }

    getModule() {
        return this.module;
    }

    setModule(module) {
        this.module = module;

        return this;
    }


    getConfigListener() {
        return this.configListener;
    }

    setConfigListener(configListener) {
        this.setParameter('configListener', configListener);
        this.configListener = configListener;

        return this;
    }
}