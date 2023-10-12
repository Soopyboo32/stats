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

			if(commit === "DEV") {
				return await fetch(url);
			}

			let file = await caches.match(url.pathname);

			if (file) {
				return file;
			} else {
				//console.log("Saving into cache:", url.pathname);

				let response = await fetch(url.pathname);

				let cache = await caches.open(commit);
				await cache.put(url.pathname, response);

				return await caches.match(url.pathname);
			}
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
}