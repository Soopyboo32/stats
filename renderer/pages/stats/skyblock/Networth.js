import { PlayerData } from "../../../../api/PlayerData.js";
import { html, numberWithCommas, useRef } from "../../../../helpers.js";

/**
 * @param {PlayerData} playerData
 */
export function Networth(playerData) {
	return playerData.data.observe(()=>{
		let nw = playerData.getSbPlayerData()?.networth?.total;
		if (!nw) return "???";

		return "$" + numberWithCommas(Math.floor(nw));
	})
}