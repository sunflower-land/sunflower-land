import Decimal from "decimal.js-light";
import { Worm } from "./composters";
import { GameState, InventoryItemName } from "./game";
import { Tool } from "./tools";
import { isWearableActive } from "../lib/wearables";
import { translate } from "lib/i18n/translate";

export type PurchaseableBait = "Fishing Lure";
export type FishingBait = Worm | PurchaseableBait;
export type FishType = "basic" | "advanced" | "expert" | "marine marvel";

export type FishName =
  // Basic
  | "Anchovy"
  | "Butterflyfish"
  | "Blowfish"
  | "Clownfish"
  | "Sea Bass"
  | "Sea Horse"
  | "Horse Mackerel"
  | "Halibut"
  | "Squid"
  // Advanced
  | "Red Snapper"
  | "Moray Eel"
  | "Olive Flounder"
  | "Napoleanfish"
  | "Surgeonfish"
  | "Zebra Turkeyfish"
  | "Angelfish"
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
  | "Parrotfish"
  | "Whale Shark"
  | "Saw Shark"
  | "White Shark";

export type MarineMarvelName =
  | "Twilight Anglerfish"
  | "Starlight Tuna"
  | "Radiant Ray"
  | "Phantom Barracuda"
  | "Gilded Swordfish"
  | "Crimson Carp"
  | "Battle Fish"
  | "Lemon Shark"
  | "Longhorn Cowfish";

export type OldFishName = "Kraken Tentacle";

export const PURCHASEABLE_BAIT: Record<PurchaseableBait, Tool> = {
  "Fishing Lure": {
    ingredients: {
      Gem: new Decimal(10),
    },
    price: 0,
    description: translate("purchaseableBait.fishingLure.description"),
    name: "Fishing Lure",
  },
};

export type Chum = Extract<
  InventoryItemName,
  | "Gold"
  | "Iron"
  | "Stone"
  | "Egg"
  | "Sunflower"
  | "Potato"
  | "Pumpkin"
  | "Carrot"
  | "Cabbage"
  | "Beetroot"
  | "Cauliflower"
  | "Parsnip"
  | "Eggplant"
  | "Radish"
  | "Corn"
  | "Wheat"
  | "Kale"
  | "Barley"
  | "Blueberry"
  | "Orange"
  | "Apple"
  | "Banana"
  | "Seaweed"
  | "Crab"
  | "Anchovy"
  | "Red Snapper"
  | "Tuna"
  | "Squid"
  | "Wood"
  | "Red Pansy"
  | "Rich Chicken"
  | "Fat Chicken"
  | "Speed Chicken"
  | "Horse Mackerel"
  | "Sunfish"
  | "Zebra Turkeyfish"
>;

export const CHUM_AMOUNTS: Record<Chum, number> = {
  Gold: 1,
  Iron: 5,
  Stone: 5,
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
  Corn: 5,
  Radish: 5,
  Wheat: 5,
  Kale: 5,
  Barley: 3,
  Blueberry: 3,
  Orange: 3,
  Apple: 3,
  Banana: 3,
  Seaweed: 1,
  Crab: 2,
  Anchovy: 1,
  "Red Snapper": 1,
  Tuna: 1,
  Squid: 1,
  Wood: 5,
  "Red Pansy": 1,
  "Fat Chicken": 3,
  "Rich Chicken": 3,
  "Speed Chicken": 3,
  "Horse Mackerel": 1,
  Sunfish: 1,
  "Zebra Turkeyfish": 1,
};

export const CHUM_DETAILS: Record<Chum, string> = {
  Gold: translate("chumDetails.gold"),
  Iron: translate("chumDetails.iron"),
  Stone: translate("chumDetails.stone"),
  Egg: translate("chumDetails.egg"),
  Sunflower: translate("chumDetails.sunflower"),
  Potato: translate("chumDetails.potato"),
  Pumpkin: translate("chumDetails.pumpkin"),
  Carrot: translate("chumDetails.carrot"),
  Cabbage: translate("chumDetails.cabbage"),
  Beetroot: translate("chumDetails.beetroot"),
  Cauliflower: translate("chumDetails.cauliflower"),
  Parsnip: translate("chumDetails.parsnip"),
  Eggplant: translate("chumDetails.eggplant"),
  Corn: translate("chumDetails.corn"),
  Radish: translate("chumDetails.radish"),
  Wheat: translate("chumDetails.wheat"),
  Kale: translate("chumDetails.kale"),
  Barley: "",
  Blueberry: translate("chumDetails.blueberry"),
  Orange: translate("chumDetails.orange"),
  Apple: translate("chumDetails.apple"),
  Banana: translate("chumDetails.banana"),
  Seaweed: translate("chumDetails.seaweed"),
  Crab: translate("chumDetails.crab"),
  Anchovy: translate("chumDetails.anchovy"),
  "Red Snapper": translate("chumDetails.redSnapper"),
  Tuna: translate("chumDetails.tuna"),
  Squid: translate("chumDetails.squid"),
  Wood: translate("chumDetails.wood"),
  "Red Pansy": translate("chumDetails.redPansy"),
  "Fat Chicken": translate("chumDetails.fatChicken"),
  "Rich Chicken": translate("chumDetails.richChicken"),
  "Speed Chicken": translate("chumDetails.speedChicken"),
  "Horse Mackerel": translate("chumDetails.horseMackerel"),
  Sunfish: translate("chumDetails.sunfish"),
  "Zebra Turkeyfish": translate("chumDetails.zebraFish"),
};

export type FishingLocation = "beach" | "wharf";

type Fish = {
  baits: FishingBait[];
  type: FishType;
  locations: FishingLocation[];
};

export const SEASONAL_FISH: Record<
  Extract<
    MarineMarvelName,
    "Crimson Carp" | "Lemon Shark" | "Battle Fish" | "Longhorn Cowfish"
  >,
  Fish
> = {
  "Crimson Carp": {
    baits: ["Grub", "Fishing Lure"],
    type: "marine marvel",
    locations: ["wharf"],
  },
  "Battle Fish": {
    baits: ["Earthworm", "Grub", "Fishing Lure"],
    type: "marine marvel",
    locations: ["wharf", "beach"],
  },
  "Lemon Shark": {
    baits: ["Grub", "Fishing Lure"],
    type: "marine marvel",
    locations: ["wharf", "beach"],
  },
  "Longhorn Cowfish": {
    baits: ["Red Wiggler", "Fishing Lure"],
    type: "marine marvel",
    locations: ["wharf", "beach"],
  },
};

// TODO
export const FISH: Record<FishName | MarineMarvelName, Fish> = {
  Anchovy: {
    baits: ["Earthworm"],
    type: "basic",
    locations: ["wharf"],
  },
  Butterflyfish: {
    baits: ["Earthworm"],
    type: "basic",
    locations: ["wharf"],
  },

  Blowfish: {
    baits: ["Earthworm"],
    type: "basic",
    locations: ["wharf"],
  },
  Clownfish: {
    baits: ["Earthworm"],
    type: "basic",
    locations: ["wharf"],
  },
  "Sea Bass": {
    baits: ["Earthworm"],
    type: "basic",
    locations: ["wharf"],
  },
  "Sea Horse": {
    baits: ["Earthworm"],
    type: "basic",
    locations: ["wharf"],
  },
  "Horse Mackerel": {
    baits: ["Earthworm"],
    type: "basic",
    locations: ["wharf"],
  },
  Halibut: {
    baits: ["Earthworm"],
    type: "basic",
    locations: ["beach"],
  },
  Squid: {
    baits: ["Earthworm"],
    type: "basic",
    locations: ["wharf"],
  },
  "Red Snapper": {
    baits: ["Grub", "Red Wiggler", "Fishing Lure"],
    type: "advanced",
    locations: ["wharf"],
  },
  "Moray Eel": {
    baits: ["Earthworm", "Grub", "Fishing Lure"],
    type: "advanced",
    locations: ["wharf"],
  },
  "Olive Flounder": {
    baits: ["Earthworm", "Grub", "Fishing Lure"],
    type: "advanced",
    locations: ["wharf"],
  },
  Napoleanfish: {
    baits: ["Grub", "Fishing Lure"],
    type: "advanced",
    locations: ["wharf"],
  },
  Surgeonfish: {
    baits: ["Grub", "Fishing Lure"],
    type: "advanced",
    locations: ["wharf"],
  },
  Angelfish: {
    baits: ["Grub", "Fishing Lure"],
    type: "advanced",
    locations: ["beach"],
  },
  "Zebra Turkeyfish": {
    baits: ["Grub", "Fishing Lure"],
    type: "advanced",
    locations: ["wharf"],
  },
  Ray: {
    baits: ["Grub", "Fishing Lure"],
    type: "advanced",
    locations: ["wharf"],
  },
  "Hammerhead shark": {
    baits: ["Grub", "Fishing Lure"],
    type: "advanced",
    locations: ["wharf"],
  },
  "Barred Knifejaw": {
    baits: ["Grub", "Fishing Lure"],
    type: "advanced",
    locations: ["wharf"],
  },
  Tuna: {
    baits: ["Grub", "Red Wiggler", "Fishing Lure"],
    type: "expert",
    locations: ["wharf"],
  },
  "Mahi Mahi": {
    baits: ["Grub", "Red Wiggler", "Fishing Lure"],
    type: "expert",
    locations: ["wharf"],
  },
  "Blue Marlin": {
    baits: ["Grub", "Red Wiggler", "Fishing Lure"],
    type: "expert",
    locations: ["wharf"],
  },
  Oarfish: {
    baits: ["Red Wiggler", "Fishing Lure"],
    type: "expert",
    locations: ["wharf"],
  },
  "Football fish": {
    baits: ["Red Wiggler", "Fishing Lure"],
    type: "expert",
    locations: ["wharf"],
  },
  Sunfish: {
    baits: ["Red Wiggler", "Fishing Lure"],
    type: "expert",
    locations: ["wharf"],
  },
  Coelacanth: {
    baits: ["Red Wiggler", "Fishing Lure"],
    type: "expert",
    locations: ["wharf"],
  },
  Parrotfish: {
    baits: ["Red Wiggler", "Fishing Lure"],
    type: "expert",
    locations: ["beach"],
  },
  "Whale Shark": {
    baits: ["Red Wiggler", "Fishing Lure"],
    type: "expert",
    locations: ["wharf"],
  },
  "Saw Shark": {
    baits: ["Red Wiggler", "Fishing Lure"],
    type: "expert",
    locations: ["wharf"],
  },
  "White Shark": {
    baits: ["Red Wiggler", "Fishing Lure"],
    type: "expert",
    locations: ["wharf"],
  },
  "Twilight Anglerfish": {
    baits: ["Red Wiggler", "Grub", "Fishing Lure"],
    type: "marine marvel",
    locations: ["wharf"],
  },
  "Starlight Tuna": {
    baits: ["Red Wiggler", "Fishing Lure"],
    type: "marine marvel",
    locations: ["wharf"],
  },
  "Radiant Ray": {
    baits: ["Red Wiggler", "Fishing Lure"],
    type: "marine marvel",
    locations: ["wharf"],
  },
  "Phantom Barracuda": {
    baits: ["Grub", "Fishing Lure"],
    type: "marine marvel",
    locations: ["wharf"],
  },
  "Gilded Swordfish": {
    baits: ["Earthworm", "Red Wiggler", "Fishing Lure"],
    type: "marine marvel",
    locations: ["wharf"],
  },
  ...SEASONAL_FISH,
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

/**
 * Difficulty 1-5 how hard the challenge will be
 */
export const FISH_DIFFICULTY: Partial<
  Record<FishName | MarineMarvelName, number>
> = {
  "Horse Mackerel": 1,
  Squid: 1,
  "Zebra Turkeyfish": 1,
  Ray: 1,
  "Hammerhead shark": 2,
  Sunfish: 2,
  Coelacanth: 2,
  "Barred Knifejaw": 3,
  "Whale Shark": 3,
  "Gilded Swordfish": 3,
  "Saw Shark": 4,
  "White Shark": 4,
  "Radiant Ray": 4,
  "Phantom Barracuda": 4,
  "Starlight Tuna": 5,
  "Twilight Anglerfish": 5,
};

export function getDailyFishingCount(state: GameState): number {
  const today = new Date().toISOString().split("T")[0];
  return state.fishing.dailyAttempts?.[today] ?? 0;
}

export function getDailyFishingLimit(game: GameState): number {
  let limit = 20;

  // +10 daily limit if player has Angler Waders
  if (isWearableActive({ name: "Angler Waders", game })) {
    limit += 10;
  }

  // +5 daily limit if player had Fisherman's 5 Fold skill
  if (game.bumpkin?.skills["Fisherman's 5 Fold"]) {
    limit += 5;
  }

  return limit;
}
