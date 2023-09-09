import { PlayerData } from "../../../api/PlayerData.js";
import { useRef } from "../../../helpers.js";

/**
 * @param {PlayerData} playerData 
 */
export function SbLevel(playerData) {
    let level = useRef();

    playerData.onUpdate(() => level.exists(), () => {
        level.renderInner(playerData.sbLvl || "...");
    });

    return `<span ${level}>${playerData.sbLvl || "..."}</span>`
}