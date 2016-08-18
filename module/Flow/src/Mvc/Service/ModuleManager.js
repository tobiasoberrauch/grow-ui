import ModuleEvent from "../../ModuleManager/ModuleEvent";

export default class ModuleManager {
    constructor(modules, eventManager) {
        this.modules = new Set();
        this.eventManager = null;
        this.modulesAreLoaded = false;
        this.moduleCache = new Map();
        this.loadFinished = 0;

        this.setModules(modules);
        this.setEventManager(eventManager);
    }

    setEventManager(eventManager) {
        this.eventManager = eventManager;
        this.attachDefaultListeners();

        return this;
    }

    setModules(modules) {
        this.modules = modules;
    }

    getEventManager() {
        return this.eventManager;
    }

    getModules() {
        return this.modules;
    }

    getModulesLoaded() {
        return this.modulesAreLoaded;
    }

    getEvent() {
        return this.event;
    }

    setEvent(event) {
        this.event = event;
    }

    loadModule(moduleName) {
        if (this.moduleCache.has(moduleName)) {
            return this.moduleCache.get(moduleName);
        }

        let event = new ModuleEvent();
        event.moduleName = moduleName;

        this.loadFinished++;

        let result = this.eventManager.trigger('loadModule.resolve', event, function (result) {
            return (result);
        });

        module = result.last();
        if (!module) {
            throw new RuntimeException();
        }

        event.module = module;

        this.moduleCache.set(moduleName, module);

        this.eventManager.trigger('loadModule', event);

        this.loadFinished++;

        return module;
    }

    loadModules() {
        if (this.modulesLoaded) {
            return this;
        }

        this.eventManager.trigger('loadModules', this.event);
        this.eventManager.trigger('loadModules.post', this.event);

        return this;
    }

    onLoadModules() {
        if (this.modulesLoaded) {
            return this;
        }

        for (let moduleName of this.modules) {
            this.loadModule(moduleName);
        }

        this.modulesLoaded = true;
    }

    attachDefaultListeners() {
        this.eventManager.attach('loadModules', [this, 'onLoadModules']);
    }
}