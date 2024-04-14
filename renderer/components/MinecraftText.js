import { css, html, staticCss, thisClass, useRef } from "../../soopyframework/helpers.js";
import { getTextWidth } from "../../soopyframework/util/textWidth.js";

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

let charWidths = computeCharWidths();
let widthToChars = getWidthToChars(charWidths);
document.fonts.addEventListener("loadingdone", (event) => {
	charWidths = computeCharWidths();
	widthToChars = getWidthToChars(charWidths);
});

function computeCharWidths() {
	let res = new Map();
	for (let i = " ".codePointAt(0); i <= "~".codePointAt(0); i++) {
	// for (let i = 0; i <= 128; i++) {
		let char = String.fromCharCode(i);
		res.set(char, getTextWidth(char, "normal 12px Minecraft"));
	}
	return res;
}

function getWidthToChars(charWidths) {
	let res = new Map();
	for (let [char, width] of charWidths) {
		if (!res.has(width)) res.set(width, []);
		res.get(width).push(char);
	}
	return res;
}

function addColors(str, shadow = true) {
	let ret = [];
	let chars = str.split("");

	ret.push(enterSection("f", [], shadow));

	let sectionLen = 0;
	let color = "f";
	let specialT = [];
	let nextIsColor = false;
	let magic = false;
	for (let char of chars) {
		if (char === "§") {
			nextIsColor = true;
			continue;
		}
		if (nextIsColor) {
			char = char.toLowerCase();

			if (char === "k") {
				magic = true;
			} else if (char === "r") {
				if (color === "f" && specialT.length === 0 && !magic) {
					//skip unneeded color codes
					nextIsColor = false;
					continue;
				}
				color = "f";
				specialT = [];
				magic = false;
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
				if (color === char && specialT.length === 0 && !magic) {
					//skip unneeded color codes
					nextIsColor = false;
					continue;
				}
				color = char;
				specialT = [];
				magic = false;
			}

			ret[ret.length - 1] += exitSection();

			if (sectionLen === 0) ret.pop(); //remove sections with 0 chars

			ret.push(enterSection(color, specialT, shadow));
			sectionLen = 0;
			nextIsColor = false;
			continue;
		}
		if (magic) {
			let charWidth = charWidths.get(char) || -1;
			ret[ret.length - 1] += `<span data-magic-width="${charWidth}">${char}</span>`;
		} else {
			ret[ret.length - 1] += char;
		}
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
		animation-name: ${chromaCss.getClassName()}-background;
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
		white-space: nowrap;
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

		let id2 = setInterval(() => {
			oldOffset = updateChroma(ref, refInner, specialCss, oldOffset);
		}, 50);

		setTimeout(() => clearInterval(id2), 5000);

		ref.onRemove(() => {
			clearInterval(id);
			clearInterval(id2);
		});

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

let pageOpen = Date.now();

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
		let timeOffset = (Date.now() - pageOpen) / 1000 / 40000 * 1000000;
		ref.css`
			background-position-y: ${timeOffset - offset}px;
			${specialC}
		`;
		refInner.getElm().children[0].style.backgroundPositionY = (timeOffset - offset) + "px";
	}

	let innerText = "";
	let childNodes = ref.getElm().childNodes;
	for (let i = 1; i < childNodes.length; i++) {
		innerText += childNodes[i].textContent;
	}

	if (refInner.getElm().children[0].innerText !== innerText) {
		refInner.getElm().children[0].innerText = innerText;
	}

	return offset;
}

function exitSection() {
	return html`</span>`;
}

function animateMagic() {
	let magicElements = document.querySelectorAll("[data-magic-width]");
	for (let elm of magicElements) {
		let width = parseFloat(elm.dataset.magicWidth);
		let chars = widthToChars.get(width);
		if (!chars) continue;
		elm.innerText = chars[Math.floor(chars.length * Math.random())];
	}

	window.requestAnimationFrame(animateMagic);
}

window.requestAnimationFrame(animateMagic);