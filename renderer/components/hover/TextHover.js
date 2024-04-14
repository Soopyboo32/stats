import {Hover} from "../../../soopyframework/components/generic/hover/Hover.js";
import {Lore} from "./Lore.js";

export function TextHover(ref, ...lines) {
	Hover(ref, () => Lore(...lines))
}