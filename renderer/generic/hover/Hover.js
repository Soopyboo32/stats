import { staticCss, thisClass } from "../../../helpers.js";
import { colors } from "../../css.js";

let startColor = "#25025C";
let endColor = "#180134";

//TODO: better border
let wrapperCss = staticCss.named("hover-wrapper").css`{
	${thisClass} {
		border: 1px solid #120313;
		position: absolute;
		border-radius: 3px;
		background: linear-gradient(to bottom, ${startColor}, ${endColor});
		padding: 2px;
	}
}`;

let internalCss = staticCss.named("hover-inner").css`{
	${thisClass} {
		padding: 4px;
		background: #120313;
	}
}`

/**
 * @param ref {Reference}
 * @param elm {() => HTML | undefined}
 */
export function Hover(ref, elm) {
	let wrapper = document.createElement("div");
	wrapper.className = wrapperCss.getAllClasses().join(" ");
	let wrapperInner = document.createElement("div");
	wrapperInner.className = internalCss.getAllClasses().join(" ");
	wrapper.appendChild(wrapperInner);

	let onScreen = false;

	ref.onHoverEnter((e) => {
		let data = elm();
		if (!data) return;
		document.body.appendChild(wrapper);
		onScreen = true;
		wrapperInner.innerHTML = data;
		position(wrapper, e);
	});

	ref.onHoverMove((e) => {
		if(!onScreen) return;
		position(wrapper, e);
	});

	ref.onHoverExit((e) => {
		if(!onScreen) return;
		wrapperInner.innerHTML = "";
		document.body.removeChild(wrapper);
	});

	ref.onRemove((e) => {
		if(!onScreen) return;
		wrapper.remove();
		wrapper = undefined;
	});
}

/**
 * @param wrapper {HTMLDivElement}
 * @param e {MouseEvent}
 */
function position(wrapper, e) {
	let x = e.x + 20;
	let y = e.y - 30;

	wrapper.style.left = x + "px";
	wrapper.style.top = y + "px";
}