import Interface from "../../Reflect/Interface";

export default class ConfigMergerInterface extends Interface{
    static is(instance) {
        let methods = ['getMergedConfig', 'setMergedConfig'];

        return Interface.is(instance, methods);
    }
}