import fs from "fs";
import ListenerOptions from "./ListenerOptions";

export default class AbstractListener {
    constructor(options = null) {
        if (null === options) {
            this.setOptions(new ListenerOptions());
        } else {
            this.setOptions(options);
        }
    }

    getOptions() {
        return this.options;
    }

    setOptions(options) {
        this.options = options;
    }

    writeToFile(filePath, content) {
        fs.writeFileSync(filePath, content);

        return this;
    }
}