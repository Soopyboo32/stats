import { PlayerData } from "../../../api/PlayerData.js";
import { css, staticCss, thisClass, useRef } from "../../../helpers.js";
import { colors } from "../../css.js";

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

let tableCss = staticCss.named("table")`${thisClass} {
    height: 200px;
    overflow-y: auto;
    overflow-x: hidden;
}`

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
        //TODO: extract out to like FilterableList component or smth
        table = `<table>
            ${achievements.map(a => `
                <tr>
                    <td>${a}</td>
                </tr>
            `).join("")}
        </table>`
    }

    return `<div ${tableCss}>
        ${table}
    </div>`
}