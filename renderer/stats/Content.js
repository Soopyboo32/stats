import { PlayerData } from "../../api/PlayerData.js";
import { useRef } from "../../helpers.js";
import { Username } from "./generic/Username.js";
import { AchievementsTable } from "./hypixel/AchievementsTable.js";
import { SbLevel } from "./skyblock/SbLevel.js";

/**
 * @param {PlayerData} playerData 
 */
export function Content(playerData) {
    let ref = useRef();

    //TODO: change icon aswell
    title.innerHTML = playerData.username + " | Soopy Stats Viewer"
    playerData.onUpdate(() => ref.exists(), () => {
        title.innerHTML = playerData.username + " | Soopy Stats Viewer"
    })

    return `<span ${ref}></span>
        Player stats for ${Username(playerData)}, Sb level ${SbLevel(playerData)}<br>
        <br>
        One time achievements: ${AchievementsTable(playerData)}
    `
}