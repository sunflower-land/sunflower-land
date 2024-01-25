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
    boost: translate("description.basic.scarecrow.boost"),
    sfl: new Decimal(0),
    ingredients: {
      Wood: new Decimal(2),
    },
  },
  "Scary Mike": {
    description: translate("description.scary.mike"),
    boost: translate("description.scary.mike.boost"),
    sfl: new Decimal(15),
    ingredients: {
      Wood: new Decimal(30),
      Carrot: new Decimal(50),
      Wheat: new Decimal(10),
      Parsnip: new Decimal(10),
    },
  },
  "Laurie the Chuckle Crow": {
    description: translate("description.laurie.chuckle.crow"),
    boost: translate("description.laurie.chuckle.crow.boost"),
    sfl: new Decimal(45),
    ingredients: {
      Wood: new Decimal(100),
      Radish: new Decimal(60),
      Kale: new Decimal(40),
      Wheat: new Decimal(20),
    },
  },
  Bale: {
    description: translate("description.bale"),
    boost: translate("description.bale.boost"),
    sfl: new Decimal(5),
    ingredients: {
      Egg: new Decimal(200),
      Wheat: new Decimal(200),
      Wood: new Decimal(100),
      Stone: new Decimal(30),
    },
  },
  "Immortal Pear": {
    description: translate("description.immortal.pear"),
    boost: translate("description.immortal.pear.boost"),
    ingredients: {
      Gold: new Decimal(5),
      Apple: new Decimal(10),
      Blueberry: new Decimal(10),
      Orange: new Decimal(10),
    },
  },
  "Treasure Map": {
    description: translate("description.treasure.map"),
    boost: translate("description.treasure.map.boost"),
    ingredients: {
      Gold: new Decimal(5),
      "Wooden Compass": new Decimal(2),
    },
  },
  ...(getCurrentSeason(date) === "Witches' Eve" && {
    Poppy: {
      description: translate("description.poppy"),
      boost: translate("description.poppy.boost"),
      ingredients: {
        Gold: new Decimal(5),
        "Crow Feather": new Decimal(250),
      },
      from: new Date("2023-08-01"),
      to: new Date("2023-09-01"),
    },
    Kernaldo: {
      description: translate("description.kernaldo"),
      boost: translate("description.kernaldo.boost"),
      sfl: SFLDiscount(state, new Decimal(50)),
      ingredients: {
        "Crow Feather": new Decimal(500),
      },
      from: new Date("2023-09-01"),
      to: new Date("2023-10-01"),
    },
    "Grain Grinder": {
      description: translate("description.grain.grinder"),
      boost: translate("description.grain.grinder.boost"),
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
      description: translate("description.nana"),
      boost: translate("description.nana.boost"),
      sfl: SFLDiscount(state, new Decimal(50)),
      ingredients: {
        "Mermaid Scale": new Decimal(350),
      },
      from: new Date("2023-11-01"),
      to: new Date("2023-12-01"),
    },
    "Soil Krabby": {
      description: translate("description.soil.krabby"),
      boost: translate("description.soil.krabby.boost"),
      sfl: SFLDiscount(state, new Decimal(65)),
      ingredients: {
        "Mermaid Scale": new Decimal(650),
      },
      from: new Date("2023-12-01"),
      to: new Date("2024-01-01"),
    },
    "Skill Shrimpy": {
      description: translate("description.skill.shrimpy"),
      boost: translate("description.skill.shrimpy.boost"),
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
    description: translate("description.iron.idol"),
    boost: translate("description.iron.idol.boost"),
    supply: 200,
    ingredients: {
      Gold: new Decimal(10),
      Starfish: new Decimal(40),
      Pearl: new Decimal(1),
    },
  },
  "Emerald Turtle": {
    description: translate("description.emerald.turtle"),
    boost: translate("description.emerald.turtle.boost"),
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
    description: translate("description.tin.turtle"),
    boost: translate("description.tin.turtle.boost"),
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
    description: translate("description.heart.of.davy.jones"),
    boost: translate("description.heart.of.davy.jones.boost"),
    supply: 1000,
    ingredients: {
      Gold: new Decimal(10),
      "Wooden Compass": new Decimal(6),
    },
  },
  Karkinos: {
    description: translate("description.Karkinos"),
    boost: translate("description.Karkinos.boost"),
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
    description: translate("description.parasaur.skull"),
    supply: 1000,
    ingredients: {
      "Emerald Compass": new Decimal(20),
      "Block Buck": new Decimal(1),
    },
  },
  "Golden Bear Head": {
    description: translate("description.golden.bear.head"),
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
      description: translate("description.mushroom.house"),
      // 50 Team supply + giveaways
      supply: 2000 + 50,
      sfl: SFLDiscount(state, new Decimal(50)),
      boost: translate("description.mushroom.house.boost"),
      ingredients: {
        "Wild Mushroom": new Decimal(50),
        Gold: new Decimal(10),
      },
      // only available when SEASONS["DAWN_BREAKER"] starts
      disabled: getCurrentSeason() !== "Dawn Breaker",
    },
    Maximus: {
      description: translate("description.maximus"),
      // 50 Team Supply + giveaways
      supply: 350 + 50,
      sfl: SFLDiscount(state, marketRate(20000)),
      boost: translate("description.maximus.boost"),
      ingredients: {
        Eggplant: new Decimal(100),
        "Dawn Breaker Ticket": new Decimal(3200),
      },
      disabled: getCurrentSeason() !== "Dawn Breaker",
    },
    Obie: {
      description: translate("description.obie"),
      // 100 Team Supply + Giveaways
      supply: 2500 + 100,
      sfl: SFLDiscount(state, marketRate(2000)),
      boost: translate("description.obie.boost"),
      ingredients: {
        Eggplant: new Decimal(150),
        "Dawn Breaker Ticket": new Decimal(1200),
      },
      disabled: getCurrentSeason() !== "Dawn Breaker",
    },
    "Purple Trail": {
      description: translate("description.purple.trail"),

      sfl: SFLDiscount(state, marketRate(800)),
      supply: 10000,
      boost: translate("description.purple.trail.boost"),
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
      description: translate("description.lab.grown.carrot"),
      sfl: new Decimal(0),
      ingredients: {
        "Potion Ticket": new Decimal(6000),
      },
    },
    "Lab Grown Radish": {
      name: "Lab Grown Radish",
      description: translate("description.lab.grown.radish"),
      sfl: new Decimal(0),
      ingredients: {
        "Potion Ticket": new Decimal(8000),
      },
    },
    "Lab Grown Pumpkin": {
      name: "Lab Grown Pumpkin",
      description: translate("description.lab.grow.pumpkin"),
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
    shortDescription: translate("description.sir.goldensnout.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
  },
  "Freya Fox": {
    shortDescription: translate("description.freya.fox.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Pumpkin.crop,
  },
  Poppy: {
    shortDescription: translate("description.poppy.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Corn.crop,
  },
  "Grain Grinder": {
    shortDescription: translate("description.grain.grinder.boost"),
    boostTypeIcon: powerup,
    labelType: "success",
  },
  Kernaldo: {
    shortDescription: translate("description.kernaldo.boost"),
    labelType: "success",
    boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    boostedItemIcon: CROP_LIFECYCLE.Corn.crop,
  },
  "Skill Shrimpy": {
    shortDescription: translate("description.skill.shrimpy.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.icons.fish,
  },
};
