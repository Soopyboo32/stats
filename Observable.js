export class Observable {
    /**@type {ProxyHandler} */
    #proxyObj
    #data;
    #cbArr;

    constructor(data) {
        this.#data = data;
        this.#cbArr = new Set();

        this.#proxyObj = {};

        this.#proxyObj.get = (target, p, reciever) => {
            let data = target[p];
            if (p == "_path") return data

            if (typeof data === "object" && !data._observableIgnore) {
                let ret = new Proxy(target[p], this.#proxyObj);
                ret.path = reciever.path ? reciever._path + "." + p : p
            }

            return data;
        };

        this.#proxyObj.set = (target, p, newVal, reciever) => {
            data[p] = newVal;
            let path = reciever.path ? reciever.path + "." + p : p
            this.changed(path);
            return true;
        };
    }

    set data(val) {
        this.#data = val;

        this.changed("")
    }

    changed(path) {
        let data = this.data;
        for (let cb of this.#cbArr) {
            cb(path, data);
        }
    }

    get data() {
        return new Proxy(this.#data, this.#proxyObj);
    }

    /**
     * 
     * @param {(path: String, data: Any) => Any} cb 
     * @returns 
     */
    onChange(cb) {
        this.#cbArr.add(cb);

        return () => {
            this.#cbArr.delete(cb);
        }
    }
}