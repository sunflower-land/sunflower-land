import { getKeys } from "./craftables";
import { CropName } from "./crops";
import { FruitName } from "./fruits";
import { translate } from "lib/i18n/translate";

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
type DaffodilName =
  | "Red Daffodil"
  | "Yellow Daffodil"
  | "Purple Daffodil"
  | "White Daffodil"
  | "Blue Daffodil";
type BalloonFlowerName =
  | "Red Balloon Flower"
  | "Yellow Balloon Flower"
  | "Purple Balloon Flower"
  | "White Balloon Flower"
  | "Blue Balloon Flower";
type LotusName =
  | "Red Lotus"
  | "Yellow Lotus"
  | "Purple Lotus"
  | "White Lotus"
  | "Blue Lotus";
type CarnationName =
  | "Red Carnation"
  | "Yellow Carnation"
  | "Purple Carnation"
  | "White Carnation"
  | "Blue Carnation";

type SunpetalFlowerName = PansyName | CosmosName | "Prism Petal";
type BloomFlowerName =
  | BalloonFlowerName
  | DaffodilName
  | "Celestial Frostbloom";
type LilyFlowerName = CarnationName | LotusName | "Primula Enigma";
export type EpicFlowerName =
  | "Prism Petal"
  | "Celestial Frostbloom"
  | "Primula Enigma";

export type FlowerSeed = {
  bumpkinLevel: number;
  price: number;
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
    price: 16,
    bumpkinLevel: 13,
    plantSeconds: 1 * 24 * 60 * 60,
    description: translate("description.sunpetal.seed"),
    disabled: false,
  },
  "Bloom Seed": {
    price: 32,
    bumpkinLevel: 22,
    plantSeconds: 2 * 24 * 60 * 60,
    description: translate("description.bloom.seed"),
    disabled: false,
  },
  "Lily Seed": {
    price: 48,
    bumpkinLevel: 27,
    plantSeconds: 5 * 24 * 60 * 60,
    description: translate("description.lily.seed"),
    disabled: false,
  },
});

// Some crops have been omitted to reserve cross breeds for future use
export type FlowerCrossBreedName =
  | Extract<
      CropName,
      | "Sunflower"
      | "Beetroot"
      | "Cauliflower"
      | "Radish"
      | "Parsnip"
      | "Kale"
      | "Eggplant"
    >
  | Extract<FruitName, "Blueberry" | "Banana" | "Apple">
  | FlowerName;

export const FLOWER_CROSS_BREED_AMOUNTS: Record<FlowerCrossBreedName, number> =
  {
    Sunflower: 50,
    // Potato: 20,
    // Pumpkin: 20,
    // Carrot: 10,
    // Cabbage: 10,
    Beetroot: 10,
    Cauliflower: 5,
    Parsnip: 5,
    Eggplant: 5,
    // Corn: 5,
    Radish: 5,
    // Wheat: 5,
    Kale: 5,
    Blueberry: 3,
    // Orange: 3,
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
    "Prism Petal": 1,
    "Red Balloon Flower": 1,
    "Yellow Balloon Flower": 1,
    "Purple Balloon Flower": 1,
    "White Balloon Flower": 1,
    "Blue Balloon Flower": 1,
    "Red Daffodil": 1,
    "Yellow Daffodil": 1,
    "Purple Daffodil": 1,
    "White Daffodil": 1,
    "Blue Daffodil": 1,
    "Celestial Frostbloom": 1,
    "Red Carnation": 1,
    "Yellow Carnation": 1,
    "Purple Carnation": 1,
    "White Carnation": 1,
    "Blue Carnation": 1,
    "Red Lotus": 1,
    "Yellow Lotus": 1,
    "Purple Lotus": 1,
    "White Lotus": 1,
    "Blue Lotus": 1,
    "Primula Enigma": 1,
  };

export const FLOWER_CROSS_BREED_DETAILS: Record<FlowerCrossBreedName, string> =
  {
    Sunflower: translate("flower.breed.sunflower"),
    Cauliflower: translate("flower.breed.cauliflower"),
    Beetroot: translate("flower.breed.beetroot"),
    Parsnip: translate("flower.breed.parsnip"),
    Eggplant: translate("flower.breed.eggplant"),
    Radish: translate("flower.breed.radish"),
    Kale: translate("flower.breed.kale"),
    Blueberry: translate("flower.breed.blueberry"),
    Apple: translate("flower.breed.apple"),
    Banana: translate("flower.breed.banana"),
    "Red Pansy": translate("flower.breed.redPansy"),
    "Yellow Pansy": translate("flower.breed.yellowPansy"),
    "Purple Pansy": translate("flower.breed.purplePansy"),
    "White Pansy": translate("flower.breed.whitePansy"),
    "Blue Pansy": translate("flower.breed.bluePansy"),
    "Red Cosmos": translate("flower.breed.redCosmos"),
    "Yellow Cosmos": translate("flower.breed.yellowCosmos"),
    "Purple Cosmos": translate("flower.breed.purpleCosmos"),
    "White Cosmos": translate("flower.breed.whiteCosmos"),
    "Blue Cosmos": translate("flower.breed.blueCosmos"),
    "Prism Petal": translate("flower.breed.prismPetal"),
    "Red Balloon Flower": translate("flower.breed.redBalloonFlower"),
    "Yellow Balloon Flower": translate("flower.breed.yellowBalloonFlower"),
    "Purple Balloon Flower": translate("flower.breed.purpleBalloonFlower"),
    "White Balloon Flower": translate("flower.breed.whiteBalloonFlower"),
    "Blue Balloon Flower": translate("flower.breed.blueBalloonFlower"),
    "Red Daffodil": translate("flower.breed.redDaffodil"),
    "Yellow Daffodil": translate("flower.breed.yellowDaffodil"),
    "Purple Daffodil": translate("flower.breed.purpleDaffodil"),
    "White Daffodil": translate("flower.breed.whiteDaffodil"),
    "Blue Daffodil": translate("flower.breed.blueDaffodil"),
    "Celestial Frostbloom": translate("flower.breed.celestialFrostbloom"),
    "Red Carnation": translate("flower.breed.redCarnation"),
    "Yellow Carnation": translate("flower.breed.yellowCarnation"),
    "Purple Carnation": translate("flower.breed.purpleCarnation"),
    "White Carnation": translate("flower.breed.whiteCarnation"),
    "Blue Carnation": translate("flower.breed.blueCarnation"),
    "Red Lotus": translate("flower.breed.redLotus"),
    "Yellow Lotus": translate("flower.breed.yellowLotus"),
    "Purple Lotus": translate("flower.breed.purpleLotus"),
    "White Lotus": translate("flower.breed.whiteLotus"),
    "Blue Lotus": translate("flower.breed.blueLotus"),
    "Primula Enigma": translate("flower.breed.primulaEnigma"),
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
    "Prism Petal": { seed: "Sunpetal Seed" },
  };
const BLOOM_FLOWERS: Record<BloomFlowerName, { seed: "Bloom Seed" }> = {
  "Red Balloon Flower": { seed: "Bloom Seed" },
  "Yellow Balloon Flower": { seed: "Bloom Seed" },
  "Purple Balloon Flower": { seed: "Bloom Seed" },
  "White Balloon Flower": { seed: "Bloom Seed" },
  "Blue Balloon Flower": { seed: "Bloom Seed" },
  "Red Daffodil": { seed: "Bloom Seed" },
  "Yellow Daffodil": { seed: "Bloom Seed" },
  "Purple Daffodil": { seed: "Bloom Seed" },
  "White Daffodil": { seed: "Bloom Seed" },
  "Blue Daffodil": { seed: "Bloom Seed" },
  "Celestial Frostbloom": { seed: "Bloom Seed" },
};
const LILY_FLOWERS: Record<LilyFlowerName, { seed: "Lily Seed" }> = {
  "Red Carnation": { seed: "Lily Seed" },
  "Yellow Carnation": { seed: "Lily Seed" },
  "Purple Carnation": { seed: "Lily Seed" },
  "White Carnation": { seed: "Lily Seed" },
  "Blue Carnation": { seed: "Lily Seed" },
  "Red Lotus": { seed: "Lily Seed" },
  "Yellow Lotus": { seed: "Lily Seed" },
  "Purple Lotus": { seed: "Lily Seed" },
  "White Lotus": { seed: "Lily Seed" },
  "Blue Lotus": { seed: "Lily Seed" },
  "Primula Enigma": { seed: "Lily Seed" },
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
  "Prism Petal": "prism_petal",
  "Red Balloon Flower": "red_balloon_flower",
  "Yellow Balloon Flower": "yellow_balloon_flower",
  "Purple Balloon Flower": "purple_balloon_flower",
  "White Balloon Flower": "white_balloon_flower",
  "Blue Balloon Flower": "blue_balloon_flower",
  "Red Daffodil": "red_daffodil",
  "Yellow Daffodil": "yellow_daffodil",
  "Purple Daffodil": "purple_daffodil",
  "White Daffodil": "white_daffodil",
  "Blue Daffodil": "blue_daffodil",
  "Celestial Frostbloom": "celestial_frostbloom",
  "Red Carnation": "red_carnation",
  "Yellow Carnation": "yellow_carnation",
  "Purple Carnation": "purple_carnation",
  "White Carnation": "white_carnation",
  "Blue Carnation": "blue_carnation",
  "Red Lotus": "red_lotus",
  "Yellow Lotus": "yellow_lotus",
  "Purple Lotus": "purple_lotus",
  "White Lotus": "white_lotus",
  "Blue Lotus": "blue_lotus",
  "Primula Enigma": "primula_enigma",
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
