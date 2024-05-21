import { ChocolateFactoryState, RABBIT_DATA } from "./calc.js";
import { html } from "../../../../../soopyframework/helpers.js";

/**
 * @param {PlayerData} playerData
 */
export function ChocolateFactory(playerData) {
	return playerData.data.observe(() => {
		if (!playerData.getSbPlayerData()?.chocolate_factory) return html`Loading...`;
		let state = new ChocolateFactoryState(playerData.getSbPlayerData().chocolate_factory);
		console.log(state.getProduction());

		return html`
			Chocolate factory data: asdasd
		`;
	});
}