import { staticCss, thisClass } from "../../helpers.js"
import { colors } from "../css.js"

export let cardCss = staticCss.named("card")`${thisClass} {
    background: ${colors.background_light_1};
    margin: 10px;
    padding: 10px;
    /*border: 1px solid ${colors.primary_dark};*/
    border-radius: 5px;
    webkit-box-shadow: 5px 5px 5px 0px rgba(0,0,0,0.05);
    -moz-box-shadow: 5px 5px 5px 0px rgba(0,0,0,0.05);
    box-shadow: 5px 5px 5px 0px rgba(0,0,0,0.05);
	width: -webkit-fill-available;
	width: -moz-available;
}`

export function Card(contents) {
    return `
        <div ${cardCss}>
            ${contents}
        </div>
    `
}