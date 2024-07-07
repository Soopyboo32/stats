//<editor-fold desc="tarball">
class TarReader {
	constructor() {
		this.fileInfo = [];
	}

	readFile(file) {
		return new Promise((resolve, reject) => {
			let reader = new FileReader();
			reader.onload = (event) => {
				this.buffer = event.target.result;
				this.fileInfo = [];
				this._readFileInfo();
				resolve(this.fileInfo);
			};
			reader.readAsArrayBuffer(file);
		});
	}

	readArrayBuffer(arrayBuffer) {
		this.buffer = arrayBuffer;
		this.fileInfo = [];
		this._readFileInfo();
		return this.fileInfo;
	}

	_readFileInfo() {
		this.fileInfo = [];
		let offset = 0;
		let file_size = 0;
		let file_name = "";
		let file_type = null;
		while(offset < this.buffer.byteLength - 512) {
			file_name = this._readFileName(offset); // file name
			if(file_name.length == 0) {
				break;
			}
			file_type = this._readFileType(offset);
			file_size = this._readFileSize(offset);

			this.fileInfo.push({
				"name": file_name,
				"type": file_type,
				"size": file_size,
				"header_offset": offset
			});

			offset += (512 + 512*Math.trunc(file_size/512));
			if(file_size % 512) {
				offset += 512;
			}
		}
	}

	getFileInfo() {
		return this.fileInfo;
	}

	_readString(str_offset, size) {
		let strView = new Uint8Array(this.buffer, str_offset, size);
		let i = strView.indexOf(0);
		let td = new TextDecoder();
		return td.decode(strView.slice(0, i));
	}

	_readFileName(header_offset) {
		let name = this._readString(header_offset, 100);
		return name;
	}

	_readFileType(header_offset) {
		// offset: 156
		let typeView = new Uint8Array(this.buffer, header_offset+156, 1);
		let typeStr = String.fromCharCode(typeView[0]);
		if(typeStr == "0") {
			return "file";
		} else if(typeStr == "5") {
			return "directory";
		} else {
			return typeStr;
		}
	}

	_readFileSize(header_offset) {
		// offset: 124
		let szView = new Uint8Array(this.buffer, header_offset+124, 12);
		let szStr = "";
		for(let i = 0; i < 11; i++) {
			szStr += String.fromCharCode(szView[i]);
		}
		return parseInt(szStr,8);
	}

	_readFileBlob(file_offset, size, mimetype) {
		let view = new Uint8Array(this.buffer, file_offset, size);
		let blob = new Blob([view], {"type": mimetype});
		return blob;
	}

	_readFileBinary(file_offset, size) {
		let view = new Uint8Array(this.buffer, file_offset, size);
		return view;
	}

	_readTextFile(file_offset, size) {
		let view = new Uint8Array(this.buffer, file_offset, size);
		let td = new TextDecoder();
		return td.decode(view);
	}

	getTextFile(file_name) {
		let info = this.fileInfo.find(info => info.name == file_name);
		if (info) {
			return this._readTextFile(info.header_offset+512, info.size);
		}
	}

	getFileBlob(file_name, mimetype) {
		let info = this.fileInfo.find(info => info.name == file_name);
		if (info) {
			return this._readFileBlob(info.header_offset+512, info.size, mimetype);
		}
	}

	getFileBinary(file_name) {
		let info = this.fileInfo.find(info => info.name == file_name);
		if (info) {
			return this._readFileBinary(info.header_offset+512, info.size);
		}
	}
};
//</editor-fold>

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

			let path = url.pathname;
			if(url.pathname === "/") path = "/index.html";

			let mimeType = "application/octet-stream"
			if (path.endsWith(".txt")) mimeType = "text/plain";
			else if (path.endsWith(".js")) mimeType = "text/javascript";
			else if (path.endsWith(".css")) mimeType = "text/css";
			else if (path.endsWith(".json")) mimeType = "application/json";
			else if (path.endsWith(".html")) mimeType = "text/html";

			let fileBlob = zip.getFileBlob("." + path, mimeType);
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

	if (!updating && (!fullyLoaded || !keys.includes(commit))) {
		updating = true;
		console.log("Updating website...");
		let start = Date.now();
		if (!commit.startsWith("DEV-")) {
			zip = await this.loadFilesNew(commit);
		}
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
	let reader = new TarReader();
	await reader.readFile(blob)
	return reader;
}
