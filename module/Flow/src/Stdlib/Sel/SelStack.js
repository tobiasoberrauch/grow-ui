import SelDoublyLinkedList from "./SelDoublyLinkedList";

export default class SelStack extends SelDoublyLinkedList {
    setIteratorMode(mode) {
        this.iteratorMode = mode;
    }
}