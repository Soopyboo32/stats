import { staticCss, thisClass, useRef } from "../helpers.js";
import { Icon } from "./Icon.js";
import { UsernameSearch } from "./components/UsernameSearch.js";
import { buttonCss, colors, textboxCss } from "./css.js";

let headerCss = staticCss.named("header")`
    ${thisClass} {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 50px;
        background-color: ${colors.background_light};
    }

    ${thisClass} div[data-lastpass-icon-root] {
        display: none;
    }
`

let headerSettingsButtonCss = buttonCss.named("header-settings-button")`${thisClass} {
	padding: 0;
	width: 30px;
	display: flex;
	align-items: center;
	justify-content: space-evenly;
}`

let rightContainerCss = staticCss.named("header-right-container")`${thisClass} {
	float: right;
	display: flex;
}`

let spacerCss = staticCss.named("spacer")`${thisClass} {
    width: 100%;
    height: 50px;
}`

let iconContainerCss = staticCss.named("icon-container")`
	${thisClass} {
		float: left;
		width: max-content;
		display: flex;
		align-items: center;
	}

    ${thisClass}:hover {
        cursor: pointer;
    }
`

let iconCss = staticCss.named("icon")`${thisClass} {
	width: 30px;
	height: 30px;
	margin: 10px;
	border-radius: 5px;
}`

let headerTextCss = staticCss.named("header-text")`${thisClass} {
	font-size: 20px;
}`

export function Header(search) {
	let iconContainer = useRef().onClick(() => {
		document.location.hash = "";
	})

	let settingsButton = useRef().onClick(() => {

	})

	return `
        <header ${headerCss}>
			<div ${iconContainer} ${iconContainerCss}>
				<img ${iconCss} src="https://avatars.githubusercontent.com/u/49228220?v=4" alt="Soopy Picture">
				<h1 ${headerTextCss}>Soopy Stats Viewer</h1>
			</div>
			<div ${rightContainerCss}>
				${UsernameSearch(search)}
				<button ${settingsButton} ${headerSettingsButtonCss}>${Icon("settings")}</button>
			</div>
        </header>

        <!-- Spacer -->
        <div ${spacerCss}></div>
    `
}