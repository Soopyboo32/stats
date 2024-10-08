export let SOOPY_API_URL = "https://api.soopy.dev/";
let urlSceme = "https://";
let urlRaw = "api.soopy.dev/";

async function updateUseLocal() {
	try {
		let data = await fetch("http://127.0.0.1:8000/");
		data = await data.json();
		if (data.success) {
			SOOPY_API_URL = "http://127.0.0.1:8000/";
			urlSceme = "http://";
			urlRaw = "127.0.0.1:8000/";
			console.log("Locally hosted api detected, using local address instead!");
		}
	} catch (e) {
	}
}

if (window.location.origin.includes("127.0.0.1")) {
	updateUseLocal().then();
}

export async function getSoopyApi(endpoint) {
	let data = await fetch(SOOPY_API_URL + endpoint);
	return await data.json();
}

/** @type {{string: [number, {}]}} */
let cache = {};

setInterval(async () => {
	let now = Date.now();
	for (let url in cache) {
		if (now - cache[url][0] > 60000) {
			delete cache[url];
		}
	}
}, 60000); //every minute

let hasSw = (await (await fetch("/hassw.txt")).text()) === "YES";

/**
 * @param endpoint {string}
 * @param cb {(data: any)=>any}
 * @param cacheTime {number}
 * @returns {any | undefined}
 */
export function getSoopyApiCache(endpoint, cb, cacheTime = 60 * 1000) {
	//TODO: deal with already loading data but not loaded yet
	if (endpoint in cache) {
		if (Date.now() - cache[endpoint][0] < cacheTime) {
			return cache[endpoint][1];
		}
	}

	if (!hasSw) {
		fetch(SOOPY_API_URL + endpoint).then(async (data) => {
			let json = await data.json();
			cache[endpoint] = [Date.now(), json];
			cb(json);
		});
		return;
	}

	fetch(urlSceme + "cache/" + cacheTime + "@" + urlRaw + endpoint).then(async (data) => {
		let json = await data.json();
		cache[endpoint] = json;
		cb(json[1]);
	});
}
