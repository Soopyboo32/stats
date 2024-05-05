import { html } from "../../../../soopyframework/helpers.js";
import { SettingDropdown } from "../../../../soopyframework/components/generic/settings/SettingDropdown.js";

export function Profile(playerData) {
	return playerData.data.observe(() => {
		let options = {};
		let best = playerData.getBestProfile();
		let current = playerData.getCurrentProfile();
		for (let prof of playerData.getData().sbData) {
			options[prof.profile_name] = prof.profile_name + (best === prof.profile_name ? " (Best)" : "") + (current === prof.profile_name ? " (Current)" : "");
		}

		//TODO: show profile members
		return html`
			Profile Name: ${SettingDropdown(playerData.getSbProfileData()?.profile_name, options, newV => playerData.getData().profile = newV)}
		`;
	});
}