import { html } from "../../helpers.js";

/**
 * @param headerElms {HTML[]}
 * @param rows {...HTML[][]}
 * @returns {HTML}
 */
export function Table(headerElms, ...rows) {
	return html`
		<table>
			<tr>
				${headerElms.map(e => html`
					<th>${e}</th>`).join("")}
			</tr>
			${rows.map(row => html`
				<tr>
					${row.map(r => html`
						<td>${r}</td>`).join("")}
				</tr>`).join("")}
		</table>
	`;
}