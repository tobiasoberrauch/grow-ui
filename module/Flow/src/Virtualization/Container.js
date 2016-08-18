const EventEmitter = require('events');

class Container extends EventEmitter
{
    constructor(containerRunner) {
        super();
    }
}

module.exports = Container;