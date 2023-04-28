import Decimal from "decimal.js-light";
import { Inventory } from "./game";
import { SEASONS } from "./seasons";

export type SeasonPassName = "Dawn Breaker Banner" | "Solar Flare Banner";

export type HeliosBlacksmithItem = "Immortal Pear" | "Treasure Map";

export type GoblinBlacksmithItemName =
  | "Lady Bug"
  | "Squirrel Monkey"
  | "Black Bearry"
  | "Maneki Neko"
  | "Heart Balloons"
  | "Flamingo"
  | "Blossom Tree"
  | "Palm Tree"
  | "Beach Ball"
  | "Cabbage Boy"
  | "Cabbage Girl"
  | "Collectible Bear"
  | "Pablo The Bunny"
  | "Easter Bush"
  | "Giant Carrot"
  | "Mushroom House";

export type GoblinPirateItemName =
  | "Iron Idol"
  | "Heart of Davy Jones"
  | "Karkinos";

export type CraftableCollectible = {
  ingredients: Inventory;
  description: string;
  boost?: string;
  sfl?: Decimal;
};

export const HELIOS_BLACKSMITH_ITEMS: Record<
  HeliosBlacksmithItem,
  CraftableCollectible
> = {
  "Immortal Pear": {
    description: "A long-lived pear that makes fruit trees last longer.",
    ingredients: {
      Gold: new Decimal(5),
      Apple: new Decimal(10),
      Blueberry: new Decimal(10),
      Orange: new Decimal(10),
    },
    boost: "+1 harvest",
  },
  "Treasure Map": {
    description: "X marks the spot!",
    ingredients: {
      Gold: new Decimal(5),
      "Wooden Compass": new Decimal(2),
    },
    boost: "+20% SFL on Treasure Bounty",
  },
};

export type GoblinBlacksmithCraftable = CraftableCollectible & {
  supply?: number;
  disabled?: boolean;
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
    ingredients: {
      Gold: new Decimal(10),
      Starfish: new Decimal(40),
      Pearl: new Decimal(1),
    },
    supply: 200,
    boost: "+1 Iron",
  },
  "Heart of Davy Jones": {
    description:
      "Whoever possesses it holds immense power over the seven seas, can dig for treasure without tiring",
    ingredients: {
      Gold: new Decimal(10),
      "Wooden Compass": new Decimal(6),
    },
    supply: 1000,
    boost: "Dig an extra 20 times per day",
  },
  Karkinos: {
    description:
      "Pinchy but kind, the crabby cabbage-boosting addition to your farm!",
    ingredients: {
      Crab: new Decimal(5),
      Cabbage: new Decimal(500),
      Gold: new Decimal(3),
      "Solar Flare Ticket": new Decimal(350),
    },
    supply: 7500,
    boost: "+0.1 Cabbage",
  },
};

export const GOBLIN_BLACKSMITH_ITEMS: Record<
  GoblinBlacksmithItemName,
  GoblinBlacksmithCraftable
> = {
  "Lady Bug": {
    description:
      "An incredible bug that feeds on aphids. Improves Apple quality.",
    ingredients: {
      Gold: new Decimal(25),
      Apple: new Decimal(100),
    },
    supply: 2535,
    boost: "+0.25 Apples",
  },
  "Squirrel Monkey": {
    description:
      "A natural orange predator. Orange Trees are scared when a Squirrel Monkey is around.",
    ingredients: {
      Gold: new Decimal(25),
      Orange: new Decimal(300),
    },
    supply: 1035,
    boost: "1/2 Orange Tree grow time",
  },
  "Black Bearry": {
    description:
      "His favorite treat - plump, juicy blueberries. Gobbles them up by the handful!",
    ingredients: {
      Gold: new Decimal(25),
      Blueberry: new Decimal(700),
    },
    supply: 535,
    boost: "+1 Blueberry",
  },
  "Maneki Neko": {
    description: "The beckoning cat. Pull its arm and good luck will come",
    ingredients: {
      Gold: new Decimal(1),
      "Red Envelope": new Decimal(50),
    },
    supply: 30000,
    disabled: true,
  },
  "Heart Balloons": {
    description: "Use them as decorations for romantic occasions.",
    ingredients: {
      "Love Letter": new Decimal(10),
    },
    supply: 20000,
  },
  Flamingo: {
    description:
      "Represents a symbol of love's beauty standing tall and confident.",
    ingredients: {
      "Love Letter": new Decimal(75),
    },
    supply: 3000,
  },
  "Blossom Tree": {
    description:
      "Its delicate petals symbolizes the beauty and fragility of love",
    ingredients: {
      "Love Letter": new Decimal(350),
      Wood: new Decimal(500),
    },
    supply: 250,
  },
  "Palm Tree": {
    description: "Tall, beachy, shady and chic, palm trees make waves sashay.",
    ingredients: {
      Wood: new Decimal(1000),
      Gold: new Decimal(10),
      "Solar Flare Ticket": new Decimal(300),
    },
    supply: 500,
  },
  "Beach Ball": {
    description: "Bouncy ball brings beachy vibes, blows boredom away.",
    ingredients: {
      Gold: new Decimal(3),
      "Solar Flare Ticket": new Decimal(50),
    },
    supply: 20000,
  },
  "Cabbage Boy": {
    description: "Don't wake the baby!",
    ingredients: {
      Cabbage: new Decimal(2000),
      Gold: new Decimal(15),
      "Solar Flare Ticket": new Decimal(750),
    },
    supply: 1050, // 1000 + 50 Goblin Treasury Supply
    boost: "+0.25 Cabbage",
  },
  "Cabbage Girl": {
    description: "Shhh it's sleeping",
    ingredients: {
      Cabbage: new Decimal(2000),
      Gold: new Decimal(25),
      "Solar Flare Ticket": new Decimal(1000),
    },
    supply: 365, // 360 + 5 Goblin Treasury Supply
    boost: "50% Faster Cabbages",
  },
  "Collectible Bear": {
    description: "A prized possession still in mint condition!",
    ingredients: {
      "Basic Bear": new Decimal(1),
      Gold: new Decimal(5),
      "Solar Flare Ticket": new Decimal(250),
    },
    supply: 750,
  },
  "Pablo The Bunny": {
    description: "The magical bunny that increases your carrot harvests",
    ingredients: {
      "Red Egg": new Decimal(12),
      "Blue Egg": new Decimal(12),
      "Green Egg": new Decimal(12),
      "Yellow Egg": new Decimal(12),
      Gold: new Decimal(5),
    },
    supply: 7500,
    boost: "+0.1 Carrot",
  },
  "Easter Bush": {
    description: "What is inside?",
    ingredients: {
      Gold: new Decimal(1),
      "Purple Egg": new Decimal(12),
      "Orange Egg": new Decimal(12),
      "Pink Egg": new Decimal(12),
    },
    supply: 20000,
  },
  "Giant Carrot": {
    description:
      "A giant carrot stood, casting fun shadows, as rabbits gazed in wonder.",
    ingredients: {
      Gold: new Decimal(5),
      Carrot: new Decimal(5000),
      "Red Egg": new Decimal(12),
      "Blue Egg": new Decimal(12),
      "Green Egg": new Decimal(12),
      "Yellow Egg": new Decimal(12),
    },
    supply: 500,
  },
  "Mushroom House": {
    description:
      "A whimsical, fungi-abode where the walls sprout with charm and even the furniture has a 'spore-tacular' flair!",
    ingredients: {
      "Wild Mushroom": new Decimal(90),
    },
    supply: 2000,
    sfl: new Decimal(30),
    boost: "+0.2 Wild Mushroom",
    // only available when SEASONS["DAWN_BREAKER"] starts
    disabled: SEASONS["Dawn Breaker"].startDate.getTime() > Date.now(),
  },
};

export type Purchasable = CraftableCollectible & {
  usd: number;
};

export const SEASON_PASS_ITEMS: Record<SeasonPassName, Purchasable> = {
  "Solar Flare Banner": {
    description: "?",
    ingredients: {},
    usd: 3.99,
  },
  "Dawn Breaker Banner": {
    description: "?",
    ingredients: {},
    boost: "?",
    usd: 3.99,
  },
};
