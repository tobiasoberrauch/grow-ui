import SelDoublyLinkedList from "./SelDoublyLinkedList";

export default class SelQueue extends SelDoublyLinkedList {
    constructor() {
        this.queue = [];
    }

    setIteratorMode(mode) {
        this.iteratorMode = mode;
    }

    enqueue(value) {
        this.queue.push(value);
    }

    dequeue() {
        return this.queue.shift();
    }

    peek() {
        return this.queue[0];
    }

    length() {
        return this.queue.length;
    }

    print() {
        console.log(this.queue.join(' '));
    }
}