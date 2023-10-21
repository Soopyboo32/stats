import { Username } from "../generic/Username.js";
import { SbLevel } from "../skyblock/SbLevel.js";
import { OnlineState } from "./OnlineState.js";
import { html, useRef } from "../../../helpers.js";
import { Networth } from "../skyblock/Networth.js";

export function PlayerInfo(playerData) {
	return html`
		${Username(playerData)} [${SbLevel(playerData, true)}]
		<br>
		Currently: ${OnlineState(playerData)}
		<br>
		Networth: ${Networth(playerData)}
	`;
}