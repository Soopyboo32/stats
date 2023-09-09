import { PlayerData } from "../../../api/PlayerData.js";
import { css, useRef } from "../../../helpers.js";

/**
 * @param {PlayerData} playerData 
 */
export function AchievementsTable(playerData) {
    let table = useRef();

    playerData.onUpdate(() => table.exists(), () => {
        table.renderInner(genTable(playerData.playerData.onetime_achievements));
    });

    return `<div ${table} ${css`
        height: 200px;
        overflow-y: auto;
        border: 1px solid black;
    `}>
        ${genTable(playerData.playerData.onetime_achievements)}
    </div>`
}

function genTable(achievements) {
    if (!achievements) {
        return "Loading...";
    }

    return `
        <table>
            ${achievements.map(a => `
                <tr>
                    <td>${a}</td>
                </tr>
            `).join("")}
        </table>
    `
}