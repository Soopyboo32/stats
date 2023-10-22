import { PlayerData } from "../../../api/PlayerData.js";
import { html, useRef } from "../../../helpers.js";
import { Hover } from "../../generic/hover/Hover.js";
import { Lore } from "../../generic/hover/Lore.js";

/**
 * @param {PlayerData} playerData
 * @param integer
 */
export function SbLevel(playerData, integer = false) {
	let level = useRef();

	playerData.onUpdate(() => level.exists(), () => {
		level.renderInner(playerData.sbData.sbLvl?.floored(integer ? 0 : 2)?.toFixed(integer ? 0 : 2) ?? "???");
	});

	Hover(level, () => {
		if (playerData.sbData.sbLvl === undefined) return undefined;

		//TODO: show global & gamemode lb positions
		return Lore("§7Level §e" + playerData.sbData.sbLvl.toFixed(2));
	});

	return html`<span ${level}>${playerData.sbData.sbLvl?.floored(integer ? 0 : 2)?.toFixed(integer ? 0 : 2) ?? "???"}</span>`;
}