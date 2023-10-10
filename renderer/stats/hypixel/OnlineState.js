import { html, useRef } from "../../../helpers.js";

export function OnlineState(playerData) {
    let ref = useRef();

    let state = getState(playerData);

    playerData.onUpdate(() => ref.exists(), () => {
        ref.renderInner(getState(playerData));
    })

    return html`Currently: <span ${ref}> ${state} </span>`
}

let stateNameOverrides = {
    "ApiDisabled": "Api Disabled"
}

function getState(playerData) {
    if (!playerData.playerData.status) {
        return "...";
    }

    return stateNameOverrides[playerData.playerData.status.state] || playerData.playerData.status.state;
}
