import { PlayerData } from "../api/PlayerData.js";
import { useRef } from "../helpers.js";
import { Header } from "./Header.js";
import { MainPage } from "./MainPage.js";
import { Content } from "./stats/Content.js";

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

        search(document.location.hash.substring(1));
    }, 1000)

    return `
        <body>
            ${Header(search)}

            <div ${contentDiv}>
                ${MainPage()}
            </div>
        </body>
    `
}