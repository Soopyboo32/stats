import { useRef } from "../../../helpers.js";

export function OnlineState(playerData) {
    let ref = useRef();

    let state = getState(playerData);

    playerData.onUpdate(() => ref.exists(), () => {
        ref.renderInner(getState(playerData));
    })

    return `Currently: <span ${ref}> ${state} </span>`
}

function getState(playerData) {
    if (!playerData.playerData.status) {
        return "...";
    }

    if (playerData.playerData.status == "ApiDisabled") {
        return "Api Disabled";
    }
    if ("Online" in playerData.playerData.status) {
        return "Online";
    }
    if ("Offline" in playerData.playerData.status) {
        return "Offline";
    }

    return "???"
}
