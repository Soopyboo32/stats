import { html, useRef } from "../../../../soopyframework/helpers.js";
import { Observable } from "../../../../soopyframework/Observable.js";
import { getSoopyApi } from "../../../../api/soopy.js";
import { Card } from "../../../../soopyframework/components/generic/Card.js";
import { TimeSince, TimeTill } from "../../../../soopyframework/components/generic/TimeSince.js";

let eventData = Observable.of({
	lastUpdate: 0,
	data: undefined
});

export function MiningEvents() {
	let ref = useRef();

	update();
	ref.interval(update, 60000);

	return Card(html`<span ${ref}>Mining Events</span>`, eventData.observe(() => {
		if (!eventData.get().data) return html`Loading...`;

		let totalChLobbys = eventData.get().data.data.total_lobbys.CRYSTAL_HOLLOWS || 0;
		let totalMinesLobbys = eventData.get().data.data.total_lobbys.DWARVEN_MINES || 0;

		return html`
			<b>Crystal Hollows:</b>
			${eventData.get().data.data.running_events.CRYSTAL_HOLLOWS.map(e => EventData(e, totalChLobbys))}
			<hr>
			<b>Dwarven Mines:</b>
			${eventData.get().data.data.running_events.DWARVEN_MINES.map(e => EventData(e, totalMinesLobbys))}
		`;
	}));
}

function EventData(e, totalLobbys) {
	return html`
		<div>
			${e.event} (${(e.lobby_count / totalLobbys * 100).toFixed(0)}% of lobbys) ends in ${TimeTill(e.ends_at)}
			${e.is_double ? " -> " + e.event : ""}
		</div>
	`;
}

function update() {
	if (Date.now() - eventData.get().lastUpdate > 60000) {
		getSoopyApi("skyblock/chevents/get").then(json => eventData.get().data = json);
	}
}