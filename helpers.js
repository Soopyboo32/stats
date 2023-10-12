/**
 * @typedef {Object} Reference
 * @property {(callback: (this: HTMLElement, ev: MouseEvent) => any) => Reference} onClick
 * @property {(callback: () => any) => Reference} onEnter
 * @property {(data: String) => Reference} reRender
 * @property {(data: String) => Reference} renderInner
 * @property {() => boolean} exists
 * @property {() => HTMLElement | null} getElm
 * @property {(callback: () => any) => Reference} onRemove
 */

/**
 * @typedef {string} HTML
 */

/**
 * @returns {Reference}
 */
export function useRef() {
	let id = generateId();

	let removeCb = [];

	/**
	 * @type {Reference}
	 */
	let ref = {
		toString: () => `id="${id}"`,
		onClick: (callback) => {
			setTimeout(() => {
				let elm = ref.getElm();
				if (!elm) return;
				elm.addEventListener("click", callback);
			});
			return ref;
		},
		onEnter: (callback) => {
			setTimeout(() => {
				let elm = ref.getElm();
				if (!elm) return;
				elm.addEventListener("keyup", (key) => {
					if (key.key === "Enter") {
						callback();
					}
				});
			});
			return ref;
		},
		reRender: (data) => {
			let elm = ref.getElm();
			if (!elm) return ref;
			elm.outerHTML = data;
			return ref;
		},
		renderInner: (data) => {
			let elm = ref.getElm();
			if (!elm) return ref;
			elm.innerHTML = data;
			return ref;
		},
		exists: () => {
			let elm = ref.getElm();
			return !!elm;
		},
		getElm: () => document.getElementById(id),
		onRemove: (callback) => {
			removeCb.push(callback);
			return ref;
		},
		css: (...args) => {
			let elm = ref.getElm();
			if (!elm) return ref;
			elm.style = toCssString(args);

			return ref;
		}
	};

	let interval = setInterval(() => {
		if (ref.exists()) {
			return;
		}

		clearInterval(interval);
		for (let cb of removeCb) {
			cb();
		}
	}, 1000);

	return ref;
}

function toHtmlString(asd) {
	let css = "";
	asd[0].forEach((s, i) => {
		css += s + (asd[i + 1] || "");
	});
	return css;
}

/**
 * Atm this works the exact same as a template literal without the html call
 * Maybe I do something with this in the future tho, + it helps syntax detection for editors
 * @returns HTML
 */
export function html(...args) {
	return toHtmlString(args);
}

/**
 * @typedef {()=>Css} Css
 */

export function css(...args) {
	let str = toCssString(args);

	return fromCssString(str);
}

function toCssString(asd) {
	let css = "";
	asd[0].forEach((s, i) => {
		css += s + (asd[i + 1] || "");
	});
	return css;
}

function fromCssString(str) {
	let val = str;

	/**@type {Css} */
	let ret = (...args2) => {
		let css = toCssString(args2);

		return fromCssString(val + css);
	};
	ret.toString = () => `style="${val.replace("\"", "\\\"")}"`;
	ret.getRawCss = () => val;

	return ret;
}

/**
 * @typedef {()=>StaticCss} _StaticCss
 *
 * @typedef {Object} _CssProps
 * @property {() => String} getCss
 * @property {() => StaticCss} css
 * @property {() => String} getClassName
 * @property {() => String[]} getAllClasses
 * @property {(StaticCss) => StaticCss} merge
 * @property {(String) => StaticCss} named
 *
 * @typedef {_StaticCss & _CssProps} StaticCss
 */

export function staticCss(...args) {
	let data = toStaticCssData(args);

	return fromStaticCssData(data, [generateClassName()]);
}

staticCss.named = (id) => {
	return fromStaticCssData([], [], id);
};

staticCss.css = (...args) => {
	let data = toStaticCssData(args);

	return fromStaticCssData(data, [generateClassName()]);
};

function toStaticCssData(asd) {
	let css = [];
	asd[0].forEach((s, i) => {
		css.push(s);
		if ((typeof asd[i + 1] == "object" || typeof asd[i + 1] == "function")
			&& (asd[i + 1].internal_isCssClassGetter === true || asd[i + 1]._classType === "StaticCss")) {
			css.push(asd[i + 1]);
		} else if (asd[i + 1]) {
			css.push(asd[i + 1] + "");
		}
	});
	if (css[0].startsWith("{") && css[css.length - 1].endsWith("}")) {
		css[0] = css[0].substring(1, css[0].length);
		css[css.length - 1] = css[css.length - 1].substring(0, css[css.length - 1].length - 1);
	}
	return css;
}

function fromStaticCssData(data, classes = [], nextName) {
	classes = [...new Set(classes)];
	let val = data;

	/**@type {StaticCss} */
	let ret = (...args2) => {
		let css = toStaticCssData(args2);

		let className = generateClassName(nextName);
		return fromStaticCssData(css, [...classes, className]);
	};
	ret.css = (...args2) => {
		let css = toStaticCssData(args2);

		let className = generateClassName(nextName);
		return fromStaticCssData(css, [...classes, className]);
	};
	ret.merge = (otherCss) => {
		return fromStaticCssData([], [...classes, ...otherCss.getAllClasses(), ""]);
	};
	ret.named = (id) => {
		nextName = id;
		return ret;
	};
	ret.getCss = () => val.map(d => {
		if (d.internal_isCssClassGetter) return `.${classes[classes.length - 1]}`;
		if (d._classType === "StaticCss") return `.${d.getClassName()}`;

		return d;
	}).join("");
	ret.getClassName = () => classes[classes.length - 1];
	ret.getAllClasses = () => classes;
	ret.toString = () => {
		return `class="${classes.join(" ")}"`;
	};
	ret._classType = "StaticCss";

	addCssToFile(ret);

	return ret;
}

export let thisClass = {
	internal_isCssClassGetter: true
};

let generatedIds = new Set([""]);

function generateClassName(id = "") {
	let testId = id;
	while (generatedIds.has(testId)) {
		testId = id + "_" + Math.floor(Math.random() * 2400000).toString(16);
	}
	generatedIds.add(testId);
	return testId;
}

function generateId() {
	return Math.floor(Math.random() * 2400000).toString(16);
}

let styleElm = document.getElementById("css");
let cssAdded = new Set([]);

/**
 * @param {StaticCss} staticCss
 */
function addCssToFile(staticCss) {
	if (cssAdded.has(staticCss.getClassName())) {
		return;
	}
	cssAdded.add(staticCss.getClassName());

	styleElm.innerHTML += staticCss.getCss() + "\n";
}

/**
 * @param {number} x
 */
export function numberWithCommas(x) {
	if (x === undefined) return "";
	let parts = x.toString().split(".");
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return parts.join(".");
}