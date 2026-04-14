import { PetNFTType } from "features/game/types/pets";

export type Trait<T> = {
  name: T;
  supply: number;
  multiplier?: number;
};

export type TraitGroup =
  | "types"
  | "fur_patterns"
  | "accessory_patterns"
  | "bibs"
  | "aura"
  | "backgrounds";

export const types: Trait<PetNFTType>[] = [
  { name: "Dragon", supply: 300 },
  { name: "Phoenix", supply: 450 },
  { name: "Griffin", supply: 450 },
  { name: "Ram", supply: 450 },
  { name: "Warthog", supply: 450 },
  { name: "Wolf", supply: 450 },
  { name: "Bear", supply: 450 },
];

export const BIB_TRAITS = ["Baby Bib", "Collar", "Gold Necklace"] as const;

export type BibTrait = (typeof BIB_TRAITS)[number];

export const FUR_TRAITS = [
  "Dark",
  "White",
  "Grey",
  "Brown",
  "Purple",
  "Blue",
  "Red",
  "Green",
  "Pink",
  "Yellow",
  "Cream",
  "Ghost-Teal",
  "Dark-Red",
  "Dark-Green",
  "Dark-Teal",
] as const;

export type FurTrait = (typeof FUR_TRAITS)[number];

export const ACCESSORY_TRAITS = [
  "Seedling",
  "Halo",
  "Brain",
  "Firefly",
  "Glasses",
  "Red Bow",
  "Blue Bow",
  "Flower Crown",
  "Crown",
  "Propeller Hat",
] as const;

export type AccessoryTrait = (typeof ACCESSORY_TRAITS)[number];

export const AURA_TRAITS = [
  "No Aura",
  "Common Aura",
  "Rare Aura",
  "Mythic Aura",
] as const;

export type AuraTrait = (typeof AURA_TRAITS)[number];

export const auras: Trait<AuraTrait>[] = [
  { name: "No Aura", supply: 2580 },
  { name: "Common Aura", supply: 240 },
  { name: "Rare Aura", supply: 120 },
  { name: "Mythic Aura", supply: 60 },
];

export const initial_auction_auras: Trait<AuraTrait>[] = [
  { name: "No Aura", supply: 860 },
  { name: "Common Aura", supply: 80 },
  { name: "Rare Aura", supply: 40 },
  { name: "Mythic Aura", supply: 20 },
];

export const chapter_auction_auras: Trait<AuraTrait>[] = [
  { name: "No Aura", supply: 215 },
  { name: "Common Aura", supply: 20 },
  { name: "Rare Aura", supply: 10 },
  { name: "Mythic Aura", supply: 5 },
];

export type PetTraits = {
  type: PetNFTType;
  fur: FurTrait;
  accessory: AccessoryTrait;
  bib: BibTrait;
  aura: AuraTrait;
};
