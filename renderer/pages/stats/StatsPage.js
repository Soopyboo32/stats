import { PlayerData } from "../../../api/PlayerData.js";
import { html, staticCss, thisClass, useRef } from "../../../soopyframework/helpers.js";
import { Card } from "../../../soopyframework/components/generic/Card.js";
import { ErrorContent } from "./ErrorContent.js";
import { AchievementsTable } from "./cards/AchievementsTable.js";
import { PlayerInfo } from "./cards/PlayerInfo.js";
import { SlayerInfo } from "./cards/SlayerInfo.js";
import { Inventory } from "./cards/Inventory.js";

let title = document.getElementById("title");

let contentCss = staticCss.named("content").css`${thisClass} {
	display: flex;
	justify-content: space-evenly;
	flex-wrap: wrap;
}`;

/**
 * @param {PlayerData} playerData
 * @param height
 */
export function StatsPage(playerData, height = 0) {
	//TODO: change icon as well
	title.innerHTML = playerData.getData().username + " | Soopy Stats Viewer";

	let ref = useRef().onRemove(playerData.onUpdate(() => {
		title.innerHTML = playerData.getData().username + " | Soopy Stats Viewer";

		if (playerData.getData().error) {
			ref.reRender(ErrorContent(playerData));
		}
	}));

	setTimeout(()=>{
		if (playerData.getData().error) {
			ref.reRender(ErrorContent(playerData));
		}
	},0)

	return html`
		<div ${ref} ${contentCss}>
			${Card("Overview", PlayerInfo(playerData), height+1)}
			${Card("Slayers", SlayerInfo(playerData), height+1)}
			${Card("One Time Achievements", AchievementsTable(playerData), height+1)}
			${Card("Inventory", Inventory(playerData), height+1)}
		</div>
	`;
}