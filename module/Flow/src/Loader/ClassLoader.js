export default class ClassLoader {

    /**
     * @param classPath
     * @returns {*}
     */
    static load(classPath) {
        let className = global.APPLICATION_ROOT + '/src/' + classPath;
        let requiredClass = require(className);

        if (requiredClass.hasOwnProperty('default')) {
            requiredClass = requiredClass.default;
        }

        return new requiredClass();
    }

    /**
     * @param {string} moduleName
     * @returns {*}
     */
    static loadModule(moduleName) {
        let className = global.APPLICATION_ROOT + '/module/' + moduleName + '/src/' + moduleName + '/Module';
        let requiredClass = require(className);

        if (requiredClass.hasOwnProperty('default')) {
            requiredClass = requiredClass.default;
        }

        return new requiredClass();
    }
}