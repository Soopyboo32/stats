import { PlayerData } from "../../../api/PlayerData.js";
import { html, useRef } from "../../../helpers.js";
import { StatsPage } from "./StatsPage.js";

let title = document.getElementById("title");

/**
 * @param {PlayerData} playerData
 */
export function ErrorContent(playerData) {
	title.innerHTML = "Soopy Stats Viewer";
	document.location.hash = playerData.username + (playerData.profile ? "/" + playerData.profile : "");

	let ref = useRef().onRemove(playerData.onUpdate(() => {
		document.location.hash = playerData.username + (playerData.profile ? "/" + playerData.profile : "");

		if (!playerData.error) {
			ref.reRender(StatsPage(playerData));
		}
	}));

	return html`
		<div ${ref}>
			Error loading stats for ${playerData.username}
			<br>
			${playerData.error}
		</div>
	`;
}