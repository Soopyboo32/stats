import { PlayerData } from "../../../../api/PlayerData.js";
import { html, useRef } from "../../../../soopyframework/helpers.js";
import { Hover } from "../../../../soopyframework/components/generic/hover/Hover.js";
import { Lore } from "../../../components/hover/Lore.js";
import { MinecraftText } from "../../../components/MinecraftText.js";

/**
 * @param {PlayerData} playerData
 * @param integer
 * @param minecraft
 */
export function SbLevel(playerData, integer = false, minecraft = true) {
	let level = useRef();

	Hover(level, () => {
		if (playerData.getSbPlayerData()?.sb_exp === undefined) return undefined;

		//TODO: show global & gamemode lb positions
		return Lore("§7Level §e" + (playerData.getSbPlayerData().sb_exp / 100).toFixed(2).replace(".", "§7."));
	});

	return html`<span ${level}>${playerData.data.observe(() => {
		let exp = playerData.getSbPlayerData()?.sb_exp;
		let expStr = exp === undefined ? "???" : (exp / 100).floored(integer ? 0 : 2)?.toFixed(integer ? 0 : 2);

		if (minecraft) {
			return MinecraftText(
					getBracketColor(exp ? exp / 100 : undefined)
					+ "["
					+ getColor(exp ? exp / 100 : undefined)
					+ expStr
					+ getBracketColor(exp ? exp / 100 : undefined)
					+ "]"
			);
		}
		return expStr;
	})}</span>`;
}

function getColor(level) {
	if (level >= 480) return "§4";
	if (level >= 440) return "§c";
	if (level >= 400) return "§6";
	if (level >= 360) return "§5";
	if (level >= 320) return "§d";
	if (level >= 280) return "§9";
	if (level >= 240) return "§3";
	if (level >= 200) return "§b";
	if (level >= 160) return "§2";
	if (level >= 120) return "§a";
	if (level >= 80) return "§e";
	if (level >= 40) return "§f";
	return "§7";
}

function getBracketColor(level) {
	return "§8";
}