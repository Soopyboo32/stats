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

let appState = new Observable({
	player: undefined,
	profile: undefined,
	playerData: undefined,
	lbType: undefined,
});

window.appState = appState;

export function App() {
	let contentDiv = useRef();

	function search(player, profile) {
		appState.data.player = player;
		appState.data.profile = profile;

		if (!player) {
			contentDiv.renderInner(MainPage(updateHash));
			appState.data.playerData = undefined;
			return;
		}

		appState.data.playerData = PlayerData.load(player, profile);

		contentDiv.renderInner(StatsPage(appState.data.playerData));
	}

	async function refreshData() {
		await appState.data.playerData?.loadData();
	}

	function updateHash() {
		if (document.location.hash !== "") {
			let [page, ...data] = document.location.hash.substring(1).split("/");
			switch (page) {
				case "stats": {
					let [player, profile] = data;
					appState.data.player = player;
					appState.data.profile = profile;

					setTimeout(() => {
						search(player, profile);
					});
					return true;
				}
				case "leaderboard": {
					let [lbtype] = data;
					appState.data.lbType = lbtype;

					setTimeout(() => {
						contentDiv.renderInner(Leaderboard(appState, updateHash));
					});
					return true;
				}
			}
		}
		return false;
	}

	let loadMainPage = !updateHash();

	return html`
		<div ${appCss}>
			${Header(search, refreshData, appState)}

			<div ${contentDiv} ${contentDivCss}>
				${loadMainPage ? MainPage(updateHash) : ""}
			</div>
		</div>`;
}