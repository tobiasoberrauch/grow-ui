import SharedEventManager from "./SharedEventManager";

let $instance = null;

export default class StaticEventManager extends SharedEventManager {
    constructor() {
        super();
    }

    static getInstance() {
        if (null == $instance) {
            $instance = new StaticEventManager();
        }
        return $instance;
    }

    static setInstance(instance) {
        $instance = instance;
    }

    static hasInstance() {
        return !!$instance;
    }

    static resetInstance() {
        $instance = null;
    }
}