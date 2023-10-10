import { PlayerData } from "../../api/PlayerData.js";
import { staticCss, thisClass, useRef } from "../../helpers.js";
import { Card } from "../components/Card.js";
import { ErrorContent } from "./ErrorContent.js";
import { AchievementsTable } from "./hypixel/AchievementsTable.js";
import { PlayerInfo } from "./hypixel/PlayerInfo.js";

let contentCss = staticCss.named("content")`${thisClass} {
    display: flex;
    justify-content: space-evenly;
}`

/**
 * @param {PlayerData} playerData 
 */
export function Content(playerData) {
	let ref = useRef();

	//TODO: change icon aswell
	title.innerHTML = playerData.username + " | Soopy Stats Viewer"
	document.location.hash = playerData.username + (playerData.profile ? "/" + playerData.profile : "");

	playerData.onUpdate(() => ref.exists(), () => {
		title.innerHTML = playerData.username + " | Soopy Stats Viewer"
		document.location.hash = playerData.username + (playerData.profile ? "/" + playerData.profile : "");

		if (playerData.error) {
			ref.reRender(ErrorContent(playerData))
		}
	})

	return `<div ${ref} ${contentCss}>
		${Card(PlayerInfo(playerData))}
        <br>
		${Card(AchievementsTable(playerData))}
    </div>`
}