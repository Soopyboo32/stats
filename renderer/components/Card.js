import { html } from "../../helpers.js";
import { cardCss } from "../css.js";

export function Card(contents) {
	return html`
		<div ${cardCss}>
			${contents}
		</div>
	`;
}