import AbstractListener from "./AbstractListener";
import AutoLoaderListener from "./AutoLoaderListener";
import ConfigListener from "./ConfigListener";
import InitTrigger from "./InitTrigger";
import LocatorRegistrationListener from "./LocatorRegistrationListener";
import OnBootstrapListener from "./OnBootstrapListener";
import ModuleDependencyCheckerListener from "./ModuleDependencyCheckerListener";
import ModuleLoaderListener from "./ModuleLoaderListener";
import ModuleResolverListener from "./ModuleResolverListener";
import ConfigMergerInterface from "./ConfigMergerInterface";

export default class DefaultListenerAggregate extends AbstractListener {
    constructor(options) {
        super(options);

        this.listeners = new Set();
        this.configListener = null;
    }

    setConfigListener(configListener) {
        this.configListener = configListener;
    }

    getConfigListener() {
        if (!ConfigMergerInterface.is(this.configListener)) {
            this.setConfigListener(new ConfigListener(this.getOptions()));
        }

        return this.configListener;
    }

    /**
     *
     * @param events
     * @returns {DefaultListenerAggregate}
     */
    attach(events) {
        let options = this.getOptions();
        let configListener = this.getConfigListener();

        this.listeners.add(events.attach(new ModuleLoaderListener(options)));
        this.listeners.add(events.attach('loadModule.resolve', new ModuleResolverListener));
        // this.listeners.add(events.attach('loadModule', new AutoLoaderListener(options), 9000));

        if (options.getCheckDependencies()) {
            // this.listeners.add(events.attach('loadModule', new ModuleDependencyCheckerListener, 8000));
        }

        this.listeners.add(events.attach('loadModule', new InitTrigger(options)));
        // this.listeners.add(events.attach('loadModule', new OnBootstrapListener(options)));
        this.listeners.add(events.attach(new LocatorRegistrationListener(options)));
        // this.listeners.add(events.attach(configListener));

        return this;
    }

    detach(events) {

    }
}