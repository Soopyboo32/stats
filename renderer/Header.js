import { css, showPopup, useRef } from "../helpers.js";
import { buttonCss } from "./css.js";
import { SomeButtonPopup } from "./popup/SomeButtonPopup.js";

export function Header() {
    let rightButtonRef = useRef().onClick(() => {
        showPopup(SomeButtonPopup())
    })

    return `
        <header ${css`
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw;
            height: 50px;
            background-color: lightgrey;
        `}>

            <button ${rightButtonRef} ${buttonCss`float: right;`}>Some button</button>

        </header>

        <!-- Spacer -->
        <div ${css`
            width: 100%;
            height: 50px;
        `}></div>
    `
}