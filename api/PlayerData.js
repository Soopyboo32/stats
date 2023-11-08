import { getSoopyApi } from "./soopy.js";

export class PlayerData {
	error;
	username;
	uuid;
	profile;
	/** @type {{}} */
	playerData = {};
	/** @type {SkyblockProfileData[]} */
	sbData = [];
	#updateCallbacks = new Set();
	_observableIgnore = true;

	constructor(name, profile) {
		this.username = name;
		this.profile = profile;
		this.#callUpdates();
	}

	static load(name, profile) {
		let ret = new PlayerData(name, profile);

		ret.loadData().then();

		return ret;
	}

	async loadData() {
		//TODO: all these api endpoints are temporary
		if (!this.uuid) {
			let uuidData = await getSoopyApi("mojang/username/" + this.username);
			if (!uuidData.success || uuidData.data.errorMessage) {
				if (!uuidData.success) {
					this.error = "Server error downloading mojang data: " + uuidData.cause;
				} else {
					this.error = "Mojang error downloading mojang data: " + uuidData.data.errorMessage;
				}
				this.#callUpdates();
				return; //TODO: error handling ModCheck?
			}
			this.username = uuidData.data.name;
			this.uuid = uuidData.data.id;
			this.#callUpdates();
		}

		getSoopyApi("player/" + this.uuid).then(playerData => {
			if (!playerData.success) {
				this.error = "Server error downloading hypixel player data: " + playerData.cause;
				this.#callUpdates();
				return;
			}
			this.playerData = playerData.data;

			this.#callUpdates();
		});

		getSoopyApi("skyblock/stats/" + this.uuid).then(sbData => {
			if (!sbData.success) {
				this.error = "Server error downloading player skyblock stats: " + sbData.cause;
				this.#callUpdates();
				return;
			}

			this.sbData = sbData.data;
			if (!this.profile) {
				let bestProfile = undefined;
				let bestProfileExp = 0;
				for (let profile of this.sbData) {
					let player = profile.members.find(m => m.uuid.replaceAll("-", "") === this.uuid.replaceAll("-", ""));

					if (player.sb_exp > bestProfileExp) {
						bestProfileExp = player.sb_exp;
						bestProfile = profile.profile_name;
					}
				}
				this.profile = bestProfile;
			}

			this.#callUpdates();
		});
	}

	/**
	 * @param {() => {}} callback
	 * @return {() => {}} removeCallbackFn
	 */
	onUpdate(callback) {
		this.#updateCallbacks.add(callback);

		return () => {
			this.#updateCallbacks.delete(callback);
		};
	}

	#callUpdates() {
		for (let callback of this.#updateCallbacks) {
			callback();
		}
	}

	/**
	 * @returns {undefined|SkyblockProfileData}
	 */
	getSbProfileData() {
		return this.sbData?.find(p => p.profile_name === this.profile);
	}

	/**
	 * @returns {undefined|SkyblockProfileMemberData}
	 */
	getSbPlayerData() {
		return this.getSbProfileData()?.members?.find(m => m.uuid.replaceAll("-", "") === this.uuid.replaceAll("-", ""));
	}
}