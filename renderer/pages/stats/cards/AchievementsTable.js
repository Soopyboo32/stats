import { PlayerData } from "../../../../api/PlayerData.js";
import { html, staticCss, thisClass, useRef } from "../../../../soopyframework/helpers.js";

let tableCss = staticCss.named("table").css`${thisClass} {
	height: 200px;
	overflow-y: auto;
	overflow-x: hidden;
}`;

/**
 * @param {PlayerData} playerData
 */
export function AchievementsTable(playerData) {
	return playerData.data.observe(() => {
		let achievements = playerData.getData().playerData.onetime_achievements;

		if (!achievements) {
			return html`Api missing data!`;
		}

		return html`
			<div ${tableCss}>
				<!-- TODO: extract out to like FilterableList component or smth	-->
				<table>
					${achievements.map(a => html`
						<tr>
							<td>${a}</td>
						</tr>
					`)}
				</table>
			</div>`;
	});
}