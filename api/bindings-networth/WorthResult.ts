// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { ItemWorthResult } from "./ItemWorthResult";
import type { PetWorthResult } from "./PetWorthResult";
import type { SackWorthResult } from "./SackWorthResult";

export type WorthResult = { "type": "Pet" } & PetWorthResult | { "type": "Item" } & ItemWorthResult | { "type": "Sack" } & SackWorthResult;