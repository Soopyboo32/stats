import { Observable } from "../../soopyframework/Observable.js";

export const settings = Observable.of({
	theme: "dark",
	showUUID: false,
	debug: false,
	hoverFormat: "minecraft"
});

let defaultSettings = JSON.parse(JSON.stringify(settings.get()));

if (localStorage.getItem("ssv-settings")) {
	let savedSettings = JSON.parse(localStorage.getItem("ssv-settings"));
	Object.keys(settings.get()).forEach((key) => {
		if (key in savedSettings) {
			settings.get()[key] = savedSettings[key];
		}
	});

	saveSettings(); //just incase invalid data or defaults changed or smth
}

settings.onChange(saveSettings);

function saveSettings() {
	//Only save modified settings
	let settingsToSave = {};
	for (let key in settings.get()) {
		if (JSON.stringify(settings.get()[key]) !== JSON.stringify(defaultSettings[key])) {
			settingsToSave[key] = settings.get()[key];
		}
	}

	localStorage.setItem("ssv-settings", JSON.stringify(settingsToSave));
}

window.settings = settings;