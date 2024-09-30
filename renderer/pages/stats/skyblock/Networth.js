import { PlayerData } from "../../../../api/PlayerData.js";
import { html, numberWithCommas, useRef } from "../../../../soopyframework/helpers.js";

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

/**
 * @param {PlayerData} playerData
 */
export function NetworthNoCosmetics(playerData) {
	return playerData.data.observe(()=>{
		let nw = playerData.getSbPlayerData()?.networthNoCosmetics;
		if (!nw) return "???";

		return "$" + numberWithCommas(Math.floor(nw));
	})
}
