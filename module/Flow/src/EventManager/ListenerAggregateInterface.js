import Interface from "../Reflect/Interface";

export default class ListenerAggregateInterface extends Interface {
    static is(instance) {
        let methods = ['attach', 'detach'];

        return Interface.is(instance, methods);
    }
}