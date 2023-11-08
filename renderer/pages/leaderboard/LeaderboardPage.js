import { html, useRef } from "../../../helpers.js";

let title = document.getElementById("title");

/**
 * @template {{lbType: String}} T
 * @param appstate {Observable<T>}
 */
export function Leaderboard(appstate, updateHash) {
	if (!appstate.data.lbType) {
		title.innerHTML = "Leaderboards | Soopy Stats Viewer";

		return html`
			Wow this is the main lb page!<br>
			<button ${useRef().onClick(() => {
				document.location.hash = "leaderboard/sbLvl";
				updateHash();
			})}>sblvl lb
			</button>
		`;
	}

	title.innerHTML = appstate.data.lbType + " Leaderboard | Soopy Stats Viewer";

	return html`
		Wow, this is the lb page for ${appstate.data.lbType}!
	`;
}