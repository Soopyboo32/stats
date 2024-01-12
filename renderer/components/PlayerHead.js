import { css, html, staticCss, thisClass } from "../../soopyframework/helpers.js";

let headCss = staticCss.named("head").css`${thisClass} {
	aspect-ratio: 1;
}`;

/**
 * @param uuid
 * @param options {width: String?, height: String?}
 * @returns {HTML}
 * @constructor
 */
export function PlayerHead(uuid, options={}) {
	return html`
		<img src="https://api.soopy.dev/skin/${uuid}/head.png" width="8" height="8" ${headCss} ${css`
			${options.width ? `width: ${options.width};`:""}
			${options.height ? `height: ${options.height};`:""}
		`}>
	`;
}