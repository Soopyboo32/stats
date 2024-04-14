import {Hover} from "../../../soopyframework/components/generic/hover/Hover.js";
import {Lore} from "./Lore.js";

export function ItemHover(ref, item) {
	let itemData = JSON.parse(item.nbt);

	Hover(ref, () => Lore(itemData.tag.display.Name, ...itemData.tag.display.Lore));
}