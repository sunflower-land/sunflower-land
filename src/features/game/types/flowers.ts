import Decimal from "decimal.js-light";
import { getKeys } from "./craftables";
import { CropName } from "./crops";
import { FruitName } from "./fruits";

type PansyName =
  | "Red Pansy"
  | "Yellow Pansy"
  | "Purple Pansy"
  | "White Pansy"
  | "Blue Pansy";
type CosmosName =
  | "Red Cosmos"
  | "Yellow Cosmos"
  | "Purple Cosmos"
  | "White Cosmos"
  | "Blue Cosmos";
// type DaffodilName =
//   | "Red Daffodil"
//   | "Yellow Daffodil"
//   | "Purple Daffodil"
//   | "White Daffodil"
//   | "Blue Cosmos";
type BalloonFlowerName =
  | "Red Balloon Flower"
  | "Yellow Balloon Flower"
  | "Purple Balloon Flower"
  | "White Balloon Flower"
  | "Blue Balloon Flower";
// type LotusName =
//   | "Red Lotus"
//   | "Yellow Lotus"
//   | "Purple Lotus"
//   | "White Lotus"
//   | "Blue Lotus";
type CarnationName =
  | "Red Carnation"
  | "Yellow Carnation"
  | "Purple Carnation"
  | "White Carnation"
  | "Blue Carnation";
type SunpetalFlowerName = PansyName | CosmosName | "Prism Petal";
type BloomFlowerName = BalloonFlowerName | "Celestial Frostbloom";
type LilyFlowerName = CarnationName | "Primula Enigma";
export type EpicFlowerName =
  | "Prism Petal"
  | "Celestial Frostbloom"
  | "Primula Enigma";

export type FlowerSeed = {
  price: Decimal;
  bumpkinLevel: number;
  sfl: Decimal;
  description: string;
  plantSeconds: number;
  disabled: boolean;
};

type FlowerSeeds = {
  "Sunpetal Seed": FlowerSeed;
  "Bloom Seed": FlowerSeed;
  "Lily Seed": FlowerSeed;
};

export type FlowerName = SunpetalFlowerName | BloomFlowerName | LilyFlowerName;

export type FlowerSeedName = keyof FlowerSeeds;

export function isFlowerSeed(seed: FlowerSeedName) {
  return getKeys(FLOWER_SEEDS()).includes(seed);
}

export const FLOWER_SEEDS: () => Record<FlowerSeedName, FlowerSeed> = () => ({
  "Sunpetal Seed": {
    price: new Decimal(0),
    bumpkinLevel: 0,
    sfl: new Decimal(0),
    description: "A sunpetal seed",
    plantSeconds: 40,
    disabled: false,
  },
  "Bloom Seed": {
    price: new Decimal(0),
    bumpkinLevel: 0,
    sfl: new Decimal(0),
    description: "A bloom seed",
    plantSeconds: 50,
    disabled: false,
  },
  "Lily Seed": {
    price: new Decimal(0),
    bumpkinLevel: 0,
    sfl: new Decimal(0),
    description: "A lily seed",
    plantSeconds: 60,
    disabled: false,
  },
});

export type FlowerCrossBreedName = CropName | FruitName | FlowerName;

export const FLOWER_CROSS_BREED_AMOUNTS: Record<FlowerCrossBreedName, number> =
  {
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
    Blueberry: 3,
    Orange: 3,
    Apple: 3,
    Banana: 3,
    "Red Pansy": 1,
    "Yellow Pansy": 1,
    "Purple Pansy": 1,
    "White Pansy": 1,
    "Blue Pansy": 1,
    "Red Cosmos": 1,
    "Yellow Cosmos": 1,
    "Purple Cosmos": 1,
    "White Cosmos": 1,
    "Blue Cosmos": 1,
    "Red Balloon Flower": 1,
    "Yellow Balloon Flower": 1,
    "Purple Balloon Flower": 1,
    "White Balloon Flower": 1,
    "Blue Balloon Flower": 1,
    "Red Carnation": 1,
    "Yellow Carnation": 1,
    "Purple Carnation": 1,
    "White Carnation": 1,
    "Blue Carnation": 1,
  };

export const FLOWER_CROSS_BREED_DETAILS: Record<FlowerCrossBreedName, string> =
  {
    Sunflower: "Bumpkin Botanists swear they're not flowers.",
    Cauliflower: "Not so sure what the Bumpkin Botanists say about this one.",
    Potato: "Potatoes are not flowers.",
    Pumpkin: "",
    Carrot: "",
    Cabbage: "",
    Beetroot: "",
    Parsnip: "",
    Eggplant: "",
    Corn: "",
    Radish: "",
    Wheat: "",
    Kale: "",
    Blueberry: "",
    Orange: "",
    Apple: "",
    Banana: "",
    "Red Pansy": "",
    "Yellow Pansy": "",
    "Purple Pansy": "",
    "White Pansy": "",
    "Blue Pansy": "",
    "Red Cosmos": "",
    "Yellow Cosmos": "",
    "Purple Cosmos": "",
    "White Cosmos": "",
    "Blue Cosmos": "",
    "Red Balloon Flower": "",
    "Yellow Balloon Flower": "",
    "Purple Balloon Flower": "",
    "White Balloon Flower": "",
    "Blue Balloon Flower": "",
    "Red Carnation": "",
    "Yellow Carnation": "",
    "Purple Carnation": "",
    "White Carnation": "",
    "Blue Carnation": "",
  };

type Flower = {
  seed: FlowerSeedName;
};

const SUNPETAL_FLOWERS: Record<SunpetalFlowerName, { seed: "Sunpetal Seed" }> =
  {
    "Red Pansy": { seed: "Sunpetal Seed" },
    "Yellow Pansy": { seed: "Sunpetal Seed" },
    "Purple Pansy": { seed: "Sunpetal Seed" },
    "White Pansy": { seed: "Sunpetal Seed" },
    "Blue Pansy": { seed: "Sunpetal Seed" },
    "Red Cosmos": { seed: "Sunpetal Seed" },
    "Yellow Cosmos": { seed: "Sunpetal Seed" },
    "Purple Cosmos": { seed: "Sunpetal Seed" },
    "White Cosmos": { seed: "Sunpetal Seed" },
    "Blue Cosmos": { seed: "Sunpetal Seed" },
  };
const BLOOM_FLOWERS: Record<BloomFlowerName, { seed: "Bloom Seed" }> = {
  "Red Balloon Flower": { seed: "Bloom Seed" },
  "Yellow Balloon Flower": { seed: "Bloom Seed" },
  "Purple Balloon Flower": { seed: "Bloom Seed" },
  "White Balloon Flower": { seed: "Bloom Seed" },
  "Blue Balloon Flower": { seed: "Bloom Seed" },
};
const LILY_FLOWERS: Record<LilyFlowerName, { seed: "Lily Seed" }> = {
  "Red Carnation": { seed: "Lily Seed" },
  "Yellow Carnation": { seed: "Lily Seed" },
  "Purple Carnation": { seed: "Lily Seed" },
  "White Carnation": { seed: "Lily Seed" },
  "Blue Carnation": { seed: "Lily Seed" },
};

export const FLOWERS: Record<FlowerName, Flower> = {
  ...SUNPETAL_FLOWERS,
  ...BLOOM_FLOWERS,
  ...LILY_FLOWERS,
};

type Lifecycle = {
  seedling: any;
  sprout: any;
  halfway: any;
  almost: any;
  ready: any;
};

const IMAGES: Record<FlowerName, string> = {
  "Red Pansy": "red_pansy",
  "Yellow Pansy": "yellow_pansy",
  "Purple Pansy": "purple_pansy",
  "White Pansy": "white_pansy",
  "Blue Pansy": "blue_pansy",
  "Red Cosmos": "red_cosmos",
  "Yellow Cosmos": "yellow_cosmos",
  "Purple Cosmos": "purple_cosmos",
  "White Cosmos": "white_cosmos",
  "Blue Cosmos": "blue_cosmos",
  "Red Balloon Flower": "red_balloon_flower",
  "Yellow Balloon Flower": "yellow_balloon_flower",
  "Purple Balloon Flower": "purple_balloon_flower",
  "White Balloon Flower": "white_balloon_flower",
  "Blue Balloon Flower": "blue_balloon_flower",
  "Red Carnation": "red_carnation",
  "Yellow Carnation": "yellow_carnation",
  "Purple Carnation": "purple_carnation",
  "White Carnation": "white_carnation",
  "Blue Carnation": "blue_carnation",
};

export const FLOWER_LIFECYCLE: Record<FlowerName, Lifecycle> = getKeys(
  IMAGES
).reduce(
  (acc, name) => ({
    ...acc,
    [name]: {
      seedling: `flowers/seedling.webp`,
      sprout: `flowers/sprout.webp`,
      halfway: `flowers/halfway.webp`,
      almost: `flowers/${IMAGES[name]}_growing.webp`,
      ready: `flowers/${IMAGES[name]}_ready.webp`,
    },
  }),
  {} as Record<FlowerName, Lifecycle>
);
