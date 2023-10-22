Number.prototype.floored = function (digits) {
	let pow = Math.pow(10, digits);
	return Math.floor(this * pow) / pow;
};

import { App } from "./renderer/App.js";

document.getElementById("app").outerHTML = App();