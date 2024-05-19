import { resetSettings, settings } from "./settings.js";
import { SettingToggle } from "../../soopyframework/components/generic/settings/SettingToggle.js";
import { SettingElement } from "../../soopyframework/components/generic/settings/SettingElement.js";
import { SettingList } from "../../soopyframework/components/generic/settings/SettingList.js";
import { SettingDropdown } from "../../soopyframework/components/generic/settings/SettingDropdown.js";
import { SettingRadioSelect } from "../../soopyframework/components/generic/settings/SettingRadioSelect.js";
import { SettingButton } from "../../soopyframework/components/generic/settings/SettingButton.js";
import { Popup } from "../../soopyframework/components/generic/Popup.js";
import { ConfirmPopup } from "../../soopyframework/components/generic/popup/ConfirmPopup.js";
import { HCenter } from "../../soopyframework/components/generic/util/HCenter.js";

const themes = {
	dark: "Dark",
	light: "Light"
};

const hoverFormats = {
	minecraft: "Minecraft",
	fancy: "Fancy"
};

/**
 * @param {() => void} closeFn
 */
export function SettingsPage(closeFn) {
	return SettingList(
		//Maybe one day
		// SettingElement(
		// 	"Theme",
		// 	SettingRadioSelect(settings.get().theme, themes, newVal => settings.get().theme = newVal)
		// ),
		//TODO: implement this hover format
		SettingElement(
			"Hover Format",
			SettingRadioSelect(settings.get().hoverFormat, hoverFormats, newVal => settings.get().hoverFormat = newVal)
		),
		SettingElement(
			"Center Popups",
			SettingToggle(settings.get().centerPopups, newVal => settings.get().centerPopups = newVal)
		),
		//Testing for dropdown instead of radio button
		// SettingElement(
		// 	"Hover Format",
		// 	SettingDropdown(settings.get().hoverFormat, hoverFormats, newVal => settings.get().hoverFormat = newVal)
		// ),
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
		SettingElement(
			"Reset All Settings",
			SettingButton("Reset", async () => {
				if (!await ConfirmPopup(
					"Are you sure you want to reset all settings?",
					HCenter("This is not undo-able!")
				)) {
					return;
				}
				closeFn();
				resetSettings();
				Popup("Settings", SettingsPage);
			})
		)
	);
}