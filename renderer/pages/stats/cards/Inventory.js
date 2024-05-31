import { PlayerData } from "../../../../api/PlayerData.js";
import { css, html, Join, staticCss, thisClass, useRef } from "../../../../soopyframework/helpers.js";
import { colors } from "../../../../soopyframework/css.js";
import { ItemHover } from "../../../components/hover/ItemHover.js";

let inventoryCss = staticCss.named("inventory").css`${thisClass} {
	display: flex;
	justify-content: center;
}`;

/**
 * @param {PlayerData} playerData
 */
export function Inventory(playerData) {
	return playerData.data.observe(() => {
		let inventory = playerData.getSbPlayerData()?.inventories?.inventory;

		if (!playerData.getSbPlayerData()) {
			return html`Loading...`;
		}

		if (!inventory || inventory.length === 0) {
			return html`Api missing data!`;
		}

		inventory = [...inventory]; //cus its mutated when splice

		let hotbar = inventory.splice(0, 9);

		return html`
			<div ${inventoryCss}>
				<table>
					<tr>
						${Join(inventory.splice(0, 9).map(item => html`<td>${Item(item)}</td>`))}
					</tr>
					<tr>
						${Join(inventory.splice(0, 9).map(item => html`<td>${Item(item)}</td>`))}
					</tr>
					<tr>
						${Join(inventory.splice(0, 9).map(item => html`<td>${Item(item)}</td>`))}
					</tr>
					<tr>
						${Join(hotbar.map(item => html`<td>${Item(item)}</td>`))}
					</tr>
				</table>
			</div>
		`;
	});
}

//TODO: border based on rarity
let itemIconContainerCss = staticCss.named("item-icon-container").css`${thisClass} {
	position: relative;
	border: 1px solid ${colors.primary_dark};
	border-radius: 5px;
	width: calc(128px * 0.35);
	height: calc(128px * 0.35);
}`;

let itemIconCss = staticCss.named("item-icon-css").css`${thisClass} {
	background-image: url(/itemtextures/items.webp);
	image-rendering: pixelated;
	width: 128px;
	height: 128px;
	background-position: -128px 0;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%) scale(0.35);
}`;

function Item(item) {
	if (!item.nbt || item.nbt === "{}") {
		//air
		return html` <div ${itemIconContainerCss}></div> `;
	}

	let itemData = JSON.parse(item.nbt);

	let containerRef = useRef().onClick(() => {
		if (settings.get().debug) {
			console.log("debug itemdata:", itemData, item);
		}
	});

	ItemHover(containerRef, item);

	/*
	if (itemData.id === 397) {
		let skinData = JSON.parse(atob(itemData.tag.SkullOwner.Properties.textures[0].Value));
		// console.log(skinData);
		let skinUrl = `https://api.soopy.dev/skin/${skinData.textures.SKIN.url.split("/").pop()}/skin.png`;
// .icon-159_2{background-position:0 -1024px}
		console.log(skinUrl);
		return html`
			<div ${itemIconContainerCss} ${containerRef}>
				<div ${css`
					background-image: url('${skinUrl}');
					background-size: calc(64px * 16);
					background-position: calc(-8px * 16) calc(-8px * 16);
				`} ${itemIconCss}>
				</div>
			</div>
		`;
	}
	 */

	return html`
		<div ${itemIconContainerCss} ${containerRef}>
			<div ${itemIconCss.mergeNamed("icon-" + itemData.id + "_" + itemData.Damage)}>
			</div>
		</div>
	`;
}
