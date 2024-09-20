import { html, Join, staticCss, thisClass, useRef } from "../../soopyframework/helpers.js";
import { Icon } from "../../soopyframework/components/generic/Icon.js";
import { buttonCss, colors, getBg, textboxCss } from "../../soopyframework/css.js";
import { PlayerHead } from "./PlayerHead.js";
import { MiningEvents } from "../pages/stats/cards/MiningEvents.js";
import { MinecraftText } from "./MinecraftText.js";
import { getSoopyApi, getSoopyApiCache } from "../../api/soopy.js";

let containerCss = staticCss.named("username-search-container").css`{
	${thisClass} {
		display: flex;
		align-items: center;
	}

	${thisClass} div[data-lastpass-icon-root] {
		display: none;
	}
}`;

let headerUsernameInputCss = textboxCss.named("username-input").css`{
	${thisClass} {
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
		margin-left: 0;
		margin-right: 0;
		border-right: none;
		height: 30px;
		padding-top: 0;
		padding-bottom: 0;
		-webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
		-moz-box-sizing: border-box; /* Firefox, other Gecko */
		box-sizing: border-box;
	}

	${thisClass}:focus {
		background: transparent;
		border-right: none;
		border-bottom-left-radius: 0;
	}

	${thisClass}:focus::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
		color: ${colors.grey};
	}

	${thisClass}:focus:-ms-input-placeholder { /* Internet Explorer 10-11 */
		color: ${colors.grey};
	}

	${thisClass}:focus::-ms-input-placeholder { /* Microsoft Edge */
		color: ${colors.grey};
	}
}`;

let headerSearchButtonCss = buttonCss.named("search-button").css`{
	${thisClass} {
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		border-left: none;
		margin-left: 0;
		margin-right: 0;
		padding: 0;
		width: 30px;
		height: 30px;
		border-width: 1px;
	}

	${thisClass}:hover {
		background-color: ${colors.primary_dark};
	}

	${headerUsernameInputCss}:focus ~ ${thisClass} {
		background-color: transparent;
		border: 1px solid ${colors.primary_dark};
		color: ${colors.primary_dark};
		border-left: none;
	}
}`;

let headerSearchIconContainerCss = staticCss.named("search-icon-container").css`{
	${thisClass} {
		outline: 1px solid transparent;
		border-radius: 5px;
		width: 100%;
		height: 100%;
		border: none;
		display: flex;
		align-items: center;
		justify-content: space-evenly;
	}

	${thisClass}:hover {
		background-color: ${colors.primary_dark_hover};
		outline: 1px solid ${colors.primary_dark_hover};
		transition: 0.15s;
		transition-timing-function: ease-in;
	}

	${headerUsernameInputCss}:focus ~ ${headerSearchButtonCss} > ${thisClass}:hover {
		outline: 1px solid transparent;
		background-color: transparent;
		color: ${colors.primary_dark_hover};
	}
}`;

let autoCompleteCss = staticCss.named("autoComplete").css`{
	${thisClass} {
		position: relative;
		display: none;
	}

	${thisClass}:has(~ ${headerUsernameInputCss}:focus) {
		display: block;
	}

	${thisClass} > div {
		position: absolute;
		z-index: 1;
		width: max-content;
		top: 14px;
		background-color: ${getBg(2)};
		border-bottom-left-radius: 10px;
		border-bottom-right-radius: 10px;
		border: 1px solid ${colors.primary_dark};
	}
}`;

/**
 * @param {(String) => any} callback
 */
export function UsernameSearch(callback) {
	//TODO: tab completion!

	let input = useRef().onEnterKey(() => {
		let searchPlayer = input.getElm().value;
		if (searchPlayer.trim() === "") return;
		input.getElm().value = "";
		input.getElm().blur();

		callback(searchPlayer);
	}).onKeyDown(async () => {
		await new Promise(r => setTimeout(r, 0));

		let searchPlayer = input.getElm().value;
		if (searchPlayer.trim() === "") {
			autoCompleteResults.renderInner("");
			return;
		}

		let autocompleteRes = await getSoopyApi("tabcompletedetailed/" + searchPlayer);
		if (input.getElm().value !== searchPlayer) return;

		autoCompleteResults.renderInner(Join(autocompleteRes.data.map(data => AutoCompleteResult(data[1], data[0], () => {
			input.getElm().value = "";

			callback(data[0]);
		}))));
	});

	let searchButton = useRef().onClick(() => {
		if (!input.exists()) return;
		let searchPlayer = input.getElm().value;
		if (searchPlayer.trim() === "") return;
		input.getElm().value = "";

		callback(searchPlayer);
	});

	let autoCompleteResults = useRef();

	return html`
		<div ${containerCss}>
			<div ${autoCompleteCss}>
				<div ${autoCompleteResults}>
				</div>
			</div>
			<input ${input} type="search" placeholder="Username" autocomplete="off" ${headerUsernameInputCss}>
			<button ${searchButton} ${headerSearchButtonCss}>
				<div ${headerSearchIconContainerCss}>
					${Icon("search")}
				</div>
			</button>
		</div>
	`;
}

let autoCompleteResultCss = buttonCss.named("autoCompleteResult").css`{
	${thisClass} {
		font-size: 20px;
	}
}`;

function AutoCompleteResult(uuid, username, onClick) {
	let autoCompleteResult = useRef().onMouseDown(() => {
		onClick();
	});

	return html`
		<div ${autoCompleteResultCss} ${autoCompleteResult}>
			${PlayerHead(uuid, {height: "20px", width: "20px", fadeInAlways: true})}
			${username}
		</div>
	`;
}