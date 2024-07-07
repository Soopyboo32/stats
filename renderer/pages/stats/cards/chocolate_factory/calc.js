const BARN_BASE_COST = 5000;
const BARN_MAX_LVL = 189;
const HANDBAKE_MAX_LVL = 10;
const TIME_TOWER_MAX_LVL = 15;
const RABBIT_SHRINE_MAX_LVL = 20;
const RABBIT_BRO_LEVEL_COSTS = [50, 100, 200, 300, 400, 450, 475, 500, 525, 550];
const HANDBAKED_LEVEL_COSTS = [500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500];
const JACKRABBIT_LEVEL_COSTS = [
	2_200_000, 3_900_000, 5_300_000, 7_200_000, 9_700_000, 13_000_000, 18_000_000, 24_000_000, 32_000_000, 43_000_000,
	59_000_000, 79_000_000, 110_000_000, 140_000_000, 190_000_000, 260_000_000, 350_000_000, 480_000_000, 650_000_000,
	870_000_000
];
export const RABBIT_DATA = {
	"bro": {
		per_level: 1,
		base_cost: 360
	},
	"cousin": {
		per_level: 2,
		base_cost: 1440
	},
	"sis": {
		per_level: 3,
		base_cost: 3240
	},
	"father": {
		per_level: 4,
		base_cost: 5760
	},
	"grandma": {
		per_level: 5,
		base_cost: 9000
	}
};
const PRESTIGE_DATA = [
	//prestige 1
	{
		multiplier: 0,
		max_level: 120,
		requirement: 0,
		max_chocolate: 500_000_000,
		max_rarity: "UNCOMMON"
	},
	//prestige 2
	{
		multiplier: 0.1,
		max_level: 120,
		requirement: 150_000_000,
		max_chocolate: 1_200_000_000,
		max_rarity: "RARE"
	},
	//prestige 3
	{
		multiplier: 0.25,
		max_level: 120,
		requirement: 1_000_000_000,
		max_chocolate: 4_000_000_000,
		max_rarity: "EPIC"
	},
	//prestige 4
	{
		multiplier: 0.5,
		max_level: 120,
		requirement: 4_000_000_000,
		max_chocolate: 10_000_000_000,
		max_rarity: "LEGENDARY"
	},
	//prestige 5
	{
		multiplier: 1,
		max_level: 120,
		requirement: 10_000_000_000,
		max_chocolate: 25_000_000_000,
		max_rarity: "MYTHIC"
	}
];

export class ChocolateFactoryState {
	/** @type {SkyblockChocolateFactoryDataSerialized} */
	#data;
	/** @type {boolean} */
	#boosterCookieActive;

	/**
	 * @param {SkyblockChocolateFactoryDataSerialized} data
	 * @param {boolean} boosterCookieActive
	 */
	constructor(data, boosterCookieActive) {
		this.#data = data;
		this.#boosterCookieActive = boosterCookieActive;
	}

	clone() {
		return new ChocolateFactoryState(JSON.parse(JSON.stringify(this.#data)), this.#boosterCookieActive);
	}

	/**
	 * @returns {number}
	 */
	getPrestige() {
		return this.#data.chocolate_prestige;
	}

	getPrestigeData() {
		return PRESTIGE_DATA[this.getPrestige() - 1];
	}

	/**
	 * @param {string} type
	 */
	getRabbitInfo(type) {
		let level = this.#data.upgrades["rabbit_" + type] || 0;
		let data = RABBIT_DATA[type];
		let upgrade_cost = calculateUpgradePrice(data.base_cost, level, this.getPrestige());
		if (type === "bro" && level <= RABBIT_BRO_LEVEL_COSTS.length) upgrade_cost = RABBIT_BRO_LEVEL_COSTS[level - 1] * (0.6 + 0.4 * this.getPrestige());
		if (level >= this.getPrestigeData().max_level) upgrade_cost = Infinity;

		return {
			level,
			per_level: data.per_level,
			per_second: level * data.per_level,
			upgrade_cost
		};
	}

	getBarnInfo() {
		let level = this.#data.upgrades.barn || 1;
		let upgrade_cost = calculateUpgradePrice(BARN_BASE_COST, level - 1, 1);
		if (level >= BARN_MAX_LVL) upgrade_cost = Infinity;

		return {
			level,
			per_level: 2,
			capacity: 2 * level + 18,
			upgrade_cost
		};
	}

	getHandBakeInfo() {
		let level = this.#data.upgrades.click || 1;
		let upgrade_cost = HANDBAKED_LEVEL_COSTS[level - 2] || Infinity;
		if (level >= HANDBAKE_MAX_LVL) upgrade_cost = Infinity;

		return {
			level,
			per_click: level,
			upgrade_cost
		};
	}

	getTimeTowerInfo() {
		let level = this.#data.upgrades.time_tower || 1;
		let prestige_base_cost = 5_000_000 + 500_000 * this.getPrestige();
		let upgrade_cost = prestige_base_cost * (level - 1);
		if (level > 5) upgrade_cost += prestige_base_cost * (level - 5);
		if (level > 11) upgrade_cost += prestige_base_cost * 2 * (level - 11);
		if (level > 13) upgrade_cost += prestige_base_cost * 2 * (level - 13);
		if (level > 14) upgrade_cost += prestige_base_cost * 4 * (level - 14);
		if (level >= TIME_TOWER_MAX_LVL) upgrade_cost = Infinity;

		let activeTill = this.#data.time_tower.activation_time + 60000 * 60;

		return {
			level,
			multiplier: level * 0.1,
			upgrade_cost,
			activeTill,
		};
	}

	getShrineInfo() {
		let level = this.#data.upgrades.rabbit || 0;
		let upgrade_cost = 10_000_000 * level;
		if (level > 4) upgrade_cost += 10_000_000 * (level - 4);
		if (level > 9) upgrade_cost += 30_000_000 * (level - 9);
		if (level >= RABBIT_SHRINE_MAX_LVL) upgrade_cost = Infinity;

		return {
			level,
			rarity_increase: level * 0.01,
			upgrade_cost
		};
	}

	getCoachJackrabbitInfo() {
		let level = this.#data.upgrades.multiplier || 0;
		let upgrade_cost = JACKRABBIT_LEVEL_COSTS[level - 1] || Infinity;

		return {
			level,
			rarity_increase: level * 0.01,
			upgrade_cost
		};
	}

	getProduction() {
		let additive = [];

		let employeeTotal = 0;
		for (let rabbit in RABBIT_DATA) {
			employeeTotal += this.getRabbitInfo(rabbit).per_second;
		}

		//TODO: collection

		//TODO: talisman

		additive.push({
			amount: employeeTotal,
			source: "Rabbit Employees"
		});

		let additive_total = additive.reduce((acc, cur) => acc + cur.amount, 0);

		let multiplier = [];

		//TODO: collection

		if (this.getPrestige() > 1) {
			multiplier.push({
				amount: this.getPrestigeData().multiplier,
				source: "Chocolate Factory " + this.getPrestige()
			});
		}

		let timeTower = this.getTimeTowerInfo();
		if (timeTower.activeTill > Date.now()) {
			multiplier.push({
				amount: timeTower.multiplier,
				source: "§dTime Tower"
			});
		}

		if (this.#boosterCookieActive) {
			multiplier.push({
				amount: 0.25,
				source: "§dBooster Cookie"
			});
		}

		if (this.#data.upgrades.multiplier) {
			multiplier.push({
				amount: 0.01 * this.#data.upgrades.multiplier,
				source: "Coach Jackrabbit"
			});
		}

		let multiplier_total = multiplier.reduce((acc, cur) => acc + cur.amount, 1);

		return {
			total: additive_total * multiplier_total,
			additive_total,
			multiplier_total,
			additive,
			multiplier
		};
	}
}

function calculateUpgradePrice(base, level, prestige = 1) {
	return Math.round(base * Math.pow(1.05, level + 1) * (0.6 + 0.4 * prestige));
}