import { PlayerData } from "../../../api/PlayerData.js";
import { html, useRef } from "../../../helpers.js";

/**
 * @param {PlayerData} playerData
 * @param integer
 */
export function SbLevel(playerData, integer = false) {
    let level = useRef();

    playerData.onUpdate(() => level.exists(), () => {
        level.renderInner(playerData.sbData.sbLvl?.toFixed(integer ? 0 : 2) ?? "???");
    });

    return html`<span ${level}>${playerData.sbData.sbLvl?.toFixed(integer ? 0 : 2) ?? "???"}</span>`
}