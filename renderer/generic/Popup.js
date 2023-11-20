import { html, staticCss, thisClass, useRef } from "../../helpers.js";
import { colors } from "../css.js";
import { Icon } from "../Icon.js";

let wrapperCss = staticCss.named("popupWrapper").css`${thisClass} {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background-color: rgba(0,0,0,0.5);
	display: flex;
	justify-content: space-evenly;
	flex-wrap: wrap;
	overflow-y: scroll;
	overscroll-behavior: none;
}`

let popupCss = staticCss.named("popup").css`${thisClass} {
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
let closeCss = staticCss.named("popupClose").css`${thisClass} {
	/*float: right;*/
	cursor: pointer;
}`;

let hrCss = staticCss.named("cardHr").css`${thisClass} {
	padding: 0;
}`;

let popupTitleCss = staticCss.named("popupTitle").css`${thisClass} {
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-wrap: wrap;
	font-size: 22px;
}`;

/**
 * @param title {string}
 * @param content {(close: () => undefined) => string}
 * @param onclose {() => any}
 */
export function Popup(title, content, onclose = () => 0) {
	let wrapper = document.createElement("modal");

	let closeFn = () => {
		wrapper.remove();
		onclose();
	};
	let close = useRef().onClick(closeFn);

	wrapper.className = wrapperCss.getAllClasses().join(" ");
	wrapper.innerHTML = html`
		<div ${popupCss}>
			<div ${popupTitleCss}>
				${title}
				${onclose ? `<div ${close} ${closeCss}>${Icon("close")}</div>` : ""}
			</div>
			<!-- TODO: fix this hr not being the whole card? -->
			<hr ${hrCss}>
			${content(closeFn)}
		</div>
	`;

	document.body.appendChild(wrapper);
}