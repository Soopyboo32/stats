import { PlayerData } from "../api/PlayerData.js";
import { staticCss, thisClass, useRef } from "../helpers.js";
import { Header } from "./Header.js";
import { MainPage } from "./MainPage.js";
import { colors } from "./css.js";
import { Content } from "./stats/Content.js";

let bodyCss = staticCss.named("body")`${thisClass} {
    background-color: ${colors.background};
    font-family: 'Montserrat';
    color: ${colors.text};
}`;

let title = document.getElementById("title");

export function App() {
    let contentDiv = useRef();
    let lastHash = "";

    async function search(player) {
        document.location.hash = player;
        lastHash = document.location.hash;

        contentDiv.renderInner(Content(PlayerData.load(player)))
    }

    setInterval(() => {
        if (document.location.hash === lastHash) {
            return;
        }
        lastHash = document.location.hash;

        if (lastHash === "") {
            contentDiv.renderInner(MainPage());
            return;
        }

        search(lastHash.substring(1));
    }, 100)

    return `
        <body ${bodyCss}>
            ${Header(search)}

            <div ${contentDiv}>
                ${MainPage()}
            </div>
        </body>
    `
}