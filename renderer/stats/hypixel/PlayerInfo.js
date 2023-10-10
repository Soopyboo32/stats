import { Username } from "../generic/Username.js";
import { SbLevel } from "../skyblock/SbLevel.js";
import { OnlineState } from "./OnlineState.js";
import { html } from "../../../helpers.js";

export function PlayerInfo(playerData) {
    return html`
        [${SbLevel(playerData, true)}] ${Username(playerData)}
        <br>
        ${OnlineState(playerData)}
    `
}