class Config {
    constructor(config) {
        this.config = config;
    }

    getAllowOverride() {
        return this.config.has('allow_override') ? this.config.allow_override : null;
    }

    getFactories() {
        return this.config.has('factories') ? this.config.get('factories') : new Map();
    }

    getAbstractFactories() {
        return this.config.has('abstract_factories') ? this.config.get('abstract_factories') : new Set();
    }

    getInvokables() {
        return this.config.has('invokables') ? this.config.get('invokables') : new Map();
    }

    getServices() {
        return this.config.has('services') ? this.config.get('services') : new Map();
    }

    getAliases() {
        return this.config.has('aliases') ? this.config.get('aliases') : new Map();
    }

    getInitializers() {
        return this.config.has('initializers') ? this.config.get('initializers') : new Map();
    }

    getShared() {
        return this.config.has('shared') ? this.config.get('shared') : new Map();
    }

    getDelegators() {
        return this.config.has('delegators') ? this.config.get('delegators') : new Map();
    }

    configureServiceManager(serviceManager) {
        if (this.allowOverride !== null) {
            serviceManager.setAllowOverride(this.getAllowOverride());
        }

        for (let [name, factory] of this.getFactories().entries()) {
            serviceManager.setFactory(name, factory);
        }

        for (let factory of this.getAbstractFactories().values()) {
            serviceManager.addAbstractFactory(factory);
        }

        for (let [name, invokable] of this.getInvokables().entries()) {
            serviceManager.setInvokableClass(name, invokable);
        }

        for (let [name, service] of this.getServices().entries()) {
            serviceManager.setService(name, service);
        }

        for (let [name, nameOrAlias] of this.getAliases().entries()) {
            serviceManager.setAlias(name, nameOrAlias);
        }

        for (let initializer of this.getInitializers().values()) {
            serviceManager.addInitializer(initializer);
        }

        for (let [name, isShared] of this.getShared().entries()) {
            serviceManager.setShared(name, isShared);
        }

        for (let [originalServiceName, delegators] of this.getDelegators().entries()) {
            for (let delegator of delegators) {
                serviceManager.addDelegator(originalServiceName, delegator);
            }
        }
    }
}

module.exports = Config;