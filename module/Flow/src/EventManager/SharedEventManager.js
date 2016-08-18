import EventManager from "./EventManager";

export default class SharedEventManager {
    constructor() {
        this.identifiers = new Map();
    }

    attach(idSet, event, callback, priority = 1) {
        if (!Array.isArray(idSet)) {
            idSet = [idSet];
        }

        let listeners = [];
        for (let id of idSet) {
            if (!this.identifiers.has(id)) {
                this.identifiers.set(id, new EventManager(id));
            }

            listeners.push(this.identifiers.get(id).attach(event, callback, priority));
        }

        // todo ?
        if (listeners.length > 1) {
            return listeners;
        }

        return listeners[0];
    }

    attachAggregate(aggregate, priority = 1) {
        return aggregate.attachShared(this, priority);
    }

    detach(id, listener) {
        if (!this.identifiers.has(id)) {
            return false;
        }
        return this.identifiers.get(id).detach(listener);
    }

    detachAggregate(aggregate) {
        return aggregate.detachShared(this);
    }

    getEvents(id) {
        if (!this.identifiers.has(id)) {
            if ('*' != id && this.identifiers.has('*')) {
                return this.identifiers.get('*').getEvents();
            }

            return false;
        }

        return this.identifiers.get(id).getEvents();
    }

    getListeners(id, event) {
        if (!this.identifiers.has(id)) {

            return false;
        }

        return this.identifiers.get(id).getListeners(event);
    }

    clearListeners(id, event = null) {
        if (!this.identifiers.has(id)) {

            return false;
        }

        if (null === event) {
            this.identifiers.delete(id);

            return true;
        }

        return this.identifiers.get(id).clearListeners(event);
    }
}