import { PlayerData } from "../../../api/PlayerData.js";
import { useRef } from "../../../helpers.js";

/**
 * @param {PlayerData} playerData 
 */
export function SbLevel(playerData) {
    let level = useRef();

    playerData.onUpdate(() => level.exists(), () => {
        level.renderInner(playerData.sbData.sbLvl || "...");
    });

    return `<span ${level}>${playerData.sbData.sbLvl || "..."}</span>`
}