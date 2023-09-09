import { css, useRef } from "../helpers.js";
import { buttonCss, textboxCss } from "./css.js";

export function Header(search) {
    let input = useRef();

    let rightButton = useRef().onClick(() => {
        if (!input.exists()) return;
        let searchPlayer = input.getElm().value;
        input.getElm().value = "";

        search(searchPlayer);
    });

    return `
        <header ${css`
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw;
            height: 50px;
            background-color: lightgrey;
        `}>

            <button ${rightButton} ${buttonCss`float: right;`}>Search</button>
            <input ${input} type="text" placeholder="Search" ${textboxCss`float: right;margin-right: 0;`}> </input>

        </header>

        <!-- Spacer -->
        <div ${css`
            width: 100%;
            height: 50px;
        `}></div>
    `
}