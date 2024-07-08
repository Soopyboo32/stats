import { html } from "./soopyframework/helpers.js";

Number.prototype.floored = function (fractionDigits = 0) {
	let pow = Math.pow(10, fractionDigits);
	return Math.floor(this * pow) / pow;
};


import { App } from "./renderer/App.js";

document.getElementById("app").outerHTML = App();

let elm = document.createElement("div");
elm.innerHTML = html`
	<link rel="stylesheet" href="./global.css">
	<link rel="stylesheet" href="./itemtextures/inventory.css" />
`
document.body.appendChild(elm);
