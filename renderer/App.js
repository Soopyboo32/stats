import { Observable } from "../Observable.js";
import { PlayerData } from "../api/PlayerData.js";
import { html, staticCss, thisClass, useRef } from "../helpers.js";
import { Header } from "./Header.js";
import { MainPage } from "./MainPage.js";
import { colors } from "./css.js";
import { Content } from "./stats/Content.js";

let appCss = staticCss.named("app").css`${thisClass} {
	background-color: ${colors.background};
	font-family: 'Montserrat', serif;
	color: ${colors.text};
	width: 100vw;
	height: 100vh;
}`;

let appState = new Observable({
	player: undefined,
	profile: undefined,
	playerData: undefined,
});

export function App() {
	let contentDiv = useRef();

	function search(player, profile) {
		appState.data.player = player;
		appState.data.profile = profile;

		if (!player) {
			contentDiv.renderInner(MainPage());
			appState.data.playerData = undefined;
			return;
		}

		appState.data.playerData = PlayerData.load(player, profile);

		contentDiv.renderInner(Content(appState.data.playerData));
	}

	async function refreshData() {
		await appState.data.playerData?.loadData();
	}

	if (document.location.hash !== "") {
		let [player, profile] = document.location.hash.substring(1).split("/");
		appState.data.player = player;
		appState.data.profile = profile;

		setTimeout(() => {
			search(player, profile);
		});
	}

	return html`
		<div ${appCss}>
			${Header(search, refreshData, appState)}

			<div ${contentDiv}>
				${MainPage()}
			</div>
		</div>`;
}