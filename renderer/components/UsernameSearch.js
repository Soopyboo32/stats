import { staticCss, thisClass, useRef } from "../../helpers.js";
import { Icon } from "../Icon.js";
import { buttonCss, colors, textboxCss } from "../css.js";

let containerCss = staticCss.named("username-search-container").css`
    ${thisClass} {
        display: flex;
        align-items: center;
    }

    ${thisClass} div[data-lastpass-icon-root] {
        display: none;
    }
`

let headerUsernameInputCss = textboxCss.named("username-input").css`
    ${thisClass} {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        margin-left: 0;
        margin-right: 0;
		border-right: none;
    }

    ${thisClass}:focus {
        background: transparent;
		border-right: none;
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
`

let headerSearchButtonCss = buttonCss.named("search-button").css`
	${thisClass} {
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		border-left: none;
        margin-left: 0;
        margin-right: 0;
        padding: 0;
        width: 30px;
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
`

let headerSearchIconContainerCss = staticCss.named("search-icon-container").css`
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
`

/**
 * @param {(String) => any} callback 
 */
export function UsernameSearch(callback) {
    //TODO: tab completion!

    let input = useRef().onEnter(() => {
        let searchPlayer = input.getElm().value;
        if (searchPlayer.trim() === "") return
        input.getElm().value = "";

        callback(searchPlayer);
    });

    let searchButton = useRef().onClick(() => {
        if (!input.exists()) return;
        let searchPlayer = input.getElm().value;
        if (searchPlayer.trim() === "") return
        input.getElm().value = "";

        callback(searchPlayer);
    });

    return `
        <div ${containerCss}>
            <input ${input} type="text" placeholder="Username" autocomplete="off" ${headerUsernameInputCss}> </input>
            <button ${searchButton} ${headerSearchButtonCss}>
                <div ${headerSearchIconContainerCss}>
                    ${Icon("search")}
                </div>
            </button>
        </div>
    `
}