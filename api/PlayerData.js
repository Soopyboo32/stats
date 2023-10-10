import { getSoopyApi } from "./soopy.js";

export class PlayerData {
    error;
    username;
    uuid;
    profile;
    playerData = {};
    sbData = {};
    #updateCallbacks = [];

    constructor(name, profile) {
        this.username = name;
        this.profile = profile;
        this.#callUpdates()
    }

    static load(name, profile) {
        let ret = new PlayerData(name, profile);

        ret.loadData();

        return ret;
    }

    async loadData() {
        //TODO: all these api endpoints are temporary
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
        this.#callUpdates()

        getSoopyApi("player/" + this.uuid).then(playerData => {
            if (!playerData.success) {
                this.error = "Server error downloading hypixel player data: " + playerData.cause;
                this.#callUpdates();
                return;
            }
            this.playerData = playerData.data;

            this.#callUpdates();
        });

        getSoopyApi("stat_next_to_name_stats/" + this.uuid).then(sbData => {
            if (!sbData.success) {
                this.error = "Server error downloading player skyblock stats: " + sbData.cause;
                this.#callUpdates();
                return;
            }
            sbData = sbData.data;

            this.sbData.sbLvl = sbData.sbLvl;
            if (!this.profile) {
                this.profile = "some-profile"
            }

            this.#callUpdates();
        })
    }

    /**
     * @param {() => bool} keepUpdateFunction function that returns true while this callback should exist
     * @param {() => {}} callback 
     */
    onUpdate(keepUpdateFunction, callback) {
        //TODO: use keepUpdateFunction to throw away callback and not get memory leaks
        this.#updateCallbacks.push([keepUpdateFunction, callback])
    }

    #callUpdates() {
        for (let [keepUpdateFunction, callback] of this.#updateCallbacks) {
            if (keepUpdateFunction()) {
                callback()
            }
        }
    }
}