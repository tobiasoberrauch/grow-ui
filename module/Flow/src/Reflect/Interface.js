export default class Interface {
    static is(instance, methods) {
        if (!instance) {
            return false;
        }

       if (typeof instance === 'string') {
           return false;
       }

        let prototype = Reflect.getPrototypeOf(instance);

        for (let methodName of methods) {
            if (!prototype.hasOwnProperty(methodName)) {
                return false;
            }

        }

        return true;
    }
}