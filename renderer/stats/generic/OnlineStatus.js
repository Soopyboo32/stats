import { PlayerData } from "../../../api/PlayerData.js";
import { html, useRef } from "../../../helpers.js";

/**
 * @param {PlayerData} playerData 
 */
export function OnlineStatus(playerData) {
    let status = useRef();

    playerData.onUpdate(() => status.exists(), () => {
        //name.renderInner(playerData.username ?? "...");
    });

    console.log(playerData.playerData)

    return html`<span ${status}> ${playerData.playerData.onlineStatus ?? "..."}</span>`
}