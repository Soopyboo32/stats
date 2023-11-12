import { PlayerData } from "../../../../api/PlayerData.js";
import { html, useRef } from "../../../../helpers.js";
import { MinecraftText } from "../../../generic/MinecraftText.js";

/**
 * @param {PlayerData} playerData
 */
export function Username(playerData) {
	return html`${playerData.data.observe(() => MinecraftText(getName(playerData)))}`;
}

function getName(playerData) {
	if (!playerData.getData().username) {
		return "...";
	}

	if (!playerData.getData().playerData.prefix) {
		return playerData.getData().username;
	}

	return playerData.getData().playerData.prefix + playerData.getData().username;
}