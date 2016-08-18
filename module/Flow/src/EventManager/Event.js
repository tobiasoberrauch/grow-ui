export default class Event {

    constructor(name = null, target = null, parameters = null) {
        if (name) {
            this.name = name;
        }
        if (target) {
            this.target = target;
        }
        this.parameters = parameters || new Map();
    }

    getName() {
        return this.name;
    }

    setName(name) {
        if (typeof name !== 'string') {
            throw new InvalidArgumentException();
        }

        this.name = name;

        return this;
    }

    getTarget() {
        return this.target;
    }

    setTarget(target) {
        this.target = target;

        return this;
    }

    getParameters() {
        if (!this.parameters) {
            this.parameters = new Map();
        }

        return this.parameters;
    }

    setParameters(parameters) {
        this.parameters = parameters;

        return this;
    }


    setParameter(name, value) {
        this.parameters.set(name, value);

        return this;
    }

    getParameter(name, defaultValue = null) {
        return this.parameters.has(name) ? this.parameters.get(name) : defaultValue;
    }

    stopPropagation(stop = true) {
        this.stopPropagation = stop;

        return this;
    }

    propagationIsStopped() {
        return this.stopPropagation;
    }
}