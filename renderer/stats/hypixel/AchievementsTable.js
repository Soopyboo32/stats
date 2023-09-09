import { PlayerData } from "../../../api/PlayerData.js";
import { css, useRef } from "../../../helpers.js";

/**
 * @param {PlayerData} playerData 
 */
export function AchievementsTable(playerData) {
    let table = useRef();

    playerData.onUpdate(() => table.exists(), () => {
        table.renderInner(genTable(playerData));
    });

    return `<span ${table}>
        ${genTable(playerData)}
    </span>`
}

/**
 * @param {PlayerData} playerData 
 */
function genTable(playerData) {
    if (playerData.missingData.has("onetime_achievements")) {
        return "Api missing data!";
    }

    let achievements = playerData.playerData.onetime_achievements;

    let table = "Loading...";

    if (achievements) {
        table = `<table>
            ${achievements.map(a => `
                <tr>
                    <td>${a}</td>
                </tr>
            `).join("")}
        </table>`
    }

    return `<div ${css`
        height: 200px;
        overflow-y: auto;
        border: 1px solid black;
    `}>
        ${table}
    </div>`
}