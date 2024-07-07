importScripts("/libs/tarball.js");

let version = 8;
let commit = "";
let cacheCommitToUse = "";
let fullyLoaded = false;
let zip;

self.addEventListener("install", event => {
	console.log("Installing service worker...");

	self.skipWaiting();
	updateCommit().then();

	console.log("Service worker installed!");
});

self.addEventListener("activate", event => {
	clients.claim();
	console.log("Service worker activated");
});

setInterval(async () => {
	await updateCommit();
}, 60000 * 60); //every hour

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

self.addEventListener('fetch', event => {
	const url = new URL(event.request.url);

	if (url.hostname === "cache") {
		event.respondWith((async () => {
			let [cacheTime, host] = url.pathname.substring(1).split("@");
			let fullUrl = url.protocol + "//" + host;

			if (fullUrl in cache) {
				if (Date.now() - cache[fullUrl][0] < parseInt(cacheTime)) {
					return new Response(JSON.stringify(cache[fullUrl]));
				}
			}

			let data = await fetch(fullUrl);
			let json = await data.json();
			cache[fullUrl] = [Date.now(), json];
			return new Response(JSON.stringify(cache[fullUrl]));
		})());
		return;
	}

	if (url.origin === location.origin) {
		event.respondWith((async () => {
			while (!fullyLoaded) {
				await new Promise(resolve => setTimeout(resolve, 50));
			}

			if (url.pathname === "/") {
				updateCommit().then();
			}

			if (url.pathname === "/hassw.txt") {
				return new Response("YES");
			}

			if (commit.startsWith("DEV-") || url.pathname === "/commit.txt") {
				return await fetch(event.request);
			}

			if (!fullyLoaded) {
				return await fetch(event.request);
			}

			let mimeType = "application/octet-stream"
			if (url.pathname.endsWith(".txt")) mimeType = "text/plain";
			else if (url.pathname.endsWith(".js")) mimeType = "text/javascript";
			else if (url.pathname.endsWith(".css")) mimeType = "text/css";
			else if (url.pathname.endsWith(".json")) mimeType = "application/json";

			let fileBlob = zip.getFileBlob("./" + url.pathname, mimeType);
			return new Response(fileBlob);
			// let cache = await caches.open(commit);
			// return cache.match(url.pathname);
			// } else {
			// 	console.log("File not in cache!", url);
			//
			// 	let response = await fetch(url.pathname);
			//
			// 	let cache = await caches.open(commit);
			// 	await cache.put(url.pathname, response);
			//
			// 	return await caches.match(url.pathname);
			// }
		})());
	}
});

let updating = false;

async function updateCommit() {
	//TODO: dont spam this
	try {
		let res = await fetch("/commit.txt");
		commit = await res.text();
		commit += "-" + version;
	} catch (e) {
		//todo: use cached commit on no network?
		return;
	}

	if (!cacheCommitToUse) {
		cacheCommitToUse = commit;
	}
	//console.log("Commit updated:", commit);

	let keys = await caches.keys();

	if (!updating && !keys.includes(commit)) {
		updating = true;
		console.log("Updating website...");
		let start = Date.now();
		zip = await this.loadFilesNew(commit);
		fullyLoaded = true;

		await Promise.all(keys.map(key => {
			if (key !== commit) {
				//console.log("Deleting cache:", key);
				return caches.delete(key);
			}
		}));

		cacheCommitToUse = commit;
		updating = false;
		console.log("Finished updating! (Took " + (Date.now() - start) + " ms)");

		//TODO: send some sort of update avalible notification?
	}

	while (updating) {
		await new Promise(r => setTimeout(r, 50));
	}
}

async function loadFilesNew(commit) {
	let response;
	let hasCache = await caches.has(commit);
	let cache = await caches.open(commit);
	if (hasCache) {
		response = (await cache.match("source.tar.gz"));
	} else {
		response = await fetch("source.tar.gz");
		await cache.put("source.tar.gz", response.clone());
	}

	let uncompressed = await response.body.pipeThrough(new DecompressionStream("gzip"))
	let blob = await new Response(uncompressed).blob();
	let reader = new tarball.TarReader();
	await reader.readFile(blob)
	return reader;
}
