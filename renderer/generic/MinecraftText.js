import { css, html, staticCss, thisClass } from "../../helpers.js";

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
	return `<span ${minecraftTextStyle}>${addColors(str)}</span>`;
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

function addColors(str) {
	let ret = [];
	let chars = str.split("");

	ret.push(enterSection("f"));

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

			ret.push(enterSection(color, specialT));
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

function enterSection(color, specialC = []) {
	return html`<span ${css`
		color: #${colors[color] || colors["f"]};
		text-shadow: 2px 2px #${shadowColors[color] || shadowColors["f"]};
		${specialC.map(v => special[v]).join(";")}
	`}>`;
}

function exitSection() {
	return html`</span>`;
}