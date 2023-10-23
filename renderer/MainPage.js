import { html } from "../helpers.js";
import { MinecraftText } from "./generic/MinecraftText.js";

let title = document.getElementById("title");

export function MainPage() {
	title.innerHTML = "Soopy Stats Viewer";

	return html`
		Wow, this is the main page!<br>
		${MinecraftText("TESTING §zCHROMA!!!!§rASDASDASD")}<br>
		${MinecraftText("§zCHROMAAAAAAAAAA!!!!")}<br>
		${MinecraftText("§zCHROMAAAAAAAAAA!!!!")}<br>
		${MinecraftText("§zCHROMAAAAAAAAAA!!!!")}<br>
	`;
}