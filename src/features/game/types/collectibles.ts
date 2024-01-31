import Decimal from "decimal.js-light";
import { GameState, Inventory, InventoryItemName } from "./game";
import { getCurrentSeason } from "./seasons";
import { marketRate } from "../lib/halvening";
import { SFLDiscount } from "../lib/SFLDiscount";
import { BuffLabel } from ".";
import powerup from "assets/icons/level_up.png";
import lightning from "assets/icons/lightning.png";
import xp from "assets/icons/xp.png";
import crimstone from "assets/resources/crimstone.png";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { SUNNYSIDE } from "assets/sunnyside";

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
  | "Catch the Kraken Banner"
  | "Spring Blossom Banner";

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
  | "Kraken Head"
  | "Humming Bird"
  | "Queen Bee"
  | "Blossom Royale"
  | "Hungry Caterpillar";

export type MegaStoreCollectibleName =
  | "Flower Cart"
  | "Sunrise Bloom Rug"
  | "Flower Fox"
  | "Enchanted Rose"
  | "Capybara"
  | "Rainbow";

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
    description: "Choosy defender of your farm's VIP (Very Important Plants)",
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
  // Crop Boosts
  "Basic Scarecrow": {
    shortDescription:
      "-20% Basic Crop Growth Time: Sunflower, Potato and Pumpkin (AOE 3x3)",
    labelType: "success",
    boostTypeIcon: powerup,
  },
  "Scary Mike": {
    shortDescription:
      "+0.2 Medium Crop: Carrot, Cabbage, Beetroot, Cauliflower and Parsnip (AOE 3x3)",
    labelType: "success",
    boostTypeIcon: powerup,
  },
  "Laurie the Chuckle Crow": {
    shortDescription:
      "+0.2 Advanced Crop: Eggplant, Corn, Radish, Wheat, Kale (AOE 3x3)",
    labelType: "success",
    boostTypeIcon: powerup,
  },
  Nancy: {
    shortDescription: "-15% Crop Growth Time",
    labelType: "success",
    boostTypeIcon: powerup,
  },
  Scarecrow: {
    shortDescription: "-15% Crop Growth Time; +20% Crop Yield",
    labelType: "success",
    boostTypeIcon: powerup,
  },
  Kuebiko: {
    shortDescription: "-15% Crop Growth Time; +20% Crop Yield; Free Seeds",
    labelType: "success",
    boostTypeIcon: powerup,
  },
  Gnome: {
    shortDescription: "+10 Yield to Medium/Advanced Crops (AOE plot below)",
    labelType: "success",
    boostTypeIcon: powerup,
  },
  "Sir Goldensnout": {
    shortDescription: "+0.5 Crop (AOE 4x4)",
    labelType: "success",
    boostTypeIcon: powerup,
  },
  "Lunar Calendar": {
    shortDescription: "-10% Crop Growth Time",
    labelType: "success",
    boostTypeIcon: powerup,
  },
  "Victoria Sisters": {
    shortDescription: "+20% Pumpkin",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Pumpkin.crop,
  },
  "Freya Fox": {
    shortDescription: "+0.5 Pumpkin",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Pumpkin.crop,
  },
  "Easter Bunny": {
    shortDescription: "+20% Carrot",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Carrot.crop,
  },
  "Pablo The Bunny": {
    shortDescription: "+0.1 Carrot",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Carrot.crop,
  },
  "Cabbage Boy": {
    shortDescription: "+0.25 Cabbage (+0.5 with Cabbage Girl)",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Cabbage.crop,
  },
  "Cabbage Girl": {
    shortDescription: "-50% Cabbage Growth Time",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Cabbage.crop,
  },
  Karkinos: {
    shortDescription: "+0.1 Cabbage (Inactive with Cabbage Boy)",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Cabbage.crop,
  },
  "Golden Cauliflower": {
    shortDescription: "+100% Cauliflower",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Cauliflower.crop,
  },
  "Mysterious Parsnip": {
    shortDescription: "-50% Parsnip Growth Time",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Parsnip.crop,
  },
  "Purple Trail": {
    shortDescription: "+0.2 Eggplant",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Eggplant.crop,
  },
  Obie: {
    shortDescription: "-25% Eggplant Growth Time",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Eggplant.crop,
  },
  Maximus: {
    shortDescription: "+1 Eggplant",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Eggplant.crop,
  },
  Poppy: {
    shortDescription: "+0.1 Corn",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Corn.crop,
  },
  Kernaldo: {
    shortDescription: "-25% Corn Growth Time",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Corn.crop,
  },
  "Queen Cornelia": {
    shortDescription: "+1 Corn (AOE 3x4)",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Corn.crop,
  },
  Foliant: {
    shortDescription: "+0.2 Kale",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Kale.crop,
  },
  Hoot: {
    shortDescription: "+0.5 Wheat, Radish, Kale",
    labelType: "success",
    boostTypeIcon: powerup,
  },
  "Hungry Caterpillar": {
    shortDescription: "Free flower seeds",
    labelType: "success",
    boostTypeIcon: powerup,
  },

  // Fruit Boosts
  "Immortal Pear": {
    shortDescription: "+1 Max Fruit Harvest per seed",
    labelType: "success",
    boostTypeIcon: powerup,
  },
  "Black Bearry": {
    shortDescription: "+1 Blueberry",
    labelType: "success",
    boostTypeIcon: powerup,
  },
  "Squirrel Monkey": {
    shortDescription: "-50% Orange Growth Time",
    labelType: "success",
    boostTypeIcon: powerup,
  },
  "Lady Bug": {
    shortDescription: "+0.25 Apple",
    labelType: "success",
    boostTypeIcon: powerup,
  },
  "Banana Chicken": {
    shortDescription: "+0.1 Banana",
    labelType: "success",
    boostTypeIcon: powerup,
  },
  Nana: {
    shortDescription: "-10% Banana Growth Time",
    labelType: "success",
    boostTypeIcon: powerup,
  },

  // Mutant Crops
  "Carrot Sword": {
    shortDescription: "4x Chance of Mutant Crop",
    labelType: "success",
    boostTypeIcon: powerup,
  },
  "Stellar Sunflower": {
    shortDescription: "3% Chance of +10 Sunflower",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Sunflower.crop,
  },
  "Potent Potato": {
    shortDescription: "3% Chance of +10 Potato",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Potato.crop,
  },
  "Radical Radish": {
    shortDescription: "3% Chance of +10 Radish",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Radish.crop,
  },
  "Lab Grown Pumpkin": {
    shortDescription: "+0.3 Pumpkin",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Pumpkin.crop,
  },
  "Lab Grown Carrot": {
    shortDescription: "+0.2 Carrot",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Carrot.crop,
  },
  "Lab Grown Radish": {
    shortDescription: "+0.4 Radish",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Radish.crop,
  },

  // Animals
  "Fat Chicken": {
    shortDescription: "-0.1 Wheat to Feed Chickens",
    labelType: "success",
    boostTypeIcon: powerup,
  },
  "Rich Chicken": {
    shortDescription: "+0.1 Egg",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.resource.egg,
  },
  "Speed Chicken": {
    shortDescription: "-10% Egg Production Time",
    labelType: "success",
    boostTypeIcon: powerup,
  },
  "Ayam Cemani": {
    shortDescription: "+0.2 Egg",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.resource.egg,
  },
  "El Pollo Veloz": {
    shortDescription: "-4h Egg Production Time",
    labelType: "success",
    boostTypeIcon: powerup,
  },
  Rooster: {
    shortDescription: "2x Chance of Mutant Chicken",
    labelType: "success",
    boostTypeIcon: powerup,
  },
  "Undead Rooster": {
    shortDescription: "+0.1 Egg",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.resource.egg,
  },
  "Chicken Coop": {
    shortDescription: "+1 Egg Yield; +5 Chicken Limit per Hen House",
    labelType: "success",
    boostTypeIcon: powerup,
  },
  "Gold Egg": {
    shortDescription: "Feed Chickens without Wheat",
    labelType: "success",
    boostTypeIcon: powerup,
  },
  Bale: {
    shortDescription: "+0.2 Egg (AOE 4x4)",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.resource.egg,
  },

  // Resources
  "Woody the Beaver": {
    shortDescription: "+20% Wood",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.resource.wood,
  },
  "Apprentice Beaver": {
    shortDescription: "+20% Wood; -50% Tree Recovery Time",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.resource.wood,
  },
  "Foreman Beaver": {
    shortDescription:
      "+20% Wood; -50% Tree Recovery Time; Chop Trees without Axes",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.resource.wood,
  },
  "Wood Nymph Wendy": {
    shortDescription: "+0.2 Wood",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.resource.wood,
  },
  "Tiki Totem": {
    shortDescription: "+0.1 Wood",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.resource.wood,
  },
  "Tunnel Mole": {
    shortDescription: "+0.25 Stone",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.resource.stone,
  },
  "Rocky the Mole": {
    shortDescription: "+0.25 Iron",
    labelType: "success",
    boostTypeIcon: powerup,
  },
  Nugget: {
    shortDescription: "+0.25 Gold",
    labelType: "success",
    boostTypeIcon: powerup,
  },
  "Rock Golem": {
    shortDescription: "10% Chance of +2 Stone",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.resource.stone,
  },
  "Iron Idol": {
    shortDescription: "+1 Iron",
    labelType: "success",
    boostTypeIcon: powerup,
  },
  "Tin Turtle": {
    shortDescription: "+0.1 Stone (AOE 3x3)",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.resource.stone,
  },
  "Emerald Turtle": {
    shortDescription: "+0.5 Stone, Iron, Gold (AOE 3x3)",
    labelType: "success",
    boostTypeIcon: powerup,
  },
  "Mushroom House": {
    shortDescription: "+0.2 Wild Mushroom",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.resource.wild_mushroom,
  },

  // Fish
  "Skill Shrimpy": {
    shortDescription: "+20% Fish XP",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.icons.fish,
  },
  Walrus: {
    shortDescription: "+1 Fish",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.icons.fish,
  },
  Alba: {
    shortDescription: "10% Chance of +1 Fish",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.icons.fish,
  },

  // Other
  "Soil Krabby": {
    shortDescription: " -10% Composter Compost Time",
    labelType: "success",
    boostTypeIcon: powerup,
  },
  "Knowledge Crab": {
    shortDescription: "Double Sprout Mix Effect",
    labelType: "success",
    boostTypeIcon: powerup,
  },
  "Maneki Neko": {
    shortDescription: "1 Free Food per Day",
    labelType: "success",
    boostTypeIcon: powerup,
  },
  "Treasure Map": {
    shortDescription: "+20% SFL Bounty Sales",
    labelType: "success",
    boostTypeIcon: powerup,
  },
  "Heart of Davy Jones": {
    shortDescription: "+20 Daily Digging Limit",
    labelType: "success",
    boostTypeIcon: powerup,
  },
  "Genie Lamp": {
    shortDescription: "Grants 3 Wishes",
    labelType: "success",
    boostTypeIcon: powerup,
  },
  "Grain Grinder": {
    shortDescription: "+20% Cake XP",
    labelType: "success",
    boostTypeIcon: powerup,
  },
  "Christmas Tree": {
    shortDescription: "Free Gift at Christmas",
    labelType: "success",
    boostTypeIcon: powerup,
  },
  "Festive Tree": {
    shortDescription: "Free Gift at Christmas",
    labelType: "success",
    boostTypeIcon: powerup,
  },
  "Grinx's Hammer": {
    shortDescription: "Halves expansion costs",
    labelType: "success",
    boostTypeIcon: powerup,
  },
  "Time Warp Totem": {
    shortDescription: "50% Reduction to Crop, Mineral, Cooking and Tree Time",
    labelType: "success",
    boostTypeIcon: powerup,
  },

  // Marine Marvels with Boosts
  "Radiant Ray": {
    shortDescription: "+0.1 Iron",
    labelType: "success",
    boostTypeIcon: powerup,
  },
  "Gilded Swordfish": {
    shortDescription: "+0.1 Gold",
    labelType: "success",
    boostTypeIcon: powerup,
  },
  "Crimson Carp": {
    labelType: "success",
    shortDescription: "+0.05 Crimstone",
    boostTypeIcon: powerup,
    boostedItemIcon: crimstone,
  },
  Blossombeard: {
    labelType: "vibrant",
    shortDescription: "+10% XP to food",
    boostTypeIcon: lightning,
    boostedItemIcon: xp,
  },
};
