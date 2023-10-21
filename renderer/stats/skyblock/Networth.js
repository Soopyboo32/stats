import { PlayerData } from "../../../api/PlayerData.js";
import { html, numberWithCommas, useRef } from "../../../helpers.js";

/**
 * @param {PlayerData} playerData
 */
export function Networth(playerData) {
	let networth = useRef();

	playerData.onUpdate(() => networth.exists(), () => {
		networth.renderInner(getNwStr(playerData.sbData.networth));
	});

	return html`<span ${networth}>${getNwStr(playerData.sbData.networth)}</span>`;
}

function getNwStr(nw) {
	if (!nw) return "???";

	return "$" + numberWithCommas(Math.floor(nw));
}