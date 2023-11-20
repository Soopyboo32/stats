import { css, html, numberWithCommas, staticCss, thisClass, useRef } from "../../../helpers.js";
import { Card } from "../../components/Card.js";
import { getSoopyApiCache } from "../../../api/soopy.js";
import { Table } from "../../generic/Table.js";
import { Font } from "../../generic/Font.js";
import { invisibleCss } from "../../css.js";
import { Popup } from "../../generic/Popup.js";
import { StatsPage } from "../stats/StatsPage.js";
import { PlayerData } from "../../../api/PlayerData.js";

let contentCss = staticCss.named("content").css`${thisClass} {
	display: flex;
	justify-content: space-evenly;
	flex-wrap: wrap;
}`;

let title = document.getElementById("title");

/**
 * @template {{lbType: String}} T
 * @param appstate {Observable<T>}
 */
export function Leaderboard(appstate) {
	if (appstate.get().lbType) {
		Popup(
			lbConstants[appstate.get().lbType].display + " Leaderboard!",
			() => ActualLeaderboard(appstate.get().lbType),
			() => {
				appstate.get().lbType = "";
			});

		title.innerHTML = lbConstants[appstate.get().lbType].display + " Leaderboard | Soopy Stats Viewer";
	} else {
		title.innerHTML = "Leaderboards | Soopy Stats Viewer";
	}

	return html`
		<div ${contentCss}>
			${Object.keys(lbConstants).map(lbType => Card(
					`${lbConstants[lbType].display} Leaderboard`,
					ActualLeaderboardPage(lbType, 0, 10),
					() => {
						appstate.get().lbType = lbType;
					}
			)).join("")}
		</div>
	`;

}

function ActualLeaderboard(lbType) {
	return html`
		${ActualLeaderboardPage(lbType)}
	`;
}

function ActualLeaderboardPage(lbType, page = 0, displayCap = 100) {
	let div = useRef();
	let lbData = getSoopyApiCache(`lb/${lbType}/${page}`, (data) => {
		div.renderInner(ActualLbPageFromData(data.data.slice(0, displayCap), lbType, page));
	});

	return html`
		<div ${div}>
			${lbData
					? ActualLbPageFromData(lbData.data.slice(0, displayCap), lbType, page * 100)
					: `
						<div ${invisibleCss}>
							${ActualLbPageFromData(Array.from(Array(displayCap), () => ({})), lbType, page * 100)}
						</div>
					`
			}
		</div>
	`;
}

let profileTypeIcons = {
	"ironman": "♲",
	"bingo": "Ⓑ",
	"island": "☀"
};

let lbConstants = {
	"sbLvl": {
		display: "Skyblock Level",
		decimals: 2
	},
	"networth": {
		display: "Networth",
		decimals: 0
	},
	"catacombsLevel": {
		display: "Catacombs",
		decimals: 2
	},
	"skillAvg": {
		display: "Skill Average",
		decimals: 2
	},
	"skillAvgOver60": {
		display: "Skill Average (Uncapped)",
		decimals: 2
	},
	"totalSlayer": {
		display: "Slayer Exp",
		decimals: 0
	},
	"weight": {
		display: "Senither Weight",
		decimals: 0
	},
	"classAverage": {
		display: "Class Average",
		decimals: 2
	}
};

/**
 * @param data {StatNextToNameData[]}
 * @param lbType
 * @param start
 */
function ActualLbPageFromData(data, lbType, start) {
	return html`
		${Table({centeredElms: true},
				["Rank", "Username", lbConstants[lbType].display],
				...data.map((user, index) => {
					let username = (profileTypeIcons[user.gamemode] ? profileTypeIcons[user.gamemode] + " " : "") + user.username;
					if (user.username) {
						let ref = useRef().onClick(() => {
							let playerData = PlayerData.load(user.username);
							let titleText = title.innerHTML;
							Popup(user.username + "'s Stats", () => StatsPage(playerData), () => {
								title.innerHTML = titleText;
							});
						});
						username = html`
							<div ${ref} ${css`cursor: pointer;`}>${username}</div>`;
					}

					return [
						start + index + 1,
						username,
						Font("'Open Sans', sans-serif", numberWithCommas((user[lbType] || 0).toFixed(lbConstants[lbType].decimals)))
					];
				})
		)}
	`;
}