import Decimal from "decimal.js-light";
import { Worm } from "./composters";
import { GameState, InventoryItemName, TemperateSeasonName } from "./game";
import { Tool } from "./tools";
import { isWearableActive } from "../lib/wearables";
import { translate } from "lib/i18n/translate";

export type PurchaseableBait = "Fishing Lure";
export type FishingBait = Worm | PurchaseableBait;
export type FishType = "basic" | "advanced" | "expert" | "marine marvel";

export type FishName =
  | "Anchovy"
  | "Butterflyfish"
  | "Blowfish"
  | "Clownfish"
  | "Sea Bass"
  | "Sea Horse"
  | "Horse Mackerel"
  | "Halibut"
  | "Squid"
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
  | "White Shark"
  | "Porgy"
  | "Muskellunge"
  | "Trout"
  | "Walleye"
  | "Weakfish"
  | "Rock Blackfish"
  | "Cobia"
  | "Tilapia";

export type MarineMarvelName =
  | "Twilight Anglerfish"
  | "Starlight Tuna"
  | "Radiant Ray"
  | "Phantom Barracuda"
  | "Gilded Swordfish"
  | "Crimson Carp"
  | "Battle Fish"
  | "Lemon Shark"
  | "Longhorn Cowfish"
  | "Jellyfish";

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
  | "Wild Mushroom"
  | "Honey"
  | "Rhubarb"
  | "Broccoli"
  | "Pepper"
  | "Artichoke"
  | "Yam"
  | "Onion"
  | "Turnip"
>;

export const CHUM_AMOUNTS: Record<Chum, number> = {
  Gold: 1,
  "Wild Mushroom": 1,
  Honey: 1,
  Iron: 5,
  Stone: 5,
  Egg: 5,
  Sunflower: 50,
  Potato: 20,
  Yam: 20,
  Rhubarb: 20,
  Pumpkin: 20,
  Carrot: 10,
  Cabbage: 10,
  Broccoli: 10,
  Pepper: 10,
  Beetroot: 10,
  Onion: 5,
  Cauliflower: 5,
  Parsnip: 5,
  Eggplant: 5,
  Corn: 5,
  Radish: 5,
  Turnip: 5,
  Wheat: 5,
  Kale: 5,
  Barley: 3,
  Artichoke: 3,
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
  "Wild Mushroom": translate("chumDetails.wildMushroom"),
  Honey: translate("chumDetails.honey"),
  Rhubarb: translate("chumDetails.rhubarb"),
  Yam: translate("chumDetails.yam"),
  Broccoli: translate("chumDetails.broccoli"),
  Pepper: translate("chumDetails.pepper"),
  Artichoke: translate("chumDetails.artichoke"),
  Onion: translate("chumDetails.onion"),
  Turnip: translate("chumDetails.turnip"),
};

export type FishingLocation = "beach" | "wharf";

type Fish = {
  baits: FishingBait[];
  type: FishType;
  likes: Chum[];
  locations: FishingLocation[];
  seasons: TemperateSeasonName[];
};

export const CHAPTER_FISH: Record<
  Extract<
    MarineMarvelName,
    | "Crimson Carp"
    | "Lemon Shark"
    | "Battle Fish"
    | "Longhorn Cowfish"
    | "Jellyfish"
  >,
  Fish
> = {
  "Crimson Carp": {
    baits: ["Grub", "Fishing Lure"],
    type: "marine marvel",
    locations: ["wharf"],
    likes: [],
    seasons: [],
  },
  "Battle Fish": {
    baits: ["Earthworm", "Grub", "Fishing Lure"],
    type: "marine marvel",
    locations: ["wharf", "beach"],
    likes: [],
    seasons: [],
  },
  "Lemon Shark": {
    baits: ["Grub", "Fishing Lure"],
    type: "marine marvel",
    locations: ["wharf", "beach"],
    likes: [],
    seasons: [],
  },
  "Longhorn Cowfish": {
    baits: ["Red Wiggler", "Fishing Lure"],
    type: "marine marvel",
    locations: ["wharf", "beach"],
    likes: [],
    seasons: [],
  },
  Jellyfish: {
    baits: ["Grub", "Red Wiggler", "Fishing Lure"],
    type: "marine marvel",
    locations: ["wharf", "beach"],
    likes: [],
    seasons: [],
  },
};

// TODO
export const FISH: Record<FishName | MarineMarvelName, Fish> = {
  Anchovy: {
    baits: ["Earthworm"],
    type: "basic",
    likes: ["Carrot", "Egg"],
    locations: ["wharf"],
    seasons: ["spring", "summer", "autumn", "winter"],
  },
  Butterflyfish: {
    baits: ["Earthworm"],
    type: "basic",
    locations: ["wharf"],
    likes: ["Sunflower"],
    seasons: ["summer", "autumn"],
  },

  Blowfish: {
    baits: ["Earthworm"],
    type: "basic",
    locations: ["wharf"],
    likes: ["Yam"],
    seasons: ["winter"],
  },
  Clownfish: {
    baits: ["Earthworm"],
    type: "basic",
    locations: ["wharf"],
    likes: ["Cabbage"],
    seasons: ["summer", "winter"],
  },
  "Sea Bass": {
    baits: ["Earthworm"],
    type: "basic",
    locations: ["wharf"],
    likes: ["Yam"],
    seasons: ["spring", "autumn"],
  },
  "Sea Horse": {
    baits: ["Earthworm"],
    type: "basic",
    locations: ["wharf"],
    likes: ["Seaweed"],
    seasons: ["spring", "summer"],
  },
  "Horse Mackerel": {
    baits: ["Earthworm"],
    type: "basic",
    locations: ["wharf"],
    likes: ["Blueberry"],
    seasons: ["summer", "winter"],
  },
  Halibut: {
    baits: ["Earthworm"],
    type: "basic",
    locations: ["beach"],
    likes: ["Anchovy"],
    seasons: ["spring", "autumn"],
  },
  Squid: {
    baits: ["Earthworm"],
    type: "basic",
    locations: ["wharf"],
    likes: ["Eggplant", "Onion"],
    seasons: ["spring", "winter"],
  },
  "Red Snapper": {
    baits: ["Grub", "Red Wiggler", "Fishing Lure"],
    type: "advanced",
    locations: ["wharf"],
    likes: ["Apple", "Honey"],
    seasons: ["spring", "summer", "autumn", "winter"],
  },
  "Moray Eel": {
    baits: ["Earthworm", "Grub", "Fishing Lure"],
    type: "advanced",
    locations: ["wharf"],
    likes: ["Gold"],
    seasons: ["summer", "autumn"],
  },
  "Olive Flounder": {
    baits: ["Earthworm", "Grub", "Fishing Lure"],
    type: "advanced",
    locations: ["wharf"],
    likes: ["Rhubarb"],
    seasons: ["spring", "autumn"],
  },
  Napoleanfish: {
    baits: ["Grub", "Fishing Lure"],
    type: "advanced",
    locations: ["wharf"],
    likes: ["Carrot"],
    seasons: ["summer", "autumn"],
  },
  Surgeonfish: {
    baits: ["Grub", "Fishing Lure"],
    type: "advanced",
    locations: ["wharf"],
    likes: ["Orange"],
    seasons: ["summer", "autumn"],
  },
  Angelfish: {
    baits: ["Grub", "Fishing Lure"],
    type: "advanced",
    locations: ["beach"],
    likes: ["Banana"],
    seasons: ["summer", "winter"],
  },
  "Zebra Turkeyfish": {
    baits: ["Grub", "Fishing Lure"],
    type: "advanced",
    locations: ["wharf"],
    likes: ["Beetroot", "Rhubarb"],
    seasons: ["spring", "summer"],
  },
  Ray: {
    baits: ["Grub", "Fishing Lure"],
    type: "advanced",
    locations: ["wharf"],
    likes: ["Squid"],
    seasons: ["spring", "summer"],
  },
  "Hammerhead shark": {
    baits: ["Grub", "Fishing Lure"],
    type: "advanced",
    locations: ["wharf"],
    likes: ["Iron"],
    seasons: ["summer", "autumn"],
  },
  "Barred Knifejaw": {
    baits: ["Grub", "Fishing Lure"],
    type: "advanced",
    locations: ["wharf"],
    likes: ["Anchovy"],
    seasons: ["spring", "summer"],
  },
  Tuna: {
    baits: ["Grub", "Red Wiggler", "Fishing Lure"],
    type: "expert",
    locations: ["wharf"],
    likes: ["Orange", "Wild Mushroom"],
    seasons: ["spring", "summer", "autumn", "winter"],
  },
  "Mahi Mahi": {
    baits: ["Grub", "Red Wiggler", "Fishing Lure"],
    type: "expert",
    locations: ["wharf"],
    likes: ["Corn"],
    seasons: ["summer", "autumn"],
  },
  "Blue Marlin": {
    baits: ["Grub", "Red Wiggler", "Fishing Lure"],
    type: "expert",
    locations: ["wharf"],
    likes: ["Wheat"],
    seasons: ["summer", "winter"],
  },
  Oarfish: {
    baits: ["Red Wiggler", "Fishing Lure"],
    type: "expert",
    locations: ["wharf"],
    likes: ["Kale"],
    seasons: ["spring", "winter"],
  },
  "Football fish": {
    baits: ["Red Wiggler", "Fishing Lure"],
    type: "expert",
    locations: ["wharf"],
    likes: ["Sunflower"],
    seasons: ["winter"],
  },
  Sunfish: {
    baits: ["Red Wiggler", "Fishing Lure"],
    type: "expert",
    locations: ["wharf"],
    likes: ["Anchovy"],
    seasons: ["summer", "autumn"],
  },
  Coelacanth: {
    baits: ["Red Wiggler", "Fishing Lure"],
    type: "expert",
    locations: ["wharf"],
    likes: ["Cabbage"],
    seasons: ["spring", "winter"],
  },
  Parrotfish: {
    baits: ["Red Wiggler", "Fishing Lure"],
    type: "expert",
    locations: ["beach"],
    likes: ["Seaweed"],
    seasons: ["spring", "summer"],
  },
  "Whale Shark": {
    baits: ["Red Wiggler", "Fishing Lure"],
    type: "expert",
    locations: ["wharf"],
    likes: ["Crab"],
    seasons: ["summer", "winter"],
  },
  "Saw Shark": {
    baits: ["Red Wiggler", "Fishing Lure"],
    type: "expert",
    locations: ["wharf"],
    likes: ["Red Snapper"],
    seasons: ["spring", "summer"],
  },
  "White Shark": {
    baits: ["Red Wiggler", "Fishing Lure"],
    type: "expert",
    locations: ["wharf"],
    likes: ["Tuna"],
    seasons: ["summer", "winter"],
  },
  "Twilight Anglerfish": {
    baits: ["Red Wiggler", "Grub", "Fishing Lure"],
    type: "marine marvel",
    locations: ["wharf"],
    likes: [],
    seasons: [],
  },
  "Starlight Tuna": {
    baits: ["Red Wiggler", "Fishing Lure"],
    type: "marine marvel",
    locations: ["wharf"],
    likes: [],
    seasons: [],
  },
  "Radiant Ray": {
    baits: ["Red Wiggler", "Fishing Lure"],
    type: "marine marvel",
    locations: ["wharf"],
    likes: [],
    seasons: [],
  },
  "Phantom Barracuda": {
    baits: ["Grub", "Fishing Lure"],
    type: "marine marvel",
    locations: ["wharf"],
    likes: [],
    seasons: [],
  },
  "Gilded Swordfish": {
    baits: ["Earthworm", "Red Wiggler", "Fishing Lure"],
    type: "marine marvel",
    locations: ["wharf"],
    likes: [],
    seasons: [],
  },
  Porgy: {
    baits: ["Earthworm"],
    type: "basic",
    locations: ["wharf"],
    likes: [], // TODO - release after chapter
    seasons: ["spring"],
  },
  Muskellunge: {
    baits: ["Earthworm"],
    type: "basic",
    locations: ["wharf"],
    likes: [], // TODO - release after chapter
    seasons: ["autumn"],
  },
  Walleye: {
    baits: ["Grub"],
    type: "advanced",
    locations: ["wharf"],
    likes: [], // TODO - release after chapter
    seasons: ["winter"],
  },
  "Rock Blackfish": {
    baits: ["Grub"],
    type: "advanced",
    locations: ["wharf"],
    likes: [], // TODO - release after chapter
    seasons: ["autumn"],
  },
  Cobia: {
    baits: ["Grub"],
    type: "expert",
    locations: ["wharf"],
    likes: [], // TODO - release after chapter
    seasons: ["summer"],
  },
  Trout: {
    baits: ["Earthworm"],
    type: "expert",
    locations: ["wharf"],
    likes: [], // TODO - release after chapter
    seasons: ["winter"],
  },

  Weakfish: {
    baits: ["Earthworm"],
    type: "expert",
    locations: ["wharf"],
    likes: [], // TODO - release after chapter
    seasons: ["spring"],
  },
  Tilapia: {
    baits: ["Grub"],
    type: "advanced",
    locations: ["wharf"],
    likes: [], // TODO - release after chapter
    seasons: ["summer"],
  },

  ...CHAPTER_FISH,
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

  if (game.bumpkin?.skills["Fisherman's 5 Fold"]) {
    limit += 5;
  }

  // +10 daily limit if player had Fisherman's 10 Fold skill
  if (game.bumpkin?.skills["Fisherman's 10 Fold"]) {
    limit += 10;
  }

  // +10 daily limit if player has the More With Less skill
  if (game.bumpkin?.skills["More With Less"]) {
    limit += 15;
  }

  return limit;
}

export const BAIT: Record<FishingBait, true> = {
  Earthworm: true,
  Grub: true,
  "Red Wiggler": true,
  "Fishing Lure": true,
};

export const WINDS_OF_CHANGE_FISH: FishName[] = [
  "Porgy",
  "Muskellunge",
  "Trout",
  "Walleye",
  "Weakfish",
  "Rock Blackfish",
  "Cobia",
  "Tilapia",
];
