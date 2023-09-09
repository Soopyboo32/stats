import { PlayerData } from "../api/PlayerData.js";
import { useRef } from "../helpers.js";
import { Header } from "./Header.js";
import { MainPage } from "./MainPage.js";
import { Content } from "./stats/Content.js";

export function App() {
    let contentDiv = useRef();

    async function search(player) {
        contentDiv.renderInner(Content(PlayerData.load(player)))
    }

    return `
        <body>
            ${Header(search)}

            <div ${contentDiv}>
                ${MainPage()}
            </div>
        </body>
    `
}