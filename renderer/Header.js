import { Observable } from "../Observable.js";
import { css, html, staticCss, thisClass, useRef } from "../helpers.js";
import { Icon } from "./Icon.js";
import { UsernameSearch } from "./components/UsernameSearch.js";
import { buttonCss, colors } from "./css.js";

let headerCss = staticCss.named("header").css` ${thisClass} {
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	background-color: ${colors.background_light_2};
	display: flex;
	justify-content: space-between;
	align-items: center;
	webkit-box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.1);
	-moz-box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.1);
	box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.1);
	transition: 0.5s;
}`;

let headerRightButtonCss = buttonCss.named("header-right-button").css`${thisClass} {
	padding: 0;
	aspect-ratio: 1;
	margin-left: 0;
	width: 30px;
	height: 30px;
	display: flex;
	align-items: center;
	justify-content: space-evenly;
}`;

let headerContainerCss = staticCss.named("header-container").css`${thisClass} {
	display: flex;
	height: 100%;
	align-items: center;
}`;

let spacerCss = staticCss.named("spacer").css`${thisClass} {
	width: 100%;
}`;

let iconContainerCss = staticCss.named("icon-container").css`
${thisClass} {
	display: flex;
	align-items: center;
	height: 100%;
}

${thisClass}:hover {
	cursor: pointer;
}
`;

let h1Css = staticCss.named("h1css")`${thisClass} {
	transition: 0.5s;
}`;


let iconCss = staticCss.named("icon").css`${thisClass} {
	width: 30px;
	height: 30px;
	margin: 10px;
	border-radius: 5px;
}`;

let canRefresh = new Observable({
	can: true,
});

export function Header(search, refreshData, appState) {
	let header = useRef();
	let spacer = useRef();

	header.onRemove(appState.onChange((path, data) => {
		if (!path.startsWith("player")) return;

		header.css`height: ${data.player ? 50 : 75}px;`;
		spacer.css`height: ${data.player ? 50 : 75}px;`;
	}));

	//language=html
	return html`
		<header ${header} ${headerCss} ${css`
			height: ${appState.data.player ? 50 : 75}px;
		`}>
			${HeaderLeftElement(search, appState)}

			<div ${headerContainerCss}>
				${UsernameSearch(search)}
			</div>

			${HeaderRightElement(refreshData)}
		</header>

		<!-- Spacer -->
		<div ${spacer} ${spacerCss} ${css`
			height: ${appState.data.player ? 50 : 75}px;
		`}></div>
	`;
}


function HeaderLeftElement(search, appState) {
	let h1Elm = useRef().onRemove(appState.onChange((path, data) => {
		if (!path.startsWith("player")) return;

		h1Elm.css`font-size: ${data.player ? 20 : 25}px;`;
	}));

	let iconContainer = useRef().onClick(() => {
		document.location.hash = "";
		search();
	});

	return html`
		<div ${iconContainer} ${iconContainerCss}>
			<img ${iconCss} src="https://avatars.githubusercontent.com/u/49228220?v=4" alt="Soopy Picture">
			<h1 ${h1Elm} ${h1Css} ${css`
				font-size: ${appState.data.player ? 20 : 25}px;
			`}>Soopy Stats Viewer</h1>
		</div>
	`;
}

function HeaderRightElement(refreshData) {
	let settingsButton = useRef().onClick(() => {
		alert("This button does nothing yet!");
	});

	let refreshButton = useRef().onClick(() => {
		if (!canRefresh.data.can) return;

		//TODO: spin animation?
		//TODO: countdown animation
		refreshData();
		canRefresh.data.can = false;

		setTimeout(() => {
			canRefresh.data.can = true;
		}, 10000);
	});

	canRefresh.onChange((p, d) => {
		if (!p.startsWith("can")) return;

		refreshButton.css`background-color: ${d.can ? colors.primary_dark : colors.grey};`;
	});


	return html`
		<div ${headerContainerCss}>
			<button ${refreshButton} ${headerRightButtonCss}
					${css`background-color: ${canRefresh.data.can ? colors.primary_dark : colors.grey};`}>
				${Icon("refresh")}
			</button>
			<button ${settingsButton} ${headerRightButtonCss}>${Icon("settings")}</button>
		</div>`;
}
