import { css, html, staticCss, thisClass, useRef } from "../../helpers.js";

let minecraftTextStyle = staticCss.named("minecraft-text").css`{
	@font-face {
		font-family: "Minecraft";
		src: url(/fonts/Minecraft.ttf);
	}

	${thisClass} {
		font-family: "Minecraft", serif;
	}
}`;

//TODO: make shadow: false work
export function MinecraftText(str, {shadow = true} = {}) {
	return `<span ${minecraftTextStyle}>${addColors(str, shadow)}</span>`;
}

let colors = {
	'0': '000000',
	'1': '0000AA',
	'2': '00AA00',
	'3': '00AAAA',
	'4': 'AA0000',
	'5': 'AA00AA',
	'6': 'FFAA00',
	'7': 'AAAAAA',
	'8': '555555',
	'9': '5555FF',
	'a': '55FF55',
	'b': '55FFFF',
	'c': 'FF5555',
	'd': 'FF55FF',
	'e': 'FFFF55',
	'f': 'FFFFFF',
	'z': "CHROMA",
};

let shadowColors = {
	'0': '000000',
	'1': '00002A',
	'2': '002A00',
	'3': '002A2A',
	'4': '2A0000',
	'5': '2A002A',
	'6': '2B2A00',
	'7': '2A2A2A',
	'8': '151515',
	'9': '15153F',
	'a': '153F15',
	'b': '153F3F',
	'c': '3F1515',
	'd': '3F153F',
	'e': '3F3F15',
	'f': '3F3F3F',
};

let special = {
	'l': 'font-weight:bold',
	'm': 'text-decoration:line-through',
	'n': 'text-decoration:underline',
	'o': 'font-style:italic',
	'r': undefined //reset
};

function addColors(str, shadow = true) {
	let ret = [];
	let chars = str.split("");

	ret.push(enterSection("f", [], shadow));

	let sectionLen = 0;
	let color = "f";
	let specialT = [];
	let nextIsColor = false;
	for (let char of chars) {
		if (char === "§") {
			nextIsColor = true;
			continue;
		}
		if (nextIsColor) {
			char = char.toLowerCase();

			if (char === "r") {
				if (color === "f" && specialT.length === 0) {
					//skip unneeded color codes
					nextIsColor = false;
					continue;
				}
				color = "f";
				specialT = [];
			} else if (special[char]) {
				let oldLen = specialT.length;
				specialT.push(char);
				specialT = [...new Set(specialT)];
				if (oldLen === specialT.length) {
					//skip unneeded color codes
					nextIsColor = false;
					continue;
				}
			} else {
				if (color === char && specialT.length === 0) {
					//skip unneeded color codes
					nextIsColor = false;
					continue;
				}
				color = char;
				specialT = [];
			}

			ret[ret.length - 1] += exitSection();

			if (sectionLen === 0) ret.pop(); //remove sections with 0 chars

			ret.push(enterSection(color, specialT, shadow));
			sectionLen = 0;
			nextIsColor = false;
			continue;
		}
		ret[ret.length - 1] += char;
		sectionLen++;
	}

	ret[ret.length - 1] += exitSection();

	return ret.join("");
}

let chromaGradient = `
	repeating-linear-gradient(
		-45deg,
		hsl(calc(0 * 360 / 10), 100%, 50%),
		hsl(calc(1 * 360 / 10), 100%, 50%),
		hsl(calc(2 * 360 / 10), 100%, 50%),
		hsl(calc(3 * 360 / 10), 100%, 50%),
		hsl(calc(4 * 360 / 10), 100%, 50%),
		hsl(calc(5 * 360 / 10), 100%, 50%),
		hsl(calc(6 * 360 / 10), 100%, 50%),
		hsl(calc(7 * 360 / 10), 100%, 50%),
		hsl(calc(8 * 360 / 10), 100%, 50%),
		hsl(calc(9 * 360 / 10), 100%, 50%),
		hsl(calc(10 * 360 / 10), 100%, 50%) 100px
	)
`;

let chromaShadowGradient = `
	repeating-linear-gradient(
		-45deg,
		hsl(calc(0 * 360 / 10), 50%, 20%),
		hsl(calc(1 * 360 / 10), 50%, 20%),
		hsl(calc(2 * 360 / 10), 50%, 20%),
		hsl(calc(3 * 360 / 10), 50%, 20%),
		hsl(calc(4 * 360 / 10), 50%, 20%),
		hsl(calc(5 * 360 / 10), 50%, 20%),
		hsl(calc(6 * 360 / 10), 50%, 20%),
		hsl(calc(7 * 360 / 10), 50%, 20%),
		hsl(calc(8 * 360 / 10), 50%, 20%),
		hsl(calc(9 * 360 / 10), 50%, 20%),
		hsl(calc(10 * 360 / 10), 50%, 20%) 100px
	)
`;

let chromaCss = staticCss.named("chroma-text").css`{
	${thisClass} {
		background-image: ${chromaGradient};
		background-clip: text;
		-webkit-background-clip: text;
		color: transparent;
		-webkit-text-fill-color: transparent;
		animation-name: ${thisClass.uuid}-background;
		animation-iteration-count: infinite;
		animation-duration: 40000s;
		animation-timing-function: linear;
		animation-direction: normal;
		background-size: 142px 142px;
		background-origin: padding-box;
		position: relative;
	}

	@keyframes ${thisClass.uuid}-background {
		from {
			background-position-x: 0;
		}

		to {
			background-position-x: 1000000px;
		}
	}
}`;

let chromaShadowShadowCss = staticCss.named("chroma-shadow-shadow").css`{
	${thisClass} {
		display: inline-block;
		background-image: ${chromaShadowGradient};
		background-clip: text;
		-webkit-background-clip: text;
		color: transparent;
		-webkit-text-fill-color: transparent;
		animation-name: ${chromaCss.getClassName}-background;
		animation-iteration-count: infinite;
		animation-duration: 40000s;
		animation-timing-function: linear;
		animation-direction: normal;
		background-size: 142px 142px;
		background-origin: padding-box;
		position: relative;
		top: 2px;
		left: 2px;
		padding-right: 1px;
	}
}`;

let chromaShadowCss = staticCss.named("chroma-shadow-text").css`{
	${thisClass} {
		display: inline-block;
		width: 0;
		overflow: visible;
	}

	${thisClass} > span {
		background-image: ${chromaGradient};
		background-size: 142px 142px;
		background-origin: padding-box;
		background-clip: text;
		-webkit-background-clip: text;
		position: relative;
		top: -2px;
		left: -2px;
		animation-name: ${chromaCss.getClassName()}-background;
		animation-iteration-count: infinite;
		animation-duration: 40000s;
		animation-timing-function: linear;
		animation-direction: normal;
	}
}`;

function enterSection(color, specialC = [], shadow = true) {
	if (color === "z") {
		let ref = useRef();
		let refInner = useRef();
		let oldOffset = 0;
		let specialCss = specialC.map(v => special[v]).join(";");

		setTimeout(() => {
			oldOffset = updateChroma(ref, refInner, specialCss, oldOffset);
		});

		let id = setInterval(() => {
			oldOffset = updateChroma(ref, refInner, specialCss, oldOffset);
		}, 1000);

		ref.onRemove(() => clearInterval(id));

		if (!shadow) {
			return html`<span ${ref} ${chromaCss} ${css`
			  ${specialC.map(v => special[v]).join(";")}
			`}>`;
		}

		return html`<span ${ref} ${chromaShadowShadowCss} ${css`
		  ${specialC.map(v => special[v]).join(";")}
		`}><span ${refInner} ${chromaShadowCss}><span></span></span>`;
	}
	return html`<span ${css`
	  color: #${colors[color] || colors["f"]};
	  ${shadow ? `text-shadow: 2px 2px #${shadowColors[color] || shadowColors["f"]};` : ""}
	  ${specialC.map(v => special[v]).join(";")}
	`}>`;
}

/**
 * @param ref {Reference}
 * @param refInner {Reference}
 * @param specialC {string}
 * @param oldOffset {number}
 */
function updateChroma(ref, refInner, specialC, oldOffset) {
	if (!ref.exists()) return;
	let offset = ref.getElm().offsetTop + ref.getElm().offsetLeft;
	if (offset !== oldOffset) {
		ref.css`
			background-position-y: ${-offset}px;
			${specialC}
		`;
		refInner.getElm().children[0].style.backgroundPositionY = (-offset) + "px";
		refInner.getElm().children[0].innerText = ref.getElm().childNodes[1].textContent;
	}

	return offset;
}

function exitSection() {
	return html`</span>`;
}