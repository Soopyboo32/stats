let version = 6;
let commit = "";
let cacheCommitToUse = "";
let fullyLoaded = false;

self.addEventListener("install", event => {
	console.log("Installing service worker...");

	updateCommit().then(() => self.skipWaiting());

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
			if (!commit) {
				await updateCommit();
			}

			if (url.pathname === "/") {
				updateCommit().then();
			}

			if (url.pathname === "/hassw.txt") {
				return new Response("YES");
			}

			if (commit.startsWith("DEV-") || url.pathname === "/commit.txt" || url.pathname === "/files.txt") {
				return await fetch(url);
			}

			if (!fullyLoaded) {
				return await fetch(url);
			}

			let cache = await caches.open(commit);
			return cache.match(url.pathname);
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
	try {
		let res = await fetch("/commit.txt");
		commit = await res.text();
		commit += "-" + version;
	} catch (e) {
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
		await loadFiles();
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
		await new Promise(r => setTimeout(r, 100));
	}
}

async function loadFiles() {
	let res = await fetch("/files.txt");
	let files = await res.text();

	let urlList = ["/"];
	let lastLine = "";
	let pathPrefix = "";
	for (let file of files.split("\n")) {
		if (file === "") {
			lastLine = file;
			continue;
		}

		if (lastLine === "") {
			pathPrefix = file.substring(1, file.length - 1);
			if (pathPrefix === ".") {
				pathPrefix = "";
			}
			pathPrefix += "/";
			lastLine = file;
			continue;
		}

		lastLine = file;
		if (!file.includes(".")) {
			//is a directory not a file!
			continue;
		}

		urlList.push(pathPrefix + file);
	}

	console.log(urlList);
	let cache = await caches.open(commit);
	await Promise.allSettled(urlList.map(async u => {
		let response = await fetch(u);
		console.log(u + " - " + response.statusText);

		await cache.put(u, response);
	}));
}
