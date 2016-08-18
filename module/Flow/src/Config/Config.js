export default class Config {
    constructor(config, allowModifications = false) {
        this.allowModifications = allowModifications;
        this.data = new Map();

        for (let [key, value] of config) {
            if (Array.isArray(value) /* || isObject */) {
                this.data.set(key, new Config(value, allowModifications));
            } else {
                this.data.set(key, value);
            }
        }
    }

    get(name, defaultValue = null) {
        if (this.data.has(name)) {
            return this.data.get(name);
        }

        return defaultValue;
    }

    set(name, value) {
        if (!this.allowModifications) {
            throw new Error('It is not allowed to override the config');
        }

        if (Array.isArray(value)) {
            value = new Config(value, true);
        }

        if (name) {
            this.data.set(name, value);
        } else {
            this.data.add(value);
        }
    }

    toArray() {
        return Array.from(this.data);
    }

    has(key) {
        return this.data.has(key);
    }

    count() {
        return this.data.size;
    }

    entries() {
        return this.data.entries();
    }

    keys() {
        return this.data.keys();
    }

    values() {
        return this.data.values();
    }

    merge(config) {
    }

    setReadOnly() {
        this.allowModifications = false;

        for (let value of this.data.values()) {
            if (value instanceof Config) {
                value.setReadOnly();
            }
        }
    }

    isReadOnly() {
        return !this.allowModifications;
    }
}