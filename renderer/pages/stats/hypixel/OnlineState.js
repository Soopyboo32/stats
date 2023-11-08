import { html, useRef } from "../../../../helpers.js";
import TimeSince from "../generic/TimeSince.js";

export function OnlineState(playerData) {
	let state = getState(playerData);

	let ref = useRef().onRemove(playerData.onUpdate(() => {
		ref.renderInner(getState(playerData));
	}));

	return html`<span ${ref}> ${state} </span>`;
}

let stateNameOverrides = {
	"ApiDisabled": "Api Disabled"
};

function getState(playerData) {
	if (!playerData.playerData.status) {
		return "...";
	}

	let time = html`<small> For ${TimeSince(playerData.playerData.status.since)}</small>`;
	if (!playerData.playerData.status.since) time = "";

	return (stateNameOverrides[playerData.playerData.status.state] || playerData.playerData.status.state) + time;
}
