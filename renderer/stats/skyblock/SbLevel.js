import { PlayerData } from "../../../api/PlayerData.js";
import { html, useRef } from "../../../helpers.js";
import { Hover } from "../../generic/hover/Hover.js";
import { Lore } from "../../generic/hover/Lore.js";
import { MinecraftText } from "../../generic/MinecraftText.js";

/**
 * @param {PlayerData} playerData
 * @param integer
 * @param minecraft
 */
export function SbLevel(playerData, integer = false, minecraft = true) {
	let level = useRef();

	playerData.onUpdate(() => level.exists(), () => {
		level.renderInner(getVal(playerData, integer, minecraft));
	});

	Hover(level, () => {
		if (playerData.sbData.sbLvl === undefined) return undefined;

		//TODO: show global & gamemode lb positions
		return Lore("§7Level §e" + playerData.sbData.sbLvl.toFixed(2));
	});

	return html`<span ${level}>${getVal(playerData, integer, minecraft)}</span>`;
}

function getVal(playerData, integer, minecraft) {

	if (minecraft) {
		return MinecraftText(
			getBracketColor(playerData.sbData.sbLvl)
			+ "["
			+ getColor(playerData.sbData.sbLvl)
			+ (playerData.sbData.sbLvl?.floored(integer ? 0 : 2)?.toFixed(integer ? 0 : 2) ?? "???")
			+ getBracketColor(playerData.sbData.sbLvl)
			+ "]"
		);
	}
	return (playerData.sbData.sbLvl?.floored(integer ? 0 : 2)?.toFixed(integer ? 0 : 2) ?? "???");
}

function getColor(level) {
	if(level >= 480) return "§4"
	if(level >= 440) return "§c"
	if(level >= 400) return "§6"
	if(level >= 360) return "§5"
	if(level >= 320) return "§d"
	if(level >= 280) return "§9"
	if(level >= 240) return "§3"
	if(level >= 200) return "§b"
	if(level >= 160) return "§2"
	if(level >= 120) return "§a"
	if(level >= 80) return "§e"
	if(level >= 40) return "§f"
	return "§8";
}

function getBracketColor(level) {
	return "§7";
}