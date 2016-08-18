export default class InitTrigger {
    __invoke(event) {
        let module = event.getModule();

        if (Reflect.getPrototypeOf(module).hasOwnProperty('init')) {
            module.init(event.getTarget());
        }
    }
}