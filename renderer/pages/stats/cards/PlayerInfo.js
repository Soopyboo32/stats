import { Username } from "../generic/Username.js";
import { SbLevel } from "../skyblock/SbLevel.js";
import { OnlineState } from "../hypixel/OnlineState.js";
import { html } from "../../../../soopyframework/helpers.js";
import { Networth } from "../skyblock/Networth.js";
import { PlayerHead } from "../../../components/PlayerHead.js";

export function PlayerInfo(playerData) {
	return html`
		${playerData.data.observe(() => PlayerHead(playerData.getData().uuid, {height: "1em"}))}
		${Username(playerData)} ${SbLevel(playerData, true, true)}
		<br>
		Currently: ${OnlineState(playerData)}
		<br>
		Networth: ${Networth(playerData)}
		${settings.observe(() => settings.get().showUUID && settings.get().debug ? html`
			<br>
			UUID: ${playerData.data.observe(() => playerData.getData().uuid)}
		` : "")}
	`;
}