import { Username } from "../generic/Username.js";
import { SbLevel } from "../skyblock/SbLevel.js";
import { OnlineState } from "./OnlineState.js";

export function PlayerInfo(playerData) {
    return `
        [${SbLevel(playerData, true)}] ${Username(playerData)}
        <br>
        ${OnlineState(playerData)}
    `
}