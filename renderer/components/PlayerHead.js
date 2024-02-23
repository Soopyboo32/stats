import { css, html, staticCss, thisClass } from "../../soopyframework/helpers.js";
import { SOOPY_API_URL } from "../../api/soopy.js";
import { Img } from "../../soopyframework/components/vanilla/img.js";

let fakeImgCss = staticCss.named("fake-img").css`${thisClass} {
	aspect-ratio: 1;
	width: auto;
	height: auto;
	display: inline-block;
	padding-right: 2px;
}`;

let headCss = fakeImgCss.named("head").css`{
	*:has(> ${thisClass}) { /*parent*/
		position: relative;
	}

	${thisClass} {
		image-rendering: pixelated;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
}`;


/**
 * @param uuid
 * @param options {{width: String?, height: String?}}
 * @returns {HTML}
 * @constructor
 */
export function PlayerHead(uuid, options = {}) {
	return html`
		<div ${fakeImgCss} ${css`
			${options.width ? `width: ${options.width};` : ""}
			${options.height ? `height: ${options.height};` : ""}
		`}></div>
		${uuid ? Img(`${SOOPY_API_URL}/skin/${uuid}/head.png`, {
			cssRaw: css`
				${options.width ? `width: ${options.width};` : ""}
				${options.height ? `height: ${options.height};` : ""}
			`,
			css: headCss,
			width: 8,
			height: 8,
		}) : ""}
	`;
}