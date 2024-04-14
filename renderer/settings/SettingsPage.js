import { settings } from "./settings.js";
import { SettingToggle } from "../../soopyframework/components/generic/settings/SettingToggle.js";
import { SettingElement } from "../../soopyframework/components/generic/settings/SettingElement.js";
import { SettingList } from "../../soopyframework/components/generic/settings/SettingList.js";
import { SettingDropdown } from "../../soopyframework/components/generic/settings/SettingDropdown.js";
import { SettingRadioSelect } from "../../soopyframework/components/generic/settings/SettingRadioSelect.js";

const hoverFormats = {
	minecraft: "Minecraft",
	fancy: "Fancy"
};

/**
 * @param {() => void} closeFn
 */
export function SettingsPage(closeFn) {
	return SettingList(
		SettingElement(
			"Debug",
			SettingToggle(settings.get().debug, newVal => settings.get().debug = newVal)
		),
		SettingElement(
			"Show UUID In Overview",
			SettingToggle(settings.get().showUUID, newVal => settings.get().showUUID = newVal),
			{
				observe: settings,
				shouldShow: () => settings.get().debug,
			}
		),
		//TODO: implement this hover format
		SettingElement(
			"Hover Format",
			SettingRadioSelect(settings.get().hoverFormat, hoverFormats, newVal => settings.get().hoverFormat = newVal)
		)
	);
}