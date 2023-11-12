import { html, numberWithCommas, useRef } from "../../../../helpers.js";
import { Table } from "../../../generic/Table.js";

export function SlayerInfo(playerData) {
	return playerData.data.observe(() => {
		let player = playerData.getSbPlayerData();
		if (!player) {
			return "...";
		}

		return html`
			${Table([],
					["Revenant Horror", numberWithCommas(player.slayer.zombie.xp)],
					["Tarantula Broodfather", numberWithCommas(player.slayer.spider.xp)],
					["Sven Packmaster", numberWithCommas(player.slayer.wolf.xp)],
					["Voidgloom Seraph", numberWithCommas(player.slayer.enderman.xp)],
					["Inferno Demonlord", numberWithCommas(player.slayer.blaze.xp)],
					["Riftstalker Bloodfiend", numberWithCommas(player.slayer.vampire.xp)]
			)}
		`;
	});
}