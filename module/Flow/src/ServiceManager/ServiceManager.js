import ServiceNotFoundException from "./Exception/ServiceNotFoundException";
import ClassLoader from "./../Loader/ClassLoader";

class ServiceManager {
    constructor(config = null) {
        this.abstractFactories = [];
        this.aliases = new Map();
        this.canonicalNames = new Map();
        this.config = new Map();
        this.delegators = new Map();
        this.factories = new Map();
        this.initializers = [];
        this.instances = new Map();
        this.invokableClasses = new Map();
        this.nestedContext = new Map();
        this.nestedContextCounter = -1;
        this.pendingAbstractFactoryRequests = new Map();
        this.shared = new Map();
        this.canonicalNamesReplacements = new Map([
            ['-', ''],
            ['_', ''],
            [' ', ''],
            ['\\', ''],
            ['/', '']
        ]);

        if (config) {
            config.configureServiceManager(this);
        }
    }

    setAllowOverride(allowOverride) {
        this.config.set('allowOverride', allowOverride);

        return this;
    }

    getAllowOverride() {
        return this.config.get('allowOverride');
    }

    setShareByDefault(shareByDefault) {
        if (!this.allowOverride) {
            throw new RuntimeException(
                'cannot alter default shared service setting; container is marked immutable (allow_override is false)'
            );
        }

        this.config.set('shareByDefault', shareByDefault);

        return this;
    }

    getShareByDefault() {
        return this.config.get('shareByDefault');
    }

    setThrowExceptionInCreate(throwExceptionInCreate) {
        this.config.set('throwExceptionInCreate', throwExceptionInCreate);

        return this;
    }

    getThrowExceptionInCreate() {
        return this.config.get('throwExceptionInCreate');
    }

    setRetrieveFromPeeringManagerFirst(retrieveFromPeeringManagerFirst) {
        this.config.set('retrieveFromPeeringManagerFirst', retrieveFromPeeringManagerFirst);

        return this;
    }

    getRetrieveFromPeeringManagerFirst() {
        return this.config.get('retrieveFromPeeringManagerFirst');
    }

    setInvokableClass(name, invokableClass, shared = null) {
        let canonicalName = this.canonicalizeName(name);

        if (this.has([canonicalName, name], false)) {
            if (this.allowOverride === false) {
                throw new InvalidServiceNameException(
                    'A service by the name or alias "%s" already exists and cannot be overridden; please use an alternate name'
                );
            }
            this.unregisterService(canonicalName);
        }

        if (shared === null) {
            shared = this.shareByDefault;
        }

        this.invokableClasses.set(canonicalName, invokableClass);
        this.shared.set(canonicalName, shared);

        return this;
    }

    setFactory(name, factory, shared = null) {
        let canonicalName = this.canonicalizeName(name);

        if (!(factory.hasOwnProperty('createService') || typeof factory === 'string' || typeof factory === 'function')) {
            throw new InvalidArgumentException(
                'Provided abstract factory must be the class name of an abstract factory or an instance of an AbstractFactoryInterface.'
            );
        }

        if (this.has([canonicalName, name], false)) {
            if (this.allowOverride === false) {
                throw new InvalidServiceNameException(
                    'A service by the name or alias "%s" already exists and cannot be overridden; please use an alternate name'
                );
            }
            this.unregisterService(canonicalName);
        }

        if (shared === null) {
            shared = this.shareByDefault;
        }

        this.factories.set(canonicalName, factory);
        this.shared.set(canonicalName, shared);

        return this;
    }

    addAbstractFactory(factory, topOfStack = true) {
        if (typeof factory === 'string') {
            factory = new factory();
        }

        if (!(factory.hasOwnProperty('canCreateServiceWithName') && factory.hasOwnProperty('createServiceWithName'))) {
            throw new InvalidArgumentException(
                'Provided abstract factory must be the class name of an abstract'
                + ' factory or an instance of an AbstractFactoryInterface.'
            );
        }

        if (topOfStack) {
            this.abstractFactories.unshift(factory);
        } else {
            this.abstractFactories.push(factory);
        }

        return this;
    }

    addDelegator(serviceName, delegatorFactoryName) {
        let canonicalName = this.canonicalizeName(serviceName);

        if (!this.delegators.has(canonicalName)) {
            this.delegators.set(canonicalName, new Set());
        }

        this.delegators.get(canonicalName).add(delegatorFactoryName);

        return this;
    }

    addInitializer(initializer, topOfStack = true) {
        if (typeof initializer === 'string') {
            initializer = new initializer();
        }

        if (!(initializer.hasOwnProperty('initialize') || typeof initializer == 'function')) {
            throw new InvalidArgumentException('initializer should be callable.');
        }

        if (topOfStack) {
            this.initializers.unshift(initializer);
        } else {
            this.initializers.push(initializer);
        }

        return this;
    }

    setService(name, service) {
        let canonicalName = this.canonicalizeName(name);

        if (this.has(canonicalName, false)) {
            if (this.allowOverride === false) {
                throw new InvalidServiceNameException(
                    'A service by the name or alias "%s" already exists and cannot be overridden; please use an alternate name'
                );
            }
            this.unregisterService(canonicalName);
        }

        this.instances.set(canonicalName, service);
    }

    setShared(name, isShared) {
        let canonicalName = this.canonicalizeName(name);

        if (!this.invokableClasses.has(canonicalName) && !this.factories.has(canonicalName) && !this.canCreateFromAbstractFactory(canonicalName, name)) {
            // console.error(name, canonicalName);
        }

        this.shared.set(canonicalName, isShared);

        return this;
    }

    isShared(name) {
        let canonicalName = this.canonicalizeName(name);

        if (!this.has(name)) {
            throw new ServiceNotFoundException(name);
        }

        if (this.shared.has(canonicalName)) {
            return this.shared.get(canonicalName);
        }

        return this.shareByDefault;
    }

    resolveAlias(canonicalName) {
        let stack = new Map();

        while (this.hasAlias(canonicalName)) {
            if (stack.has(canonicalName)) {
                throw new CircularReferenceException(stack);
            }

            stack.set(canonicalName, canonicalName);
            canonicalName = this.aliases.get(canonicalName);
        }

        return canonicalName;
    }

    get(name, usePeeringServiceManagers = true) {
        let canonicalName;

        if (this.canonicalNames.has(name)) {
            canonicalName = this.canonicalNames.get(name);
        } else {
            canonicalName = this.canonicalizeName(name);
        }

        let isAlias = false;

        if (this.hasAlias(canonicalName)) {
            isAlias = true;
            canonicalName = this.resolveAlias(canonicalName);
        }

        let instance = null;

        if (usePeeringServiceManagers && this.retrieveFromPeeringManagerFirst) {
            instance = this.retrieveFromPeeringManager(name);

            if (null !== instance) {
                return instance;
            }
        }

        if (this.instances.has(canonicalName)) {
            return this.instances.get(canonicalName);
        }

        if (!instance) {
            this.checkNestedContextStart(canonicalName);

            if (
                this.invokableClasses.has(canonicalName)
                || this.factories.has(canonicalName)
                || this.aliases.has(canonicalName)
                || this.canCreateFromAbstractFactory(name, canonicalName)
            ) {
                instance = this.create([canonicalName, name]);
            } else if (isAlias && this.canCreateFromAbstractFactory(name, canonicalName)) {
                instance = this.create([name, canonicalName]);
            } else if (usePeeringServiceManagers && !this.retrieveFromPeeringManagerFirst) {
                instance = this.retrieveFromPeeringManager(name);
            }

            this.checkNestedContextStop();
        }

        if (instance === null) {
            this.checkNestedContextStop(true);
            if (isAlias) {
                throw new ServiceNotFoundException(name);
            }

            throw new ServiceNotFoundException();
        }

        if (
            (this.shareByDefault && !this.shared.has(canonicalName))
            || (this.shared.has(canonicalName) && this.shared.get(canonicalName) === true)
        ) {
            this.instances.set(canonicalName, instance);
        }

        return instance;
    }

    create(name) {
        let canonicalName;
        let realName;

        if (Array.isArray(name)) {
            canonicalName = name[0];
            realName = name[1];
        } else {
            realName = name;

            if (this.canonicalNames.has(realName)) {
                canonicalName = this.canonicalNames.get(realName);
            } else {
                canonicalName = this.canonicalizeName(name);
            }
        }

        if (this.delegators.has(canonicalName)) {
            return this.createDelegatorFromFactory(canonicalName, realName);
        }

        return this.doCreate(realName, canonicalName);
    }

    createDelegatorCallback(delegatorFactory, realName, canonicalName, creationCallback) {
        let serviceManager = this;

        return () => {
            return delegatorFactory.hasOwnProperty('createDelegatorWithName')
                ? delegatorFactory.createDelegatorWithName(serviceManager, canonicalName, realName, creationCallback)
                : delegatorFactory(serviceManager, canonicalName, realName, creationCallback);
        };
    }

    doCreate(realName, canonicalName) {
        let instance = null;

        if (this.factories.has(canonicalName)) {
            instance = this.createFromFactory(canonicalName, realName);
        }

        if (instance === null && this.invokableClasses.has(canonicalName)) {
            instance = this.createFromInvokable(canonicalName, realName);
        }

        this.checkNestedContextStart(canonicalName);
        if (instance === null && this.canCreateFromAbstractFactory(canonicalName, realName)) {
            instance = this.createFromAbstractFactory(canonicalName, realName);
        }
        this.checkNestedContextStop();

        if (instance === null && this.throwExceptionInCreate) {
            this.checkNestedContextStop(true);

            throw new ServiceNotFoundException(
                'No valid instance was found for %s%s'
            );
        }

        if (instance === null) {
            return instance;
        }

        for (let initializer of this.initializers) {
            if (initializer.hasOwnProperty('initialize')) {
                initializer.initialize(instance, this);
            } else {
                initializer.call(this, initializer, instance);
            }
        }

        return instance;
    }

    // @todo not ready
    has(name, checkAbstractFactories = true, usePeeringServiceManagers = true) {
        let canonicalName;
        let realName = name;

        if (typeof name === 'string') {

            if (this.canonicalNames.has(realName)) {
                canonicalName = this.canonicalNames.get(realName);
            } else {
                canonicalName = this.canonicalizeName(name);
            }
        } else if (Array.isArray(name) && name.length >= 2) {
            canonicalName = name[0];
            realName = name[1];
        } else {
            return false;
        }

        if (
            this.invokableClasses.has(canonicalName)
            || this.factories.has(canonicalName)
            || this.aliases.has(canonicalName)
            || this.instances.has(canonicalName)
            || (checkAbstractFactories && this.canCreateFromAbstractFactory(canonicalName, realName))
        ) {
            return true;
        }

        if (usePeeringServiceManagers) {
            let caller = this.serviceManagerCaller;

            //
        }

        return false;

    }

    // @todo
    canCreateFromAbstractFactory(canonicalName, realName) {
        if (this.nestedContext.has(canonicalName)) {
            let context = this.nestedContext.get(canonicalName);

            if (context === false) {
                return false;
            } else {
                return this.pendingAbstractFactoryRequests.has(get_class(context) + canonicalName);
            }
        }

        this.checkNestedContextStart(canonicalName);

        let result = false;
        this.nestedContext.set(canonicalName, false);

        for (let abstractFactory of this.abstractFactories) {
            let pendingKey = get_class(abstractFactory) + canonicalName;

            if (this.pendingAbstractFactoryRequests.has(pendingKey)) {
                result = false;
                break;
            }

            if (abstractFactory.canCreateServiceWithName(this, canonicalName, realName)) {
                this.nestedContext.set(canonicalName, abstractFactory);
                result = true;
                break;
            }
        }

        this.checkNestedContextStop();

        return result;
    }

    checkForCircularAliasReference(alias, nameOrAlias) {
        let aliases = this.aliases;
        aliases.set(alias, nameOrAlias);
        let stack = new Set();

        while (aliases.has(alias)) {
            if (stack.has(alias)) {
                throw new CircularReferenceException();
            }

            stack.set(alias, alias);
            alias = aliases.get(alias);
        }

        return this;
    }

    setAlias(alias, nameOrAlias) {
        if (typeof alias !== 'string' || typeof nameOrAlias !== 'string') {
            throw new InvalidServiceNameException();
        }

        let canonicalAlias = this.canonicalizeName(alias);
        let canonicalNameOrAlias = this.canonicalizeName(nameOrAlias);

        if (alias == '' || canonicalNameOrAlias == '') {
            throw new InvalidServiceNameException();
        }

        if (this.allowOverride === false && this.has([canonicalAlias, alias], false)) {
            throw new InvalidServiceNameException();
        }

        if (this.hasAlias(alias)) {
            this.checkForCircularAliasReference(canonicalAlias, canonicalNameOrAlias);
        }


        this.aliases.set(canonicalAlias, canonicalNameOrAlias);

        return this;
    }

    hasAlias(alias) {
        return this.aliases.has(this.canonicalizeName(alias));
    }

    createScopedServiceManager(peering = 'parent') {
        let scopedServiceManager = new ServiceManager();

        if (peering == 'parent') {
            scopedServiceManager.peeringServiceManagers.add(this);
        }
        if (peering == 'child') {
            this.peeringServiceManagers.add(scopedServiceManager);
        }

        return scopedServiceManager;
    }

    addPeeringServiceManager(manager, peering = 'parent') {
        if (peering == 'parent') {
            this.peeringServiceManager = manager;
        }
        if (peering == 'child') {
            manager.peeringServiceManager = this;
        }

        return this;
    }

    canonicalizeName(name) {
        if (this.canonicalNames.has(name)) {
            return this.canonicalNames.get(name);
        }

        let canonicalName = name.toLowerCase();
        for (let [key, value] of this.canonicalNamesReplacements) {
            canonicalName = canonicalName.replace(key, value);
        }

        this.canonicalNames.set(name, canonicalName);

        return canonicalName;
    }

    createServiceViaCallback(callable, canonicalName, realName) {
        return callable.call(this, canonicalName, realName);

        // @todo

        ServiceManager.circularDependencyResolver = new Map();
        let depKey = md5(serialize(this)) + '-' + canonicalName;

        if (ServiceManager.circularDependencyResolver.has(depKey)) {
            ServiceManager.circularDependencyResolver = new Map();

            throw new CircularDependencyFoundException(
                'Circular dependency for LazyServiceLoader was found for instance ' + realName
            );
        }

        let instance = null;
        try {
            ServiceManager.circularDependencyResolver.set(depKey, true);
            instance = callable.call(this, canonicalName, realName);
            ServiceManager.circularDependencyResolver.delete(depKey);
        } catch (Exception) {
            ServiceManager.circularDependencyResolver.delete(depKey);
            throw new Exception(
                'An exception was raised while creating "%s"; no instance returned'
            );
        }

        if (instance === null) {
            throw new ServiceNotCreatedException('The factory was called but did not return an instance.');
        }

        return instance;
    }

    getRegisteredServices() {
        return {
            invokableClasses: this.invokableClasses.keys(),
            factories: this.factories.keys(),
            aliases: this.aliases.keys(),
            instances: this.instances.keys()
        };
    }

    getCanonicalNames() {
        return this.canonicalNames;
    }

    setCanonicalNames(canonicalNames) {
        this.canonicalNames = canonicalNames;
    }

    retrieveFromPeeringManager(name) {
        let service = this.loopPeeringServiceManagers(name);
        if (service) {
            return service;
        }

        name = this.canonicalizeName(name);

        if (this.hasAlias(name)) {
            do {
                name = this.aliases.get(name);
            } while (this.hasAlias(name))
        }

        service = this.loopPeeringServiceManagers(name);
        if (service) {
            return service;
        }

        return;
    }

    // @todo not ready
    loopPeeringServiceManagers(name) {
        let caller = this.serviceManagerCaller;


    }

    createFromInvokable(canonicalName, requestedName) {
        let invokable = this.invokableClasses.get(canonicalName);

        if (!invokable) {
            throw new ServiceNotFoundException(requestedName);
        }

        return ClassLoader.load(invokable);
    }

    createFromFactory(canonicalName, requestedName) {
        let factory = this.factories.get(canonicalName);
        if (typeof factory === 'string' /*&& classExists(factory) */) {
            factory = ClassLoader.load(factory);

            this.factories.set(canonicalName, factory);
        }

        let instance;
        if (Reflect.has(factory, 'createService')) {
            instance = factory.createService(this);
            // instance = this.createServiceViaCallback([factory, 'createService'], canonicalName, requestedName);
        } else if (typeof factory === 'function') {
            instance = this.createDelegatorCallback(factory, canonicalName, requestedName);
        } else {
            throw new ServiceNotCreatedException(
                'While attempting to create %s%s an invalid factory was registered for this instance type.'
            );
        }

        return instance;
    }

    createFromAbstractFactory(canonicalName, requestedName) {
        if (this.nestedContext.has(canonicalName)) {

            let abstractFactory = this.nestedContext.get(canonicalName);
            let pendingKey = get_class(abstractFactory) + canonicalName;

            try {
                this.pendingAbstractFactoryRequests.set(pendingKey, true);
                let instance = this.createServiceViaCallback(
                    [abstractFactory, 'createServiceWithName'],
                    canonicalName,
                    requestedName
                );

                this.pendingAbstractFactoryRequests.delete(pendingKey);

                return instance;
            } catch (Exception) {
                this.pendingAbstractFactoryRequests.delete(pendingKey);

                this.checkNestedContextStop(true);

                throw new ServiceNotCreatedException();
            }

        }

        return;
    }

    checkNestedContextStart(canonicalName) {
        if (this.nestedContextCounter === -1 || !this.nestedContext.has(canonicalName)) {
            this.nestedContext.set(canonicalName, null);
        }

        this.nestedContextCounter++;

        return this;
    }

    checkNestedContextStop(force = false) {
        if (force) {
            this.nestedContextCounter = -1;
            this.nestedContext = new Map();

            return this;
        }

        this.nestedContextCounter--;
        if (this.nestedContextCounter === -1) {
            this.nestedContext = new Map();
        }

        return this;
    }

    createDelegatorFromFactory(canonicalName, requestedName) {
    }

    static isSubclassOf(className, type) {
    }

    unregisterService(canonicalName) {
    }

}

module.exports = ServiceManager;