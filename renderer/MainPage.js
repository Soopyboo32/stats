import { html } from "../helpers.js";

let title = document.getElementById("title");

export function MainPage() {
	title.innerHTML = "Soopy Stats Viewer";

	return html`
		Wow, this is the main page!
	`;
}