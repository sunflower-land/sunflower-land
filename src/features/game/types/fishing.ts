import { Bait } from "./composters";
import { InventoryItemName } from "./game";

export type FishingBait = Bait;

export type FishName =
  // Basic
  | "Anchovy"
  | "Butteryflyfish"
  | "Blowfish"
  | "Clownfish"
  | "Sea Bass"
  | "Sea Horse"
  | "Horse Mackerel"
  | "Squid"
  // Advanced
  | "Red Snapper"
  | "Mooray Eel"
  | "Olive Flounder"
  | "Napoleanfish"
  | "Surgeonfish"
  | "Zebra Turkeyfish"
  | "Ray"
  | "Hammerhead shark"
  | "Barred Knifejaw" // Coming Soon
  // Expert
  | "Tuna"
  | "Mahi Mahi"
  | "Blue Marlin"
  | "Oarfish"
  | "Football fish"
  | "Sunfish"
  | "Coelacanth"
  | "Whale Shark"
  | "Saw Shark" // Coming Soon
  | "White Shark"; // Coming Soon

export const CHUM_AMOUNTS: Partial<Record<InventoryItemName, number>> = {
  Gold: 1,
  Iron: 5,
  Egg: 5,
  Sunflower: 50,
  Potato: 20,
  Pumpkin: 20,
  Cabbage: 10,
  Carrot: 10,
  Beetroot: 10,
  Cauliflower: 5,
  Radish: 5,
  Eggplant: 5,
  Parsnip: 5,
  Wheat: 5,
  Kale: 5,
  Blueberry: 3,
  Orange: 3,
  Apple: 3,
};

type Fish = {
  todo?: boolean;
};

// TODO
export const FISH: Record<FishName, Fish> = {
  Anchovy: {},
  Butteryflyfish: {},
  Blowfish: {},
  Clownfish: {},
  "Sea Bass": {},
  "Sea Horse": {},
  "Horse Mackerel": {},
  Squid: {},
  "Red Snapper": {},
  "Mooray Eel": {},
  "Olive Flounder": {},
  Napoleanfish: {},
  Surgeonfish: {},
  "Zebra Turkeyfish": {},
  Ray: {},
  "Hammerhead shark": {},
  Tuna: {},
  "Mahi Mahi": {},
  "Blue Marlin": {},
  Oarfish: {},
  "Football fish": {},
  Sunfish: {},
  Coelacanth: {},
  "Whale Shark": {},
  "Barred Knifejaw": {},
  "Saw Shark": {},
  "White Shark": {},
};
