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
  baits: FishingBait[];
};

// TODO
export const FISH: Record<FishName, Fish> = {
  Anchovy: {
    baits: ["Earthworm"],
  },
  Butteryflyfish: {
    baits: ["Earthworm"],
  },
  Blowfish: {
    baits: ["Earthworm"],
  },
  Clownfish: {
    baits: ["Earthworm"],
  },
  "Sea Bass": {
    baits: ["Earthworm"],
  },
  "Sea Horse": {
    baits: ["Earthworm"],
  },
  "Horse Mackerel": {
    baits: ["Earthworm"],
  },
  Squid: {
    baits: ["Earthworm"],
  },
  "Red Snapper": {
    baits: ["Grub"],
  },
  "Mooray Eel": {
    baits: ["Grub"],
  },
  "Olive Flounder": {
    baits: ["Grub"],
  },
  Napoleanfish: {
    baits: ["Grub"],
  },
  Surgeonfish: {
    baits: ["Grub"],
  },
  "Zebra Turkeyfish": {
    baits: ["Grub"],
  },
  Ray: {
    baits: ["Grub"],
  },
  "Hammerhead shark": {
    baits: ["Grub"],
  },
  "Barred Knifejaw": {
    baits: [],
  },

  Tuna: {
    baits: ["Red Wiggler"],
  },
  "Mahi Mahi": {
    baits: ["Red Wiggler"],
  },
  "Blue Marlin": {
    baits: ["Red Wiggler"],
  },
  Oarfish: {
    baits: ["Red Wiggler"],
  },
  "Football fish": {
    baits: ["Red Wiggler"],
  },
  Sunfish: {
    baits: ["Red Wiggler"],
  },
  Coelacanth: {
    baits: ["Red Wiggler"],
  },
  "Whale Shark": {
    baits: ["Red Wiggler"],
  },
  "Saw Shark": {
    baits: ["Red Wiggler"],
  },
  "White Shark": {
    baits: ["Red Wiggler"],
  },
};
