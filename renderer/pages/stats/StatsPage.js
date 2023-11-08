import { PlayerData } from "../../../api/PlayerData.js";
import { html, staticCss, thisClass, useRef } from "../../../helpers.js";
import { Card } from "../../components/Card.js";
import { ErrorContent } from "./ErrorContent.js";
import { AchievementsTable } from "./cards/AchievementsTable.js";
import { PlayerInfo } from "./cards/PlayerInfo.js";
import { SlayerInfo } from "./cards/SlayerInfo.js";

let title = document.getElementById("title");

let contentCss = staticCss.named("content").css`${thisClass} {
	display: flex;
	justify-content: space-evenly;
	flex-wrap: wrap;
}`;

/**
 * @param {PlayerData} playerData
 */
export function StatsPage(playerData) {
	//TODO: change icon as well
	title.innerHTML = playerData.username + " | Soopy Stats Viewer";
	document.location.hash = "stats/" + playerData.username + (playerData.profile ? "/" + playerData.profile : "");

	let ref = useRef().onRemove(playerData.onUpdate(() => {
		title.innerHTML = playerData.username + " | Soopy Stats Viewer";
		document.location.hash = "stats/" + playerData.username + (playerData.profile ? "/" + playerData.profile : "");

		if (playerData.error) {
			ref.reRender(ErrorContent(playerData));
		}
	}));

	return html`
		<div ${ref} ${contentCss}>
			${Card("Overview", PlayerInfo(playerData), 400)}
			${Card("Slayers", SlayerInfo(playerData), 400)}
			${Card("One Time Achievements", AchievementsTable(playerData), 400)}
		</div>
	`;
}