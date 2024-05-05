import { getSoopyApi } from "./soopy.js";
import { Observable } from "../soopyframework/Observable.js";

/**
 * @typedef {{
 *     error: string|undefined,
 *     username: string|undefined,
 *     uuid: string|undefined,
 *     profile: string|undefined,
 *     playerData: {},
 *     sbData: SkyblockProfileData[],
 * }} PlayerDataData
 */

export class PlayerData {
	/** @type {Observable<PlayerDataData>} */
	data = Observable.of({
		error: undefined,
		username: undefined,
		uuid: undefined,
		profile: undefined,
		playerData: {},
		sbData: []
	});
	#updateCallbacks = new Set();
	_observableIgnore = true;

	constructor(name, profile) {
		this.getData().username = name;
		this.getData().profile = profile;
		this.#callUpdates();
	}

	static load(name, profile) {
		let ret = new PlayerData(name, profile);

		ret.loadData().then();

		return ret;
	}

	async loadData() {
		this.getData().error = undefined;

		//TODO: all these api endpoints are temporary
		if (!this.getData().uuid) {
			try {
				let uuidData = await getSoopyApi("mojang/username/" + this.getData().username);
				if (!uuidData.success || uuidData.data.errorMessage) {
					if (!uuidData.success) {
						this.getData().error = "Server error downloading Mojang data: " + uuidData.cause;
					} else {
						this.getData().error = "Mojang error downloading Mojang data: " + uuidData.data.errorMessage;
					}
					this.#callUpdates();
					return;
				}
				this.getData().username = uuidData.data.name;
				this.getData().uuid = uuidData.data.id;
				this.#callUpdates();
			} catch (e) {
				if (e instanceof TypeError) this.getData().error = "A network error occurred!";
				else this.getData().error = "A unknown error occurred!";
				this.#callUpdates();
				return;
			}
		}

		getSoopyApi("player/" + this.getData().uuid).then(playerData => {
			if (!playerData.success) {
				this.getData().error = "Server error downloading Hypixel player data: " + playerData.cause;
				this.#callUpdates();
				return;
			}
			this.getData().playerData = playerData.data;

			this.#callUpdates();
		}).catch(e => {
			if (e instanceof TypeError) this.getData().error = "A network error occurred!";
			else this.getData().error = "A unknown error occurred!";
			this.#callUpdates();
		});

		getSoopyApi("skyblock/stats/" + this.getData().uuid).then(sbData => {
			if (!sbData.success) {
				this.getData().error = "Server error downloading player Skyblock stats: " + sbData.cause;
				this.#callUpdates();
				return;
			}

			this.getData().sbData = sbData.data;
			if (!this.getData().profile) {
				this.getData().profile = this.getCurrentProfile() || this.getBestProfile();
			}

			this.#callUpdates();
		}).catch(e => {
			if (e instanceof TypeError) this.getData().error = "A network error occurred!";
			else this.getData().error = "A unknown error occurred!";
			this.#callUpdates();
		});
	}

	/**
	 * @returns {PlayerDataData}
	 */
	getData() {
		return this.data.get();
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
	getSbProfileData(profile = undefined) {
		if (!profile) profile = this.getData().profile;
		return this.getData().sbData?.find(p => p.profile_name === profile);
	}

	/**
	 * @returns {undefined|SkyblockProfileMemberData}
	 */
	getSbPlayerData(profile = undefined) {
		return this.getSbProfileData(profile || this.getData().profile)?.members?.find(m => m.uuid.replaceAll("-", "") === this.getData().uuid.replaceAll("-", ""));
	}

	getBestProfile() {
		let bestProfile = undefined;
		let bestProfileLvl = 0;

		for (let prof of this.getData().sbData) {
			let playerData = this.getSbPlayerData(prof.profile_name);
			let exp = playerData?.sb_exp || 0;
			if (exp > bestProfileLvl) {
				bestProfileLvl = exp;
				bestProfile = prof.profile_name;
			}
		}

		return bestProfile;
	}

	getCurrentProfile() {
		return this.getData().sbData?.find(p => p.selected)?.profile_name;
	}
}