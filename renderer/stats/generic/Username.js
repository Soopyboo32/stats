import { PlayerData } from "../../../api/PlayerData.js";
import { useRef } from "../../../helpers.js";

/**
 * @param {PlayerData} playerData 
 */
export function Username(playerData) {
    let name = useRef();

    playerData.onUpdate(() => name.exists(), () => {
        name.renderInner(playerData.username || "...");
    });

    return `<span ${name}>${playerData.username || "..."}</span>`
}