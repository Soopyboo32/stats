import { PlayerData } from "../../../../api/PlayerData.js";
import { html, staticCss, thisClass, useRef } from "../../../../soopyframework/helpers.js";
import { colors } from "../../../../soopyframework/css.js";
import { Hover } from "../../../../soopyframework/components/generic/hover/Hover.js";
import { Lore } from "../../../components/hover/Lore.js";

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
			return "Loading...";
		}

		if (!inventory) {
			return "Api missing data!";
		}

		let hotbar = inventory.splice(0, 9);

		return html`
			<div ${inventoryCss}>
				<table>
					<tr>
						${inventory.splice(0, 9).map(item => `<td>${Item(item)}</td>`).join("")}
					</tr>
					<tr>
						${inventory.splice(0, 9).map(item => `<td>${Item(item)}</td>`).join("")}
					</tr>
					<tr>
						${inventory.splice(0, 9).map(item => `<td>${Item(item)}</td>`).join("")}
					</tr>
					<tr>
						${hotbar.map(item => `<td>${Item(item)}</td>`).join("")}
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
		console.log("debug itemdata:", itemData, item);
	});

	Hover(containerRef, () => Lore(itemData.tag.display.Name, ...itemData.tag.display.Lore));

	return html`
		<div ${itemIconContainerCss} ${containerRef}>
			<div ${itemIconCss.mergeNamed("icon-" + itemData.id + "_" + itemData.Damage)}>
			</div>
		</div>
	`;
}
