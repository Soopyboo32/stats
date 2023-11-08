import { PlayerData } from "../../../../api/PlayerData.js";
import { html, numberWithCommas, useRef } from "../../../../helpers.js";

/**
 * @param {PlayerData} playerData
 */
export function Networth(playerData) {
	let networth = useRef().onRemove(playerData.onUpdate(() => {
		networth.renderInner(getNwStr(playerData.getSbPlayerData()?.networth?.total));
	}));

	return html`<span ${networth}>${getNwStr(playerData.getSbPlayerData()?.networth?.total)}</span>`;
}

function getNwStr(nw) {
	if (!nw) return "???";

	return "$" + numberWithCommas(Math.floor(nw));
}