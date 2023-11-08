import { PlayerData } from "../../../api/PlayerData.js";
import { html, staticCss, thisClass, useRef } from "../../../helpers.js";

/**
 * @param {PlayerData} playerData
 */
export function AchievementsTable(playerData) {
	let table = useRef().onRemove(playerData.onUpdate(() => {
		table.renderInner(genTable(playerData));
	}));

	return html`
		<span ${table}>
        ${genTable(playerData)}
    </span>`;
}

let tableCss = staticCss.named("table").css`${thisClass} {
	height: 200px;
	overflow-y: auto;
	overflow-x: hidden;
}`;

/**
 * @param {PlayerData} playerData
 */
function genTable(playerData) {
	let achievements = playerData.playerData.onetime_achievements;

	if (!achievements) {
		return "Api missing data!";
	}

	let table = "Loading...";

	if (achievements) {
		//TODO: extract out to like FilterableList component or smth
		table = `<table>
            ${achievements.map(a => `
                <tr>
                    <td>${a}</td>
                </tr>
            `).join("")}
        </table>`;
	}

	return html`
		<div ${tableCss}>
			${table}
		</div>`;
}