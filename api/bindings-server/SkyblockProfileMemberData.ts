// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { NetworthResult } from "./NetworthResult";
import type { SPMDungeonData } from "./SPMDungeonData";
import type { SPMSkillsData } from "./SPMSkillsData";
import type { SPMSlayerData } from "./SPMSlayerData";
import type { SPMWeightData } from "./SPMWeightData";

export interface SkyblockProfileMemberData { uuid: string, sb_exp: bigint, networth: NetworthResult, bestiary: bigint, slayer: SPMSlayerData, dungeons: SPMDungeonData, skills: SPMSkillsData, weight: SPMWeightData, }