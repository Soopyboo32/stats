import { PlayerData } from "../../../api/PlayerData.js";
import { html, useRef } from "../../../helpers.js";

/**
 * @param {PlayerData} playerData 
 */
export function Username(playerData) {
    let name = useRef();

    playerData.onUpdate(() => name.exists(), () => {
        name.renderInner(playerData.username ?? "...");
    });

    return html`<span ${name}> ${playerData.username ?? "..."}</span>`
}