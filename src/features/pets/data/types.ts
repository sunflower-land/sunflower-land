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
  "Seedling Hat",
  "Radar Hat",
  "Halo",
  "Brain Hat",
  "Red Bow",
  "Blue Bow",
  "Glasses",
  "Flower Crown",
  "Crown",
  "Propeller Hat",
  "Cowboy Hat",
] as const;

export type AccessoryTrait = (typeof ACCESSORY_TRAITS)[number];

export type AuraTrait = "No Aura" | "Basic Aura" | "Epic Aura" | "Mega Aura";

export const auras: Trait<AuraTrait>[] = [
  { name: "No Aura", supply: 2580 },
  { name: "Basic Aura", supply: 240 },
  { name: "Epic Aura", supply: 120 },
  { name: "Mega Aura", supply: 60 },
];

export const initial_auction_auras: Trait<AuraTrait>[] = [
  { name: "No Aura", supply: 860 },
  { name: "Basic Aura", supply: 80 },
  { name: "Epic Aura", supply: 40 },
  { name: "Mega Aura", supply: 20 },
];

export const chapter_auction_auras: Trait<AuraTrait>[] = [
  { name: "No Aura", supply: 215 },
  { name: "Basic Aura", supply: 20 },
  { name: "Epic Aura", supply: 10 },
  { name: "Mega Aura", supply: 5 },
];

export type PetTraits = {
  type: PetNFTType;
  fur: FurTrait;
  accessory: AccessoryTrait;
  bib: BibTrait;
  aura: AuraTrait;
};
