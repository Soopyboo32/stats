import { Observable } from "../Observable.js";
import { PlayerData } from "../api/PlayerData.js";
import { staticCss, thisClass, useRef } from "../helpers.js";
import { Header } from "./Header.js";
import { MainPage } from "./MainPage.js";
import { colors } from "./css.js";
import { Content } from "./stats/Content.js";

let bodyCss = staticCss.named("body").css`${thisClass} {
    background-color: ${colors.background};
    font-family: 'Montserrat';
    color: ${colors.text};
}`;

let appState = new Observable({
    player: undefined,
    profile: undefined,
    playerData: undefined,
});

export function App() {
    let contentDiv = useRef();

    async function search(player, profile) {
        appState.data.player = player;
        appState.data.profile = profile;

        if (!player) {
            contentDiv.renderInner(MainPage())
            appState.data.playerData = undefined;
            return;
        }

        appState.data.playerData = PlayerData.load(player, profile);

        contentDiv.renderInner(Content(appState.data.playerData))
    }

    async function refreshData() {
        appState.data.playerData?.loadData();
    }

    setTimeout(() => {
        if (document.location.hash !== "") {
            search(...document.location.hash.substring(1).split("/"));
        }
    }, 100)

    return `
        <body ${bodyCss}>
            ${Header(search, refreshData, appState)}

            <div ${contentDiv}>
                ${MainPage()}
            </div>
        </body>
    `
}