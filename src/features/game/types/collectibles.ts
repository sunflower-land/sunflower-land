import Decimal from "decimal.js-light";
import { GameState, Inventory, InventoryItemName } from "./game";
import { getCurrentSeason } from "./seasons";
import { marketRate } from "../lib/halvening";
import { SFLDiscount } from "../lib/SFLDiscount";
import { BuffLabel } from ".";
import powerup from "assets/icons/level_up.png";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { SUNNYSIDE } from "assets/sunnyside";
import { translate } from "lib/i18n/translate";

export type CollectibleLocation = "farm" | "home";

export type SeasonPassName =
  | "Dawn Breaker Banner"
  | "Solar Flare Banner"
  | "Witches' Eve Banner"
  | "Catch the Kraken Banner";

export type PurchasableItems =
  | "Dawn Breaker Banner"
  | "Solar Flare Banner"
  | "Gold Pass"
  | "Witches' Eve Banner"
  | "Catch the Kraken Banner";

export type HeliosBlacksmithItem =
  | "Immortal Pear"
  | "Treasure Map"
  | "Basic Scarecrow"
  | "Bale"
  | "Scary Mike"
  | "Laurie the Chuckle Crow"
  | "Poppy"
  | "Kernaldo"
  | "Grain Grinder"
  | "Skill Shrimpy"
  | "Soil Krabby"
  | "Nana";

export type SoldOutCollectibleName =
  | "Sir Goldensnout"
  | "Beta Bear"
  | "Peeled Potato"
  | "Christmas Snow Globe"
  | "Wood Nymph Wendy"
  | "Cyborg Bear"
  | "Palm Tree"
  | "Beach Ball"
  | "Cabbage Boy"
  | "Cabbage Girl"
  | "Heart Balloons"
  | "Flamingo"
  | "Blossom Tree"
  | "Collectible Bear"
  | "Pablo The Bunny"
  | "Easter Bush"
  | "Giant Carrot"
  | "Maneki Neko"
  | "Squirrel Monkey"
  | "Black Bearry"
  | "Hoot"
  | "Lady Bug"
  | "Freya Fox"
  | "Queen Cornelia"
  | "White Crow"
  | "Walrus"
  | "Alba"
  | "Knowledge Crab"
  | "Anchor"
  | "Rubber Ducky"
  | "Kraken Head";

export type GoblinBlacksmithItemName =
  | "Purple Trail"
  | "Obie"
  | "Mushroom House"
  | "Maximus";

export type GoblinPirateItemName =
  | "Iron Idol"
  | "Heart of Davy Jones"
  | "Karkinos"
  | "Emerald Turtle"
  | "Tin Turtle"
  | "Parasaur Skull"
  | "Golden Bear Head";

export type PotionHouseItemName =
  | "Lab Grown Carrot"
  | "Lab Grown Radish"
  | "Lab Grown Pumpkin";

export type CraftableCollectible = {
  ingredients: Inventory;
  description: string;
  boost?: string;
  sfl?: Decimal;
  from?: Date;
  to?: Date;
};

export const HELIOS_BLACKSMITH_ITEMS: (
  game?: GameState,
  date?: Date
) => Partial<Record<HeliosBlacksmithItem, CraftableCollectible>> = (
  state,
  date = new Date()
) => ({
  "Basic Scarecrow": {
    description: translate("description.basic.scarecrow"),
    boost: "20% faster Sunflowers, Potatoes and Pumpkins",
    sfl: new Decimal(0),
    ingredients: {
      Wood: new Decimal(2),
    },
  },
  "Scary Mike": {
    description:
      "The veggie whisperer and champion of frightfully good harvests!",
    boost:
      "+0.2 yield on Carrots, Cabbages, Beetroots, Cauliflowers and Parsnips",
    sfl: new Decimal(15),
    ingredients: {
      Wood: new Decimal(30),
      Carrot: new Decimal(50),
      Wheat: new Decimal(10),
      Parsnip: new Decimal(10),
    },
  },
  "Laurie the Chuckle Crow": {
    description:
      "With her disconcerting chuckle, she shooes peckers away from your crops!",
    boost: "+0.2 yield on Eggplants, Corn, Radishes, Wheat and Kale",
    sfl: new Decimal(45),
    ingredients: {
      Wood: new Decimal(100),
      Radish: new Decimal(60),
      Kale: new Decimal(40),
      Wheat: new Decimal(20),
    },
  },
  Bale: {
    description:
      "A poultry's favorite neighbor, providing a cozy retreat for chickens",
    boost: "Adjacent chickens produce +0.2 Eggs",
    sfl: new Decimal(5),
    ingredients: {
      Egg: new Decimal(200),
      Wheat: new Decimal(200),
      Wood: new Decimal(100),
      Stone: new Decimal(30),
    },
  },
  "Immortal Pear": {
    description: "A long-lived pear that makes fruit trees last longer.",
    boost: "+1 Harvest",
    ingredients: {
      Gold: new Decimal(5),
      Apple: new Decimal(10),
      Blueberry: new Decimal(10),
      Orange: new Decimal(10),
    },
  },
  "Treasure Map": {
    description: "X marks the spot!",
    boost: "+20% SFL on Treasure Bounty",
    ingredients: {
      Gold: new Decimal(5),
      "Wooden Compass": new Decimal(2),
    },
  },
  ...(getCurrentSeason(date) === "Witches' Eve" && {
    Poppy: {
      description: "The mystical corn kernel.",
      boost: "+0.1 Corn",
      ingredients: {
        Gold: new Decimal(5),
        "Crow Feather": new Decimal(250),
      },
      from: new Date("2023-08-01"),
      to: new Date("2023-09-01"),
    },
    Kernaldo: {
      description: "The magical corn whisperer.",
      boost: "+25% Corn Speed",
      sfl: SFLDiscount(state, new Decimal(50)),
      ingredients: {
        "Crow Feather": new Decimal(500),
      },
      from: new Date("2023-09-01"),
      to: new Date("2023-10-01"),
    },
    "Grain Grinder": {
      description:
        "Grind your grain and experience a delectable surge in Cake XP.",
      boost: "+20% Cake XP",
      sfl: SFLDiscount(state, new Decimal(100)),
      ingredients: {
        "Crow Feather": new Decimal(750),
      },
      from: new Date("2023-10-01"),
      to: new Date("2023-11-01"),
    },
  }),
  ...(getCurrentSeason(date) === "Catch the Kraken" && {
    Nana: {
      description:
        "This rare beauty is a surefire way to boost your banana harvests.",
      boost: "+10% Banana Speed",
      sfl: SFLDiscount(state, new Decimal(50)),
      ingredients: {
        "Mermaid Scale": new Decimal(350),
      },
      from: new Date("2023-11-01"),
      to: new Date("2023-12-01"),
    },
    "Soil Krabby": {
      description:
        "Speedy sifting with a smile! Enjoy a 10% composter speed boost with this crustaceous champ.",
      boost: "+10% Composter Speed",
      sfl: SFLDiscount(state, new Decimal(65)),
      ingredients: {
        "Mermaid Scale": new Decimal(650),
      },
      from: new Date("2023-12-01"),
      to: new Date("2024-01-01"),
    },
    "Skill Shrimpy": {
      description:
        "Shrimpy's here to help! He'll ensure you get that extra XP from fish.",
      boost: "+20% Fish XP",
      sfl: SFLDiscount(state, new Decimal(115)),
      ingredients: {
        "Mermaid Scale": new Decimal(865),
      },
      from: new Date("2024-01-01"),
      to: new Date("2024-02-01"),
    },
  }),
});

export type GoblinBlacksmithCraftable = CraftableCollectible & {
  supply?: number;
  disabled?: boolean;
  sfl?: Decimal;
};

export type GoblinPirateCraftable = CraftableCollectible & {
  supply: number;
  disabled?: boolean;
};

export const GOBLIN_PIRATE_ITEMS: Record<
  GoblinPirateItemName,
  GoblinPirateCraftable
> = {
  "Iron Idol": {
    description: "The Idol adds 1 iron every time you mine iron.",
    boost: "+1 Iron",
    supply: 200,
    ingredients: {
      Gold: new Decimal(10),
      Starfish: new Decimal(40),
      Pearl: new Decimal(1),
    },
  },
  "Emerald Turtle": {
    description:
      "The Emerald Turtle gives +0.5 to any minerals you mine within its Area of Effect.",
    boost: "+0.5 AoE Any Minerals",
    sfl: new Decimal(100),
    supply: 100,
    ingredients: {
      "Iron Compass": new Decimal(30),
      "Old Bottle": new Decimal(80),
      Seaweed: new Decimal(50),
      "Block Buck": new Decimal(1),
    },
  },
  "Tin Turtle": {
    description:
      "The Tin Turtle gives +0.1 to Stones you mine within its Area of Effect.",
    boost: "+0.1 AoE Stones",
    sfl: new Decimal(40),
    supply: 3000,
    ingredients: {
      "Iron Compass": new Decimal(15),
      "Old Bottle": new Decimal(50),
      Seaweed: new Decimal(25),
      "Block Buck": new Decimal(1),
    },
  },
  "Heart of Davy Jones": {
    description:
      "Whoever possesses it holds immense power over the seven seas, can dig for treasure without tiring",
    boost: "Dig an extra 20 times per day",
    supply: 1000,
    ingredients: {
      Gold: new Decimal(10),
      "Wooden Compass": new Decimal(6),
    },
  },
  Karkinos: {
    description:
      "Pinchy but kind, the crabby cabbage-boosting addition to your farm!",
    boost: "+0.1 Cabbage",
    supply: 7500,
    ingredients: {
      Crab: new Decimal(5),
      Cabbage: new Decimal(500),
      Gold: new Decimal(3),
      "Solar Flare Ticket": new Decimal(350),
    },
    disabled: true,
  },
  "Parasaur Skull": {
    description: "A skull from a parasaur!",
    supply: 1000,
    ingredients: {
      "Emerald Compass": new Decimal(20),
      "Block Buck": new Decimal(1),
    },
  },
  "Golden Bear Head": {
    description: "Spooky, but cool.",
    supply: 200,
    ingredients: {
      "Emerald Compass": new Decimal(60),
      "Block Buck": new Decimal(1),
    },
  },
};

export const GOBLIN_BLACKSMITH_ITEMS: (
  state?: GameState
) => Record<GoblinBlacksmithItemName, GoblinBlacksmithCraftable> = (state) => {
  return {
    "Mushroom House": {
      description:
        "A whimsical, fungi-abode where the walls sprout with charm and even the furniture has a 'spore-tacular' flair!",
      // 50 Team supply + giveaways
      supply: 2000 + 50,
      sfl: SFLDiscount(state, new Decimal(50)),
      boost: "+0.2 Wild Mushroom",
      ingredients: {
        "Wild Mushroom": new Decimal(50),
        Gold: new Decimal(10),
      },
      // only available when SEASONS["DAWN_BREAKER"] starts
      disabled: getCurrentSeason() !== "Dawn Breaker",
    },
    Maximus: {
      description: "Squash the competition with plump Maximus",
      // 50 Team Supply + giveaways
      supply: 350 + 50,
      sfl: SFLDiscount(state, marketRate(20000)),
      boost: "+1 Eggplant",
      ingredients: {
        Eggplant: new Decimal(100),
        "Dawn Breaker Ticket": new Decimal(3200),
      },
      disabled: getCurrentSeason() !== "Dawn Breaker",
    },
    Obie: {
      description: "A fierce eggplant soldier",
      // 100 Team Supply + Giveaways
      supply: 2500 + 100,
      sfl: SFLDiscount(state, marketRate(2000)),
      boost: "25% faster eggplants",
      ingredients: {
        Eggplant: new Decimal(150),
        "Dawn Breaker Ticket": new Decimal(1200),
      },
      disabled: getCurrentSeason() !== "Dawn Breaker",
    },
    "Purple Trail": {
      description:
        "Leave your opponents in a trail of envy with the mesmerizing and unique Purple Trail",

      sfl: SFLDiscount(state, marketRate(800)),
      supply: 10000,
      boost: "+0.2 Eggplant",
      ingredients: {
        Eggplant: new Decimal(25),
        "Dawn Breaker Ticket": new Decimal(500),
      },
      disabled: getCurrentSeason() !== "Dawn Breaker",
    },
  };
};

export type PotionHouseItem = CraftableCollectible & {
  name: PotionHouseItemName;
};

export const POTION_HOUSE_ITEMS: Record<PotionHouseItemName, PotionHouseItem> =
  {
    "Lab Grown Carrot": {
      name: "Lab Grown Carrot",
      description: "+0.2 Carrot Yield",
      sfl: new Decimal(0),
      ingredients: {
        "Potion Ticket": new Decimal(6000),
      },
    },
    "Lab Grown Radish": {
      name: "Lab Grown Radish",
      description: "+0.4 Radish Yield",
      sfl: new Decimal(0),
      ingredients: {
        "Potion Ticket": new Decimal(8000),
      },
    },
    "Lab Grown Pumpkin": {
      name: "Lab Grown Pumpkin",
      description: "+0.3 Pumpkin Yield",
      sfl: new Decimal(0),
      ingredients: {
        "Potion Ticket": new Decimal(7000),
      },
    },
  };

export type Purchasable = CraftableCollectible & {
  usd: number;
};

// TODO - add all other boosts
export const COLLECTIBLE_BUFF_LABELS: Partial<
  Record<InventoryItemName, BuffLabel>
> = {
  "Sir Goldensnout": {
    shortDescription: "+0.5 Crops (AOE)",
    labelType: "success",
    boostTypeIcon: powerup,
  },
  "Freya Fox": {
    shortDescription: "+0.5 Pumpkin",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Pumpkin.crop,
  },
  Poppy: {
    shortDescription: "+0.1 Corn",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Corn.crop,
  },
  "Grain Grinder": {
    shortDescription: "+20% Cake XP",
    boostTypeIcon: powerup,
    labelType: "success",
  },
  Kernaldo: {
    shortDescription: "+25% Corn Growth Speed",
    labelType: "success",
    boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    boostedItemIcon: CROP_LIFECYCLE.Corn.crop,
  },
  "Skill Shrimpy": {
    shortDescription: "+20% Fish XP",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.icons.fish,
  },
};
