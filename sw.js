let version = 2;
let commit = "";
let cacheCommitToUse = "";

self.addEventListener("install", event => {
	console.log("Installing service worker...");

	updateCommit().then(() => self.skipWaiting());

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
				updateCommit();
			}

			if (commit === "DEV" || url.pathname === "/commit.txt" || url.pathname === "/files.txt") {
				return await fetch(url);
			}

			caches.//if (file) {
				let;
			cache = await caches.open(commit);
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
	let res = await fetch("/commit.txt");
	commit = await res.text();
	commit += version;

	if (!cacheCommitToUse) {
		cacheCommitToUse = commit;
	}
	//console.log("Commit updated:", commit);

	let keys = await caches.keys();

	if (!updating && !keys.includes(commit)) {
		updating = true;
		console.log("Updating website...");
		await loadFiles();

		await Promise.all(keys.map(key => {
			if (key !== commit) {
				//console.log("Deleting cache:", key);
				return caches.delete(key);
			}
		}));

		cacheCommitToUse = commit;
		updating = false;
		console.log("Finished updating!")

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

	let cache = await caches.open(commit);
	await Promise.allSettled(urlList.map(async u => {
		let response = await fetch(u);

		await cache.put(u, response);
	}));
}
