export default class CallbackHandler {
    constructor(callback, metadata = new Map()) {
        this.metadata = metadata;

        this.registerCallback(callback);
    }

    registerCallback(callback) {
        this.callback = callback;
    }

    getCallback() {
        return this.callback;
    }

    call(context, ...args) {
        let callback = this.getCallback();

        if (Array.isArray(callback)) {
            let instance = callback[0];
            let methodName = callback[1];

            return instance[methodName].apply(instance, args);
        }

        if (Reflect.getPrototypeOf(callback).hasOwnProperty('__invoke')) {
            return callback['__invoke'].apply(callback, args);
        }
    }

    getMetadata() {
        return this.metadata;
    }

    getMetadatum(name) {
        if (this.metadata.has(name)) {

            return this.metadata.get(name);
        }

        return null;
    }
}