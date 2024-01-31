import { html } from "../../../../soopyframework/helpers.js";
import { TimeSince } from "../../../../soopyframework/components/generic/TimeSince.js";

let stateNameOverrides = {
	"ApiDisabled": "Api Disabled"
};

export function OnlineState(playerData) {
	return playerData.data.observe(() => {
		if (!playerData.getData().playerData.status) {
			return "...";
		}

		let time = html`<small> For ${TimeSince(playerData.getData().playerData.status.since)}</small>`;
		if (!playerData.getData().playerData.status.since) time = "";

		return (stateNameOverrides[playerData.getData().playerData.status.state] || playerData.getData().playerData.status.state) + time;
	});
}