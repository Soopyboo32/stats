import { PlayerData } from "../../../api/PlayerData.js";
import { html, staticCss, thisClass, useRef } from "../../../soopyframework/helpers.js";
import { StatsPage } from "./StatsPage.js";
import { Card } from "../../../soopyframework/components/generic/Card.js";
import { buttonCss } from "../../../soopyframework/css.js";

let title = document.getElementById("title");

let contentCss = staticCss.named("content").css`${thisClass} {
	display: flex;
	justify-content: space-evenly;
	flex-wrap: wrap;
}`;

/**
 * @param {PlayerData} playerData
 */
export function ErrorContent(playerData) {
	title.innerHTML = "Soopy Stats Viewer";
	document.location.hash = "/stats/" + playerData.getData().username + (playerData.getData().profile ? "/" + playerData.getData().profile : "");

	let ref = useRef().onRemove(playerData.onUpdate(() => {
		document.location.hash = "/stats/" + playerData.getData().username + (playerData.getData().profile ? "/" + playerData.getData().profile : "");

		if (!playerData.getData().error) {
			ref.reRender(StatsPage(playerData));
		}
	}));

	let retryButton = useRef().onClick(()=>{
		playerData.loadData().then();

		ref.reRender(StatsPage(playerData));
	})

	return html`
		<div ${ref} ${contentCss}>
			${Card(
			`Error loading stats for ${playerData.getData().username}`,
			html`
					${playerData.getData().error}<br>
					<button ${buttonCss} ${retryButton}>Retry</button>
				`
			)}
		</div>
	`;
}