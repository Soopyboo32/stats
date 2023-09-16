import { PlayerData } from "../../api/PlayerData.js";
import { staticCss, thisClass, useRef } from "../../helpers.js";
import { cardCss } from "../css.js";
import { ErrorContent } from "./ErrorContent.js";
import { Username } from "./generic/Username.js";
import { AchievementsTable } from "./hypixel/AchievementsTable.js";
import { SbLevel } from "./skyblock/SbLevel.js";

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
        <div ${cardCss}>
            [${SbLevel(playerData, true)}] ${Username(playerData)}
        </div>
        <br>
        <div ${cardCss}>
        One time achievements: ${AchievementsTable(playerData)}
        </div>
    </div>`
}