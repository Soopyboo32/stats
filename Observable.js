export class Observable {
    #data;
    #cbArr;

    constructor(data) {
        this.#data = data;
        this.#cbArr = new Set();
    }

    set data(val) {
        this.#data = val;

        for (let cb of this.#cbArr) {
            cb(val);
        }
    }

    changed() {
        for (let cb of this.#cbArr) {
            cb(this.#data);
        }
    }

    get data() {
        return this.#data;
    }

    onChange(cb) {
        this.#cbArr.add(cb);

        return () => {
            this.#cbArr.delete(cb);
        }
    }
}