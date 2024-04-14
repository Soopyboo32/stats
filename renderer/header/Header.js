import { Observable } from "../../soopyframework/Observable.js";
import { css, html, staticCss, thisClass, useRef } from "../../soopyframework/helpers.js";
import { Icon } from "../../soopyframework/components/generic/Icon.js";
import { UsernameSearch } from "../components/UsernameSearch.js";
import { buttonCss, colors, getBg } from "../../soopyframework/css.js";
import { Popup } from "../../soopyframework/components/generic/Popup.js";
import { SettingsPage } from "../settings/SettingsPage.js";

let headerCss = staticCss.named("header").css`{
	${thisClass} {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 50px;
		background-color: ${getBg(2)};
		display: flex;
		justify-content: space-between;
		align-items: center;
		webkit-box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.1);
		-moz-box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.1);
		box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.1);
		transition: 0.5s;
		z-index: 1;
	}

	@media only screen and (max-width: 600px) {
		${thisClass} {
			flex-direction: column;
			height: unset !important;
			position: relative;
		}
	}
}`;

let headerTallCss = headerCss.named("header-tall").css`${thisClass} {
	height: 75px;
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

let spacerCss = staticCss.named("spacer").css`{
	${thisClass} {
		width: 100%;
		height: 50px;
	}

	@media only screen and (max-width: 600px) {
		${thisClass} {
			display: none;
		}
	}
}`;

let spacerTallCss = spacerCss.named("spacer-tall").css`${thisClass} {
	height: 75px;
}`;

let iconContainerCss = staticCss.named("icon-container").css`{
	${thisClass} {
		display: flex;
		align-items: center;
		height: 100%;
	}

	${thisClass}:hover {
		cursor: pointer;
	}
}`;

let h1Css = staticCss.named("h1css").css`${thisClass} {
	transition: 0.5s;
}`;


let iconCss = staticCss.named("icon").css`${thisClass} {
	width: 30px;
	height: 30px;
	margin: 10px;
	border-radius: 5px;
}`;

let canRefresh = Observable.of(true);

//TODO: sidebar
export function Header(search, refreshData, appState) {
	let header = useRef();
	let spacer = useRef();

	header.onRemove(appState.onChange((path, data) => {
		if (!path.startsWith("largeHeader")) return;

		header.css(data.largeHeader ? headerTallCss : headerCss);
		spacer.css(data.largeHeader ? spacerTallCss : spacerCss);
	}));

	//language=html
	return html`
		<header ${header} ${appState.get().largeHeader ? headerTallCss : headerCss}>
			${HeaderLeftElement(search, appState)}

			<div ${headerContainerCss}>
				${UsernameSearch(search)}
			</div>

			${HeaderRightElement(refreshData)}
		</header>

		<!-- Spacer -->
		<div ${spacer} ${appState.get().largeHeader ? spacerTallCss : spacerCss}></div>
	`;
}


function HeaderLeftElement(search, appState) {
	let h1Elm = useRef().onRemove(appState.onChange((path, data) => {
		if (!path.startsWith("largeHeader")) return;

		h1Elm.css`font-size: ${data.largeHeader ? 25 : 20}px;`;
	}));

	let iconContainer = useRef().onClick(() => {
		document.location.hash = "/";
		search();
	});

	return html`
		<div ${iconContainer} ${iconContainerCss}>
			<img ${iconCss} src="https://avatars.githubusercontent.com/u/49228220?v=4" alt="Soopy Picture">
			<h1 ${h1Elm} ${h1Css} ${css`
				font-size: ${appState.get().largeHeader ? 25 : 20}px;
			`}>Soopy Stats Viewer</h1>
		</div>
	`;
}

function HeaderRightElement(refreshData) {
	let settingsButton = useRef().onClick(() => {
		Popup("Settings", SettingsPage);
	});

	let refreshButton = useRef().onClick(() => {
		if (!canRefresh.get()) return;

		//TODO: spin animation?
		//TODO: countdown animation
		refreshData();
		canRefresh.set(false);

		setTimeout(() => {
			canRefresh.set(true);
		}, 10000);
	});

	canRefresh.onChange((p, d) => {
		refreshButton.css`background-color: ${d ? colors.primary_dark : colors.grey};`;
	});

	return html`
		<div ${headerContainerCss}>
			<button ${refreshButton} ${headerRightButtonCss}
					${css`background-color: ${canRefresh.get() ? colors.primary_dark : colors.grey};`}>
				${Icon("refresh")}
			</button>
			<button ${settingsButton} ${headerRightButtonCss}>${Icon("settings")}</button>
		</div>`;
}
