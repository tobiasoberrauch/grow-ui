import SelStack from "../Stdlib/Sel/SelStack";

export default class ResponseCollection extends SelStack {
    isStopped() {
        return this.stopped;
    }

    setStopped(stopped) {
        this.stopped = stopped;

        return this;
    }

    first() {
        return this.head ? this.head.data : null;
    }

    last() {
        return this.tail ? this.tail.data : null;
    }

    contains(value) {

    }
}