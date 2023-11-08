/**
 * @template T
 */
export class Observable {
	/**@type {ProxyHandler} */
	#proxyObj;
	/**@type {T} */
	#data;
	#cbArr;

	/**
	 * Observe some data for changes
	 * @param data {T}
	 */
	constructor(data) {
		this.#data = data;
		this.#cbArr = new Set();

		this.#proxyObj = {};

		this.#proxyObj.get = (target, p, receiver) => {
			let data = target[p];
			if (p === "_path") return data;

			if (typeof data === "object" && !data._observableIgnore) {
				let ret = new Proxy(target[p], this.#proxyObj);
				ret._path = receiver._path ? receiver._path + "." + p : p;
			}

			return data;
		};

		this.#proxyObj.set = (target, p, newVal, receiver) => {
			data[p] = newVal;
			let path = receiver._path ? receiver._path + "." + p : p;
			this.changed(path);
			return true;
		};
	}

	/**
	 * @param val {T}
	 */
	set data(val) {
		this.#data = val;

		this.changed("");
	}

	changed(path) {
		let data = this.data;
		for (let cb of this.#cbArr) {
			cb(path, data);
		}
	}

	/**
	 * @returns {T}
	 */
	get data() {
		return new Proxy(this.#data, this.#proxyObj);
	}

	/**
	 *
	 * @param {(path: String, data: any) => any} cb
	 * @returns
	 */
	onChange(cb) {
		this.#cbArr.add(cb);

		return () => {
			this.#cbArr.delete(cb);
		};
	}
}