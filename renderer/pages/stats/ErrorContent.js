import { PlayerData } from "../../../api/PlayerData.js";
import { html, useRef } from "../../../helpers.js";
import { StatsPage } from "./StatsPage.js";

let title = document.getElementById("title");

/**
 * @param {PlayerData} playerData
 */
export function ErrorContent(playerData) {
	title.innerHTML = "Soopy Stats Viewer";
	document.location.hash = "/" + playerData.getData().username + (playerData.getData().profile ? "/" + playerData.getData().profile : "");

	let ref = useRef().onRemove(playerData.onUpdate(() => {
		document.location.hash = "/" + playerData.getData().username + (playerData.getData().profile ? "/" + playerData.getData().profile : "");

		if (!playerData.getData().error) {
			ref.reRender(StatsPage(playerData));
		}
	}));

	return html`
		<div ${ref}>
			Error loading stats for ${playerData.getData().username}
			<br>
			${playerData.getData().error}
		</div>
	`;
}