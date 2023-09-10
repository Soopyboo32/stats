import { staticCss, thisClass } from "../helpers.js";

export let colors = {
    text: "rgb(229, 231, 235)",
    background: "rgb(17, 24, 39)",
    background_light: "rgb(27, 40, 59)",
    primary: "rgb(192, 132, 252)",
    primary_dark: "rgb(147, 51, 234)",
    primary_dark_hover: "#6C2BB0",
    grey: "rgb(55, 65, 81)",
}

export let buttonCss = staticCss.named("button")`
    ${thisClass} {
        height: 30px;
        margin: 10px;
        text-align: center;
        background-color: ${colors.primary_dark};
        color: ${colors.text};
        border: 1px solid transparent;
        border-radius: 5px;
        transition: 0.15s;
        transition-timing-function: ease-in;
    }

    ${thisClass}:hover {
        background-color: ${colors.primary_dark_hover};
        cursor: pointer;
    }
`

export let textboxCss = staticCss.named("textbox")`
    ${thisClass} {
        height: 26px;
        margin: 10px;
        border: 1px solid transparent;
        border-radius: 5px;
        background-color: ${colors.primary_dark};
        color: ${colors.text};
        padding-left: 10px;
        transition: 0.15s;
        transition-timing-function: ease-in;
        outline: none;
    }

    ${thisClass}::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
        color: ${colors.primary};
        opacity: 1; /* Firefox */
    }

    ${thisClass}:-ms-input-placeholder { /* Internet Explorer 10-11 */
        color: ${colors.primary};
    }

    ${thisClass}::-ms-input-placeholder { /* Microsoft Edge */
        color: ${colors.primary};
    }

    ${thisClass}:focus {
        background: ${colors.background};
        border: 1px solid ${colors.primary_dark};
    }
`