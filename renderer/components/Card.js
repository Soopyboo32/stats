import { css, html } from "../../helpers.js";
import { cardCss } from "../css.js";

export function Card(title, contents, width) {
	return html`
		<div ${cardCss} ${css`width: ${width.toFixed(0)}px;`}>
			${title}
			<hr>
			${contents}
		</div>
	`;
}