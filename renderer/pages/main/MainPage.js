import { html, staticCss, thisClass } from "../../../helpers.js";
import { Card } from "../../components/Card.js";

let title = document.getElementById("title");

let contentCss = staticCss.named("content").css`${thisClass} {
	display: flex;
	justify-content: space-evenly;
	flex-wrap: wrap;
}`;

export function MainPage(updateHash) {
	title.innerHTML = "Soopy Stats Viewer";

	return html`
		<!-- Wow, this is the main page! -->
		<div ${contentCss}>
			${Card("Leaderboards", "Some lb stuff idk", () => {
				//Open lb page
				document.location.hash = "leaderboard/";
				updateHash();
			})}
			${Card("Soopyboo32", "I wanted a quick button to my profile for testing<br>(im lazy ok deal with it)", () => {
				//Open lb page
				document.location.hash = "stats/soopyboo32";
				updateHash();
			})}
		</div>
	`;
}