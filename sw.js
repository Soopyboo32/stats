let commit = "";

self.addEventListener("install", event => {
	console.log("Installing service worker...");

	self.skipWaiting();

	console.log("Service worker installed!");
});

self.addEventListener("activate", event => {
	clients.claim();
	console.log("Service worker activated");
});

self.addEventListener('fetch', event => {
	const url = new URL(event.request.url);

	if (url.origin === location.origin) {
		event.respondWith((async () => {
			if (!commit) {
				await updateCommit();
			}

			if (url.pathname === "/") {
				await updateCommit();
			}

			if (commit === "DEV" || url.pathname === "/commit.txt" || url.pathname === "/files.txt") {
				return await fetch(url);
			}

			//if (file) {
			return await caches.match(url.pathname);
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

async function updateCommit() {
	let res = await fetch("/commit.txt");
	commit = await res.text();
	//console.log("Commit updated:", commit);

	let keys = await caches.keys();

	await Promise.all(keys.map(key => {
		if (key !== commit) {
			//console.log("Deleting cache:", key);
			return caches.delete(key);
		}
	}));

	if (!keys.includes(commit)) {
		console.log("Updating website...");
		await loadFiles();
	}
}

async function loadFiles() {
	let res = await fetch("/file.txt");
	let files = await res.text();

	let urlList = [];
	let lastLine = "";
	let pathPrefix = "";
	for (let file of files.split("\n")) {
		if (file === "") {
			lastLine = file;
			continue;
		}

		if (lastLine === "") {
			pathPrefix = file.substring(1, file.length - 2);
			lastLine = file;
			continue;
		}

		urlList.push(pathPrefix + file);
	}

	let cache = await caches.open(commit);
	await Promise.allSettled(urlList.map(async u => {
		console.log("Saving data for " + u);
		let response = await fetch(u);

		await cache.put(u, response);
	}));
}
