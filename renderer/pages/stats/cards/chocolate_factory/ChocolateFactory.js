import { ChocolateFactoryState, RABBIT_DATA } from "./calc.js";
import { html, Join, numberWithCommas } from "../../../../../soopyframework/helpers.js";
import { MinecraftText } from "../../../../components/MinecraftText.js";

/**
 * @param {PlayerData} playerData
 */
export function ChocolateFactory(playerData) {
	return playerData.data.observe(() => {
		if (!playerData.getSbPlayerData()?.chocolate_factory) return html`Loading...`;
		let state = new ChocolateFactoryState(playerData.getSbPlayerData().chocolate_factory, playerData.getSbPlayerData().booster_cookie_active);

		let production = state.getProduction();

		let lines = [];
		lines.push(`§6${numberWithCommas(production.total)} Chocolate §8per second`);
		lines.push("");

		for (let additive of production.additive) {
			lines.push(`  §6+${numberWithCommas(additive.amount)} §8(${additive.source}§8)`);
		}

		lines.push("");
		lines.push(`§7Total Multiplier: §6${production.multiplier_total}x`);

		for (let multiplier of production.multiplier) {
			lines.push(`  §6+${multiplier.amount}x §8(${multiplier.source}§8)`);
		}

		return Join(lines.map(l => MinecraftText(l)), html`<br>`);
	});
}