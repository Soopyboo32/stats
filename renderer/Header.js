import { css, staticCss, thisClass, useRef } from "../helpers.js";
import { Icon } from "./Icon.js";
import { UsernameSearch } from "./components/UsernameSearch.js";
import { buttonCss, colors, textboxCss } from "./css.js";

let headerCss = staticCss.named("header")`
    ${thisClass} {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        background-color: ${colors.background_light_2};
		display: flex;
		justify-content: space-between;
        align-items: center;
		webkit-box-shadow: 0px 5px 5px 0px rgba(0,0,0,0.1);
		-moz-box-shadow: 0px 5px 5px 0px rgba(0,0,0,0.1);
		box-shadow: 0px 5px 5px 0px rgba(0,0,0,0.1);
		transition: 0.5s;
    }
`

let headerSettingsButtonCss = buttonCss.named("header-settings-button")`${thisClass} {
	padding: 0;
	height: calc(100% - 20px);
	aspect-ratio: 1;
	display: flex;
	align-items: center;
	justify-content: space-evenly;
}`

let rightContainerCss = staticCss.named("header-right-container")`${thisClass} {
	display: flex;
	height: 100%;
}`

let centerContainerCss = staticCss.named("header-right-container")`${thisClass} {
	display: flex;
	height: 100%;
}`

let spacerCss = staticCss.named("spacer")`${thisClass} {
    width: 100%;
}`

let iconContainerCss = staticCss.named("icon-container")`
	${thisClass} {
		display: flex;
		align-items: center;
		height: 100%;
	}

    ${thisClass}:hover {
        cursor: pointer;
    }
`

let iconCss = staticCss.named("icon")`${thisClass} {
    margin: 10px;
    border-radius: 5px;
	aspect-ratio: 1;
	height: calc(100% - 20px);
}`

let h1Css = staticCss.named("h1css")`${thisClass} {
	transition: 0.5s;
}`


export function Header(search, appState) {
	let header = useRef();
	let spacer = useRef();
	let h1Elm = useRef();

	let iconContainer = useRef().onClick(() => {
		document.location.hash = "";
		search();
	});

	let settingsButton = useRef().onClick(() => {
		alert("This button does nothing yet!")
	});

	header.onRemove(appState.data.player.onChange(p => {
		header.css`
			height: ${p ? 50 : 75}px;
		`
		spacer.css`
			height: ${p ? 50 : 75}px;
		`

		h1Elm.css`
			font-size: ${p ? 20 : 30}px;
		`
	}));

	return `
        <header ${header} ${headerCss} ${css`
			height: ${appState.data.player.data ? 50 : 75}px;
		`}>
			<div ${iconContainer} ${iconContainerCss}>
				<img ${iconCss} src="https://avatars.githubusercontent.com/u/49228220?v=4" alt="Soopy Picture">
				<h1 ${h1Elm} ${h1Css} ${css`
					font-size: ${appState.data.player.data ? 20 : 30}px;
				`}>Soopy Stats Viewer</h1>
			</div>
			<div ${centerContainerCss}>
				${UsernameSearch(search)}
			</div>
			<div ${rightContainerCss}>
				<button ${settingsButton} ${headerSettingsButtonCss}>${Icon("settings")}</button>
			</div>
        </header>

        <!-- Spacer -->
        <div ${spacer} ${spacerCss} ${css`
			height: ${appState.data.player.data ? 50 : 75}px;
		`}></div>
    `
}