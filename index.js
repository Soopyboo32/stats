Number.prototype.floored = function (fractionDigits = 0) {
	let pow = Math.pow(10, fractionDigits);
	return Math.floor(this * pow) / pow;
};

import { App } from "./renderer/App.js";

document.getElementById("app").outerHTML = App();