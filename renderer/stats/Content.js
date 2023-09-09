import { PlayerData } from "../../api/PlayerData.js";
import { Username } from "./generic/Username.js";
import { SbLevel } from "./skyblock/SbLevel.js";

/**
 * @param {PlayerData} playerData 
 */
export function Content(playerData) {
    return `
        Player stats for ${Username(playerData)}, Sb level ${SbLevel(playerData)}
    `
}