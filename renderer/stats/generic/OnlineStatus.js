import { PlayerData } from "../../../api/PlayerData.js";
import { useRef } from "../../../helpers.js";

/**
 * @param {PlayerData} playerData 
 */
export function OnlineStatus(playerData) {
    let status = useRef();

    playerData.onUpdate(() => status.exists(), () => {
        //name.renderInner(playerData.username ?? "...");
    });

    return `<span ${status}> ${playerData.onlineStatus ?? "..."}</span>`
}