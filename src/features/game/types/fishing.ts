import { Bait } from "./composters";
import { InventoryItemName } from "./game";

export type FishingBait = Bait;
export type FishType = "basic" | "advanced" | "expert";

export type FishName =
  // Basic
  | "Anchovy"
  | "Butterflyfish"
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
  Carrot: 10,
  Cabbage: 10,
  Beetroot: 10,
  Cauliflower: 5,
  Parsnip: 5,
  Eggplant: 5,
  // Corn?
  Radish: 5,
  Wheat: 5,
  Kale: 5,
  Blueberry: 3,
  Orange: 3,
  Apple: 3,
  Seaweed: 1,
  Anchovy: 1,
  "Red Snapper": 1,
  Tuna: 1,
  Squid: 1,
};

type Fish = {
  baits: FishingBait[];
  type: FishType;
};

// TODO
export const FISH: Record<FishName, Fish> = {
  Anchovy: {
    baits: ["Earthworm"],
    type: "basic",
  },
  Butterflyfish: {
    baits: ["Earthworm"],
    type: "basic",
  },
  Blowfish: {
    baits: ["Earthworm"],
    type: "basic",
  },
  Clownfish: {
    baits: ["Earthworm"],
    type: "basic",
  },
  "Sea Bass": {
    baits: ["Earthworm"],
    type: "basic",
  },
  "Sea Horse": {
    baits: ["Earthworm"],
    type: "basic",
  },
  "Horse Mackerel": {
    baits: ["Earthworm"],
    type: "basic",
  },
  Squid: {
    baits: ["Earthworm"],
    type: "basic",
  },
  "Red Snapper": {
    baits: ["Grub"],
    type: "advanced",
  },
  "Mooray Eel": {
    baits: ["Grub"],
    type: "advanced",
  },
  "Olive Flounder": {
    baits: ["Grub"],
    type: "advanced",
  },
  Napoleanfish: {
    baits: ["Grub"],
    type: "advanced",
  },
  Surgeonfish: {
    baits: ["Grub"],
    type: "advanced",
  },
  "Zebra Turkeyfish": {
    baits: ["Grub"],
    type: "advanced",
  },
  Ray: {
    baits: ["Grub"],
    type: "advanced",
  },
  "Hammerhead shark": {
    baits: ["Grub"],
    type: "advanced",
  },
  "Barred Knifejaw": {
    baits: [],
    type: "advanced",
  },

  Tuna: {
    baits: ["Red Wiggler"],
    type: "expert",
  },
  "Mahi Mahi": {
    baits: ["Red Wiggler"],
    type: "expert",
  },
  "Blue Marlin": {
    baits: ["Red Wiggler"],
    type: "expert",
  },
  Oarfish: {
    baits: ["Red Wiggler"],
    type: "expert",
  },
  "Football fish": {
    baits: ["Red Wiggler"],
    type: "expert",
  },
  Sunfish: {
    baits: ["Red Wiggler"],
    type: "expert",
  },
  Coelacanth: {
    baits: ["Red Wiggler"],
    type: "expert",
  },
  "Whale Shark": {
    baits: ["Red Wiggler"],
    type: "expert",
  },
  "Saw Shark": {
    baits: ["Red Wiggler"],
    type: "expert",
  },
  "White Shark": {
    baits: ["Red Wiggler"],
    type: "expert",
  },
};

export type Tide = "Dusktide" | "Dawnlight";

export type FishingConditions = "Sunny" | "Windy" | "Full Moon" | "Fish Frenzy";

export function getTide(utcTime: Date = new Date()): Tide {
  const hours = new Date(utcTime).getUTCHours();
  if (hours >= 0 && hours < 12) {
    return "Dawnlight";
  } else {
    return "Dusktide";
  }
}
