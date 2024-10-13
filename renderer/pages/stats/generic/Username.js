import { PlayerData } from "../../../../api/PlayerData.js";
import { html, useRef } from "../../../../soopyframework/helpers.js";
import { MinecraftText } from "../../../components/MinecraftText.js";

/**
 * @param {PlayerData} playerData
 */
export function Username(playerData) {
	return html`${playerData.data.observe(() => MinecraftText(getName(playerData)))}`;
}

/**
 * @returns {string}
 */
function getName(playerData) {
	if (!playerData.getData().username) {
		return "...";
	}

	if (!playerData.getData().playerData.prefix) {
		return playerData.getData().username;
	}

	return playerData.getData().playerData.prefix + playerData.getData().username;
}