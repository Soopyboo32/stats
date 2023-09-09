import { getSoopyApi } from "./soopy.js";

export class PlayerData {
    username;
    uuid;
    playerData;
    sbData;
    sbLvl;
    #updateCallbacks = [];

    constructor(name) {
        this.username = name;
        this.#callUpdates()
    }

    static load(name) {
        let ret = new PlayerData(name);

        ret.loadData();

        return ret;
    }

    async loadData() {
        //TODO: all these api endpoints are temporary
        let uuidData = await getSoopyApi("mojang/username/" + this.username);
        if (!uuidData.success || uuidData.data.errorMessage) {
            return; //TODO: error handling ModCheck?
        }
        this.username = uuidData.data.name;
        this.uuid = uuidData.data.id;
        this.#callUpdates()

        let sbData = await getSoopyApi("stat_next_to_name_stats/" + this.uuid);

        if (sbData.success) {
            this.sbLvl = sbData.data.sbLvl;
        }

        this.#callUpdates();
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