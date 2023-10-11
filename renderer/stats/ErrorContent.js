import { PlayerData } from "../../api/PlayerData.js";
import { html, useRef } from "../../helpers.js";
import { Content } from "./Content.js";

let title = document.getElementById("title");

/**
 * @param {PlayerData} playerData
 */
export function ErrorContent(playerData) {
	let ref = useRef();

	title.innerHTML = "Soopy Stats Viewer";
	document.location.hash = playerData.username + (playerData.profile ? "/" + playerData.profile : "");

	playerData.onUpdate(() => ref.exists(), () => {
		document.location.hash = playerData.username + (playerData.profile ? "/" + playerData.profile : "");

		if (!playerData.error) {
			ref.reRender(Content(playerData));
		}
	});

	return html`
		<div ${ref}>
			Error loading stats for ${playerData.username}
			<br>
			${playerData.error}
		</div>`;
}