import { css, html, staticCss, thisClass, useRef } from "../../helpers.js";
import { colors } from "../css.js";
import { Icon } from "../Icon.js";

let cardCss = staticCss.named("card").css`${thisClass} {
	background: ${colors.background_light_1};
	margin: 10px;
	padding: 10px;
	min-width: min(500px, calc(100% - 40px)); /* will take less than 500px if there is an overflow */
	max-width: calc(100% - 40%);
		/*border: 1px solid ${colors.primary_dark};*/
	border-radius: 5px;
	webkit-box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.05);
	-moz-box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.05);
	box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.05);
}`;

//TODO: hover anim, more button looks, ect
let arrowCss = staticCss.named("cardArrow").css`${thisClass} {
	/*float: right;*/
	cursor: pointer;
}`

let hrCss = staticCss.named("cardHr").css`${thisClass} {
	padding: 0;
}`

let cardTitleCss = staticCss.named("cardTitle").css`${thisClass} {
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-wrap: wrap;
	font-size: 22px;
}`

export function Card(title, contents, openFn) {
	let ref = useRef().onClick(() => {
		if (!openFn) return;
		openFn();
	});

	return html`
		<div ${cardCss}>
			<div ${cardTitleCss}>
				${title}
				${openFn ? `<div ${ref} ${arrowCss}>${Icon("arrow_forward")}</div>` : ""}
			</div>
			<!-- TODO: fix this hr not being the whole card? -->
			<hr ${hrCss}>
			${contents}
		</div>
	`;
}