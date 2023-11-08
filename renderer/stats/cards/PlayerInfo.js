import { Username } from "../generic/Username.js";
import { SbLevel } from "../skyblock/SbLevel.js";
import { OnlineState } from "../hypixel/OnlineState.js";
import { html } from "../../../helpers.js";
import { Networth } from "../skyblock/Networth.js";

export function PlayerInfo(playerData) {
	return html`
		${Username(playerData)} ${SbLevel(playerData, true, true)}
		<br>
		Currently: ${OnlineState(playerData)}
		<br>
		Networth: ${Networth(playerData)}
	`;
}