import { PlayerData } from "../../../api/PlayerData.js";
import { html, useRef } from "../../../helpers.js";
import { MinecraftText } from "./MinecraftText.js";

/**
 * @param {PlayerData} playerData
 */
export function Username(playerData) {
	let name = useRef();

	playerData.onUpdate(() => name.exists(), () => {
		name.renderInner(MinecraftText(getName(playerData)));
	});

	return html`<span ${name}> ${MinecraftText(getName(playerData))} </span>`;
}

function getName(playerData) {
	if (!playerData.username) {
		return "...";
	}

	if (!playerData.playerData.prefix) {
		return playerData.username;
	}

	return playerData.playerData.prefix + playerData.playerData.name;
}