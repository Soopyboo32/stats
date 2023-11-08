import { html, numberWithCommas, useRef } from "../../../helpers.js";

export function SlayerInfo(playerData) {
	let slayerContainer = useRef().onRemove(playerData.onUpdate(() => {
		slayerContainer.renderInner(getSlayerInfo(playerData));
	}));

	return html`
		<div ${slayerContainer}>
			${getSlayerInfo(playerData)}
		</div>
	`;
}

function getSlayerInfo(playerData) {
	let player = playerData.getSbPlayerData();
	if (!player) {
		return "...";
	}

	return html`
		<table>
			<tr>
				<td>Revenant Horror</td>
				<td>${numberWithCommas(player.slayer.zombie.xp)}</td>
			</tr>
			<tr>
				<td>Tarantula Broodfather</td>
				<td>${numberWithCommas(player.slayer.spider.xp)}</td>
			</tr>
			<tr>
				<td>Sven Packmaster</td>
				<td>${numberWithCommas(player.slayer.wolf.xp)}</td>
			</tr>
			<tr>
				<td>Voidgloom Seraph</td>
				<td>${numberWithCommas(player.slayer.enderman.xp)}</td>
			</tr>
			<tr>
				<td>Inferno Demonlord</td>
				<td>${numberWithCommas(player.slayer.blaze.xp)}</td>
			</tr>
			<tr>
				<td>Riftstalker Bloodfiend</td>
				<td>${numberWithCommas(player.slayer.vampire.xp)}</td>
			</tr>
		</table>
	`;
}
