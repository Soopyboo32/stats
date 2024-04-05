import { settings } from "./settings.js";
import { SettingToggle } from "../../soopyframework/components/generic/settings/SettingToggle.js";
import { SettingElement } from "../../soopyframework/components/generic/settings/SettingElement.js";
import { SettingList } from "../../soopyframework/components/generic/settings/SettingList.js";

/**
 * @param {() => void} closeFn
 */
export function SettingsPage(closeFn) {
	return SettingList(
		SettingElement(
			"Show UUID In Overview",
			SettingToggle(settings.get().showUUID, newVal => settings.get().showUUID = newVal)
		)
	);
}