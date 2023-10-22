import { MinecraftText } from "../MinecraftText.js";
import { html, staticCss, thisClass } from "../../../helpers.js";

let loreSplitter = staticCss.named("loreSplitter").css`${thisClass} {
	width: 100%;
	height: 3px;
	margin: 0;
} `;

export function Lore(...text) {
	let lines = text.flat().map(t => MinecraftText(t));
	if (lines.length <= 1) {
		return lines.join("");
	}

	let [first, ...rest] = lines;

	return html`
		${first}
		<div ${loreSplitter}></div>
		${rest.join("<br>")}
	`;
}