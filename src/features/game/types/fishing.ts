import { Worm } from "./composters";
import {
  BoostName,
  GameState,
  InventoryItemName,
  TemperateSeasonName,
} from "./game";
import { isWearableActive } from "../lib/wearables";
import { translate } from "lib/i18n/translate";
import { PurchaseOptions } from "./buyOptionPurchaseItem";
import { Decimal } from "decimal.js-light";
import { isCollectibleBuilt } from "../lib/collectibleBuilt";

export type PurchaseableBait = "Fishing Lure";
export type FishingBait = Worm | PurchaseableBait;
export type FishType =
  | "basic"
  | "advanced"
  | "expert"
  | "marine marvel"
  | "chapter";

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
  | "Jellyfish"
  | "Pink Dolphin"
  | "Poseidon"
  | "Super Star";

export type OldFishName = "Kraken Tentacle";

export const PURCHASEABLE_BAIT: Record<PurchaseableBait, PurchaseOptions> = {
  "Fishing Lure": {
    purchaseOptions: {
      Gem: { ingredients: { Gem: new Decimal(10) } },
      Feather: { ingredients: { Feather: new Decimal(100) } },
    },
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
  | "Zucchini"
  | "Weed"
  | "Acorn"
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
  Zucchini: 20,
  Weed: 3,
  Acorn: 3,
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
  Zucchini: "",
  Weed: translate("chumDetails.weed"),
  Acorn: translate("chumDetails.acorn"),
};

type Fish = {
  baits: FishingBait[];
  type: FishType;
  likes: Chum[];
  seasons: TemperateSeasonName[];
};

export type ChapterFish = Extract<
  MarineMarvelName,
  | "Crimson Carp"
  | "Lemon Shark"
  | "Battle Fish"
  | "Longhorn Cowfish"
  | "Jellyfish"
  | "Pink Dolphin"
  | "Poseidon"
  | "Super Star"
>;

export const CHAPTER_FISH: Record<ChapterFish, Fish> = {
  "Crimson Carp": {
    baits: ["Grub", "Fishing Lure"],
    type: "chapter",
    likes: [],
    seasons: [],
  },
  "Battle Fish": {
    baits: ["Earthworm", "Grub", "Fishing Lure"],
    type: "chapter",
    likes: [],
    seasons: [],
  },
  "Lemon Shark": {
    baits: ["Grub", "Fishing Lure"],
    type: "chapter",
    likes: [],
    seasons: [],
  },
  "Longhorn Cowfish": {
    baits: ["Red Wiggler", "Fishing Lure"],
    type: "chapter",
    likes: [],
    seasons: [],
  },
  Jellyfish: {
    baits: ["Grub", "Red Wiggler", "Fishing Lure"],
    type: "chapter",
    likes: [],
    seasons: [],
  },
  "Pink Dolphin": {
    baits: ["Grub", "Red Wiggler", "Fishing Lure"],
    type: "chapter",
    likes: [],
    seasons: [],
  },
  Poseidon: {
    baits: ["Grub", "Red Wiggler", "Fishing Lure"],
    type: "chapter",
    likes: [],
    seasons: [],
  },
  "Super Star": {
    baits: ["Red Wiggler", "Fishing Lure"],
    type: "chapter",
    likes: [],
    seasons: [],
  },
};

// TODO
export const FISH: Record<FishName | MarineMarvelName, Fish> = {
  // Basic
  Anchovy: {
    baits: ["Earthworm"],
    type: "basic",
    likes: ["Carrot", "Egg"],
    seasons: ["spring", "summer", "autumn", "winter"],
  },
  Butterflyfish: {
    baits: ["Earthworm"],
    type: "basic",
    likes: ["Sunflower"],
    seasons: ["summer", "autumn"],
  },

  Blowfish: {
    baits: ["Earthworm"],
    type: "basic",
    likes: ["Yam"],
    seasons: ["winter"],
  },
  Clownfish: {
    baits: ["Earthworm"],
    type: "basic",
    likes: ["Cabbage"],
    seasons: ["summer", "winter"],
  },
  "Sea Bass": {
    baits: ["Earthworm"],
    type: "basic",
    likes: ["Anchovy"],
    seasons: ["spring", "autumn"],
  },
  "Sea Horse": {
    baits: ["Earthworm"],
    type: "basic",
    likes: ["Seaweed"],
    seasons: ["spring", "summer"],
  },
  "Horse Mackerel": {
    baits: ["Earthworm"],
    type: "basic",
    likes: ["Blueberry"],
    seasons: ["summer", "winter"],
  },
  Halibut: {
    baits: ["Earthworm"],
    type: "basic",
    likes: ["Anchovy"],
    seasons: ["spring", "autumn"],
  },
  Squid: {
    baits: ["Earthworm"],
    type: "basic",
    likes: ["Eggplant", "Onion"],
    seasons: ["spring", "winter"],
  },
  Porgy: {
    baits: ["Earthworm"],
    type: "basic",
    likes: ["Yam"],
    seasons: ["spring"],
  },
  Muskellunge: {
    baits: ["Earthworm"],
    type: "basic",
    likes: ["Turnip"],
    seasons: ["autumn"],
  },

  // Advanced
  "Red Snapper": {
    baits: ["Grub", "Red Wiggler", "Fishing Lure"],
    type: "advanced",
    likes: ["Apple", "Honey"],
    seasons: ["spring", "summer", "autumn", "winter"],
  },
  "Moray Eel": {
    baits: ["Earthworm", "Grub", "Fishing Lure"],
    type: "advanced",
    likes: ["Gold"],
    seasons: ["summer", "autumn"],
  },
  "Olive Flounder": {
    baits: ["Earthworm", "Grub", "Fishing Lure"],
    type: "advanced",
    likes: ["Rhubarb"],
    seasons: ["spring", "autumn"],
  },
  Napoleanfish: {
    baits: ["Grub", "Fishing Lure"],
    type: "advanced",
    likes: ["Carrot"],
    seasons: ["summer", "autumn"],
  },
  Surgeonfish: {
    baits: ["Grub", "Fishing Lure"],
    type: "advanced",
    likes: ["Orange"],
    seasons: ["summer", "autumn"],
  },
  Angelfish: {
    baits: ["Grub", "Fishing Lure"],
    type: "advanced",
    likes: ["Banana"],
    seasons: ["summer", "winter"],
  },
  "Zebra Turkeyfish": {
    baits: ["Grub", "Fishing Lure"],
    type: "advanced",
    likes: ["Beetroot", "Rhubarb"],
    seasons: ["spring", "summer"],
  },
  Ray: {
    baits: ["Grub", "Fishing Lure"],
    type: "advanced",
    likes: ["Squid"],
    seasons: ["spring", "summer"],
  },
  "Hammerhead shark": {
    baits: ["Grub", "Fishing Lure"],
    type: "advanced",
    likes: ["Iron"],
    seasons: ["summer", "autumn"],
  },
  "Barred Knifejaw": {
    baits: ["Grub", "Fishing Lure"],
    type: "advanced",
    likes: ["Anchovy"],
    seasons: ["spring", "summer"],
  },
  Walleye: {
    baits: ["Grub"],
    type: "advanced",
    likes: ["Broccoli"],
    seasons: ["winter"],
  },
  "Rock Blackfish": {
    baits: ["Grub"],
    type: "advanced",
    likes: ["Onion"],
    seasons: ["autumn"],
  },
  Tilapia: {
    baits: ["Grub"],
    type: "advanced",
    likes: ["Zucchini"],
    seasons: ["summer"],
  },

  // Expert
  Tuna: {
    baits: ["Grub", "Red Wiggler", "Fishing Lure"],
    type: "expert",
    likes: ["Orange", "Wild Mushroom"],
    seasons: ["spring", "summer", "autumn", "winter"],
  },
  "Mahi Mahi": {
    baits: ["Grub", "Red Wiggler", "Fishing Lure"],
    type: "expert",
    likes: ["Corn"],
    seasons: ["summer", "autumn"],
  },
  "Blue Marlin": {
    baits: ["Grub", "Red Wiggler", "Fishing Lure"],
    type: "expert",
    likes: ["Wheat"],
    seasons: ["summer", "winter"],
  },
  Oarfish: {
    baits: ["Red Wiggler", "Fishing Lure"],
    type: "expert",
    likes: ["Kale"],
    seasons: ["spring", "winter"],
  },
  "Football fish": {
    baits: ["Red Wiggler", "Fishing Lure"],
    type: "expert",
    likes: ["Sunflower"],
    seasons: ["winter"],
  },
  Sunfish: {
    baits: ["Red Wiggler", "Fishing Lure"],
    type: "expert",
    likes: ["Anchovy"],
    seasons: ["summer", "autumn"],
  },
  Coelacanth: {
    baits: ["Red Wiggler", "Fishing Lure"],
    type: "expert",
    likes: ["Cabbage"],
    seasons: ["spring", "winter"],
  },
  Parrotfish: {
    baits: ["Red Wiggler", "Fishing Lure"],
    type: "expert",
    likes: ["Seaweed"],
    seasons: ["spring", "summer"],
  },
  "Whale Shark": {
    baits: ["Red Wiggler", "Fishing Lure"],
    type: "expert",
    likes: ["Crab", "Fat Chicken"],
    seasons: ["summer", "winter"],
  },
  "Saw Shark": {
    baits: ["Red Wiggler", "Fishing Lure"],
    type: "expert",
    likes: ["Red Snapper", "Speed Chicken"],
    seasons: ["spring", "summer"],
  },
  "White Shark": {
    baits: ["Red Wiggler", "Fishing Lure"],
    type: "expert",
    likes: ["Tuna", "Rich Chicken"],
    seasons: ["summer", "winter"],
  },
  Cobia: {
    baits: ["Red Wiggler"],
    type: "expert",
    likes: ["Broccoli"],
    seasons: ["summer"],
  },
  Trout: {
    baits: ["Red Wiggler"],
    type: "expert",
    likes: ["Pepper"],
    seasons: ["winter"],
  },
  Weakfish: {
    baits: ["Red Wiggler"],
    type: "expert",
    likes: ["Artichoke"],
    seasons: ["spring"],
  },

  // Marine Marvel
  "Twilight Anglerfish": {
    baits: ["Red Wiggler", "Grub", "Fishing Lure"],
    type: "marine marvel",
    likes: ["Sunfish"],
    seasons: ["winter", "spring", "summer", "autumn"],
  },
  "Starlight Tuna": {
    baits: ["Red Wiggler", "Fishing Lure"],
    type: "marine marvel",
    likes: ["Horse Mackerel", "Zebra Turkeyfish"],
    seasons: ["winter", "spring", "summer", "autumn"],
  },
  "Radiant Ray": {
    baits: ["Red Wiggler", "Fishing Lure"],
    type: "marine marvel",
    likes: ["Iron"],
    seasons: ["winter", "spring", "summer", "autumn"],
  },
  "Phantom Barracuda": {
    baits: ["Grub", "Fishing Lure"],
    type: "marine marvel",
    likes: ["Squid"],
    seasons: ["winter", "spring", "summer", "autumn"],
  },
  "Gilded Swordfish": {
    baits: ["Earthworm", "Red Wiggler", "Fishing Lure"],
    type: "marine marvel",
    likes: ["Gold"],
    seasons: ["winter", "spring", "summer", "autumn"],
  },

  ...CHAPTER_FISH,
};

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
  "Pink Dolphin": 5,
};

export function getDailyFishingCount(state: GameState): number {
  const today = new Date().toISOString().split("T")[0];
  return state.fishing.dailyAttempts?.[today] ?? 0;
}

export function getDailyFishingLimit(game: GameState): {
  limit: number;
  boostsUsed: BoostName[];
} {
  let limit = 20;
  const boostsUsed: BoostName[] = [];

  // +10 daily limit if player has Angler Waders
  if (isWearableActive({ name: "Angler Waders", game })) {
    limit += 10;
    boostsUsed.push("Angler Waders");
  }

  // +5 Daily Limit if the player has Reelmaster's Chair
  if (isCollectibleBuilt({ name: "Reelmaster's Chair", game })) {
    limit += 5;
    boostsUsed.push("Reelmaster's Chair");
  }

  // +5 daily limit if player had Fisherman's 5 Fold skill
  if (game.bumpkin?.skills["Fisherman's 5 Fold"]) {
    limit += 5;
    boostsUsed.push("Fisherman's 5 Fold");
  }

  // +10 daily limit if player had Fisherman's 10 Fold skill
  if (game.bumpkin?.skills["Fisherman's 10 Fold"]) {
    limit += 10;
    boostsUsed.push("Fisherman's 10 Fold");
  }

  // +10 daily limit if player has the More With Less skill
  if (game.bumpkin?.skills["More With Less"]) {
    limit += 15;
    boostsUsed.push("More With Less");
  }

  // +5 daily limit if player has Saw Fish
  if (isWearableActive({ name: "Saw Fish", game })) {
    limit += 5;
    boostsUsed.push("Saw Fish");
  }

  return { limit, boostsUsed };
}

export const BAIT: Record<FishingBait, true> = {
  Earthworm: true,
  Grub: true,
  "Red Wiggler": true,
  "Fishing Lure": true,
};
