import {html, Join, staticCss, thisClass, useRef} from "../../../soopyframework/helpers.js";
import { Card } from "../../../soopyframework/components/generic/Card.js";
import { MiningEvents } from "../stats/cards/MiningEvents.js";
import {MinecraftText} from "../../components/MinecraftText.js";
import {settings} from "../../settings/settings.js";

let title = document.getElementById("title");

let contentCss = staticCss.named("content").css`${thisClass} {
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
}`;

export function MainPage(updateHash) {
	title.innerHTML = "Soopy Stats Viewer";

	return html`
		<!-- Wow, this is the main page! -->
		<div ${contentCss}>
			${Card("Leaderboards", "Some lb stuff idk", 1, () => {
				//Open lb page
				document.location.hash = "/leaderboard/";
				updateHash();
			})}
			${Card("Soopyboo32", html`I wanted a quick button to my profile for testing<br>(im lazy ok deal with it)`, 1, () => {
				//Open lb page
				document.location.hash = "/stats/Soopyboo32";
				updateHash();
			})}
			${MiningEvents()}
            ${settings.observe(() => {
                if (settings.get().debug) {
					let outRef = useRef();
                    let textRef = useRef().onChange(e=>{
						let lines = textRef.getElm().value.split("\n");
						outRef.renderInner(Join(lines.map(line => MinecraftText("§k" + line)), html`<br>`));
					}).onKeyUp(() => {
						let lines = textRef.getElm().value.split("\n");
						outRef.renderInner(Join(lines.map(line => MinecraftText("§k" + line)), html`<br>`));
					})
                    return Card("Formatted text playground", html`
                        <textarea ${textRef}></textarea><br>
                        <div ${outRef}></div>
                    `, 1, () => {
                    })
				}
                return "";
			})}
		</div>
	`;
}