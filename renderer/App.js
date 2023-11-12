import { Observable } from "../Observable.js";
import { PlayerData } from "../api/PlayerData.js";
import { html, staticCss, thisClass, useRef } from "../helpers.js";
import { Header } from "./Header.js";
import { MainPage } from "./pages/main/MainPage.js";
import { colors } from "./css.js";
import { StatsPage } from "./pages/stats/StatsPage.js";
import { Leaderboard } from "./pages/leaderboard/LeaderboardPage.js";

let appCss = staticCss.named("app").css`${thisClass} {
	background-color: ${colors.background};
	font-family: 'Montserrat', serif;
	color: ${colors.text};
	width: 100vw;
	height: 100vh;
}`;

let contentDivCss = staticCss.named("content").css`${thisClass} {
	margin: 5px;
}`;

let appState = Observable.from({
	/** @type {string|undefined} */
	player: undefined,
	/** @type {string|undefined} */
	profile: undefined,
	/** @type {PlayerData|undefined} */
	playerData: undefined,
	/** @type {string|undefined} */
	lbType: undefined,
	largeHeader: true,
});

window.appState = appState;

export function App() {
	let contentDiv = useRef();

	function search(player, profile) {
		appState.get().player = player;
		appState.get().profile = profile;

		if (!player) {
			contentDiv.renderInner(MainPage(updateHash));
			appState.get().playerData = undefined;
			appState.get().largeHeader = true;
			return;
		}

		appState.get().playerData = PlayerData.load(player, profile);
		appState.get().largeHeader = false;

		contentDiv.renderInner(StatsPage(appState.get().playerData));
	}

	async function refreshData() {
		await appState.get().playerData?.loadData();
	}

	function updateHash() {
		if (document.location.hash !== "") {
			let [page, ...data] = document.location.hash.substring(1).split("/");
			switch (page) {
				case "stats": {
					let [player, profile] = data;
					appState.get().player = player;
					appState.get().profile = profile;

					setTimeout(() => {
						search(player, profile);
					});
					return true;
				}
				case "leaderboard": {
					let [lbtype] = data;
					appState.get().lbType = lbtype;

					setTimeout(() => {
						contentDiv.renderInner(Leaderboard(appState, updateHash));
						appState.get().largeHeader = false;
					});
					return true;
				}
			}
		}
		return false;
	}

	let loadMainPage = !updateHash();
	//Prevent header from zooming out on every refresh on non-main pages
	appState.get().largeHeader = loadMainPage;

	return html`
		<div ${appCss}>
			${Header(search, refreshData, appState)}

			<div ${contentDiv} ${contentDivCss}>
				${loadMainPage ? MainPage(updateHash) : ""}
			</div>
		</div>`;
}