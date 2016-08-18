import DefaultListenerAggregate from "../ModuleManager/Listener/DefaultListenerAggregate";
import SharedEventManager from "./SharedEventManager";
import StaticEventManager from "./StaticEventManager";
import CallbackHandler from "../Stdlib/CallbackHandler";
import ListenerAggregateInterface from './ListenerAggregateInterface';
import ResponseCollection from "./ResponseCollection";

export default class EventManager {
    constructor(identifiers = null) {
        this.arguments = new Map();
        this.events = new Map();
        this.identifiers = new Set();
    }

    setEventClass(eventClass) {
        this.arguments.set('eventClass', eventClass);
    }

    setSharedManager(sharedManager) {
        this.arguments.set('sharedManager', sharedManager);
    }

    getSharedManager() {
        let sharedManager = this.arguments.get('sharedManager');
        if (sharedManager instanceof SharedEventManager) {
            return sharedManager;
        }

        if (!StaticEventManager.hasInstance()) {
            return false;
        }

        sharedManager = StaticEventManager.getInstance();
        this.arguments.set('sharedManager', sharedManager);

        return sharedManager;
    }

    unsetSharedManager() {
        this.arguments.set('sharedManager', false);
    }


    attach(eventName, callback = null, priority = 1) {
        if (ListenerAggregateInterface.is(eventName)) {
            return this.attachAggregate(eventName, callback);
        }

        if (Array.isArray(eventName)) {
            let listeners = [];
            for (let name of eventName) {
                listeners.push(this.attach(name, callback, priority));
            }
            return listeners;
        }

        if (!this.events.has(eventName)) {
            this.events.set(eventName, new Map());
        }

        let metadata = new Map();
        metadata.set('event', eventName);
        metadata.set('priority', priority);
        let listener = new CallbackHandler(callback, metadata);

        this.events.get(eventName).set(listener, priority);

        return listener;
    }

    attachAggregate(aggregate, priority = 1) {
        return aggregate.attach(this, priority);
    }

    // @todo diff
    trigger(eventName, event, argv = [], callback = null) {
        return this.triggerListeners(eventName, event, callback);
    }

    triggerListeners(eventName, event, callback = null) {
        let responses = new ResponseCollection();
        let listeners = this.getListeners(eventName);

        let sharedListeners = this.getSharedListeners(eventName);
        let sharedWildcardListeners = this.getSharedListeners('*');
        let wildcardListeners = this.getListeners('*');

        if (sharedListeners.length || sharedWildcardListeners.length || wildcardListeners.length) {
            listeners = new Map(listeners);

            this.insertListeners(listeners, sharedListeners);
            this.insertListeners(listeners, sharedWildcardListeners);
            this.insertListeners(listeners, wildcardListeners);
        }

        for (let listener of listeners) {
            // todo: let listenerCallback = listener.callback;
            let listenerCallback = listener[0];

            responses.push(listenerCallback.call(listenerCallback, event));

            // if (event.propagationIsStopped()) {
                // responses.setStopped(true);
                // break;
            // }

            if (callback && callback.call(this, responses.last())) {
                responses.setStopped(true);
                break;
            }
        }

        return responses;
    }

    detach(listener) {
        if (listener instanceof DefaultListenerAggregate) {
            return this.detachAggregate(listener);
        }

        let eventName = listener.metadatum('event');
        if (!eventName || !this.events.has(eventName)) {
            return false;
        }

        let hasRemoved = this.events.get(eventName).remove(listener);
        if (!hasRemoved) {
            return false;
        }

        if (!this.events.get(eventName)) {
            this.events.delete(eventName);
        }
    }

    detachAggregate(aggregate) {
        return aggregate.detach(this);
    }

    getEvents() {
        return Object.keys(this.events);
    }

    getListeners(eventName) {
        if (!this.events.has(eventName)) {
            return new Map();
        }
        return this.events.get(eventName);
    }

    clearListeners(eventName) {
        if (this.events.has(eventName)) {
            this.events.delete(eventName);
        }
    }

    getSharedListeners(eventName) {
        if (!this.sharedManager) {
            return [];
        }

        let identifiers = this.identifiers;
        if (!identifiers.has('*')) {
            identifiers.add('*');
        }

        let sharedListeners = new Map();

        for (let id of identifiers) {
            let listeners = this.sharedManager.getListeners(id, eventName);
            if (!listeners) {
                continue;
            }

            if (!(listeners instanceof Map)) {
                continue;
            }

            for (let listener of listeners) {
                // todo: instanceof CallbackHandler
                sharedListeners.set(listener);
            }
        }

        return sharedListeners;
    }

    insertListeners(masterListeners, listeners) {
        for (let listener of listeners) {
            let priority = listener.getMetadatum('priority');
            if (null === priority) {
                priority = 1;
            } else if (Array.isArray(priority)) {
                priority = priority.shift();
            }
            masterListeners.insert(listener, priority);
        }
    }
}