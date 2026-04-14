import { CropName } from "./crops";
import { PatchFruitName } from "./fruits";
import { translate } from "lib/i18n/translate";
import { ResourceName } from "./resources";
import { SeedName } from "./seeds";

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
type EdelweissFlowerName =
  | "Red Edelweiss"
  | "Yellow Edelweiss"
  | "Purple Edelweiss"
  | "White Edelweiss"
  | "Blue Edelweiss";
type GladiolusFlowerName =
  | "Red Gladiolus"
  | "Yellow Gladiolus"
  | "Purple Gladiolus"
  | "White Gladiolus"
  | "Blue Gladiolus";
type LavenderFlowerName =
  | "Red Lavender"
  | "Yellow Lavender"
  | "Purple Lavender"
  | "White Lavender"
  | "Blue Lavender";
type CloverFlowerName =
  | "Red Clover"
  | "Yellow Clover"
  | "Purple Clover"
  | "White Clover"
  | "Blue Clover";

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
  plantingSpot: ResourceName | "Greenhouse";
};

type FlowerSeeds = {
  "Sunpetal Seed": FlowerSeed;
  "Bloom Seed": FlowerSeed;
  "Lily Seed": FlowerSeed;
  "Edelweiss Seed": FlowerSeed;
  "Gladiolus Seed": FlowerSeed;
  "Lavender Seed": FlowerSeed;
  "Clover Seed": FlowerSeed;
};

export type Set1FlowerName =
  | SunpetalFlowerName
  | BloomFlowerName
  | LilyFlowerName;
export type Set2FlowerName =
  | EdelweissFlowerName
  | GladiolusFlowerName
  | LavenderFlowerName
  | CloverFlowerName;

export type FlowerName = Set1FlowerName | Set2FlowerName;

export type FlowerSeedName = keyof FlowerSeeds;

export function isFlowerSeed(seed: SeedName): seed is FlowerSeedName {
  return seed in FLOWER_SEEDS;
}

export const FLOWER_SEEDS: Record<FlowerSeedName, FlowerSeed> = {
  "Sunpetal Seed": {
    price: 16,
    bumpkinLevel: 13,
    plantSeconds: 1 * 24 * 60 * 60,
    description: translate("description.sunpetal.seed"),
    disabled: false,
    plantingSpot: "Flower Bed",
  },
  "Bloom Seed": {
    price: 32,
    bumpkinLevel: 22,
    plantSeconds: 2 * 24 * 60 * 60,
    description: translate("description.bloom.seed"),
    disabled: false,
    plantingSpot: "Flower Bed",
  },
  "Lily Seed": {
    price: 48,
    bumpkinLevel: 27,
    plantSeconds: 5 * 24 * 60 * 60,
    description: translate("description.lily.seed"),
    disabled: false,
    plantingSpot: "Flower Bed",
  },
  "Edelweiss Seed": {
    price: 96,
    bumpkinLevel: 35,
    plantSeconds: 3 * 24 * 60 * 60,
    plantingSpot: "Flower Bed",
    disabled: false,
    description: translate("description.edelweiss.seed"),
  },
  "Gladiolus Seed": {
    price: 96,
    bumpkinLevel: 35,
    plantSeconds: 3 * 24 * 60 * 60,
    plantingSpot: "Flower Bed",
    disabled: false,
    description: translate("description.gladiolus.seed"),
  },
  "Lavender Seed": {
    price: 96,
    bumpkinLevel: 35,
    plantSeconds: 3 * 24 * 60 * 60,
    plantingSpot: "Flower Bed",
    disabled: false,
    description: translate("description.lavender.seed"),
  },
  "Clover Seed": {
    price: 96,
    bumpkinLevel: 35,
    plantSeconds: 3 * 24 * 60 * 60,
    plantingSpot: "Flower Bed",
    disabled: false,
    description: translate("description.clover.seed"),
  },
};

// Some crops have been omitted to reserve cross breeds for future use
export type Set1FlowerCrossBreedName =
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
  | Extract<PatchFruitName, "Blueberry" | "Banana" | "Apple">
  | Set1FlowerName;

export type Set2FlowerCrossBreedName =
  | Extract<CropName, "Rhubarb" | "Pepper" | "Artichoke" | "Onion" | "Barley">
  | Set2FlowerName;

export type FlowerCrossBreedName =
  | Set1FlowerCrossBreedName
  | Set2FlowerCrossBreedName;

export const SET_1_FLOWER_CROSS_BREED_AMOUNTS: Record<
  Set1FlowerCrossBreedName,
  number
> = {
  Sunflower: 50,
  // Potato: 20,
  // Pumpkin: 20,
  // Carrot: 10,
  // Cabbage: 10,
  Beetroot: 10,
  Cauliflower: 5,
  Parsnip: 5,
  Eggplant: 5,
  Radish: 5,
  // Corn: 5,
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

export const SET_2_FLOWER_CROSS_BREED_AMOUNTS: Record<
  Set2FlowerCrossBreedName,
  number
> = {
  Rhubarb: 25,
  Pepper: 15,
  Onion: 10,
  Artichoke: 8,
  Barley: 5,

  "Red Edelweiss": 1,
  "Yellow Edelweiss": 1,
  "Purple Edelweiss": 1,
  "White Edelweiss": 1,
  "Blue Edelweiss": 1,
  "Red Gladiolus": 1,
  "Yellow Gladiolus": 1,
  "Purple Gladiolus": 1,
  "White Gladiolus": 1,
  "Blue Gladiolus": 1,
  "Red Lavender": 1,
  "Yellow Lavender": 1,
  "Purple Lavender": 1,
  "White Lavender": 1,
  "Blue Lavender": 1,
  "Red Clover": 1,
  "Yellow Clover": 1,
  "Purple Clover": 1,
  "White Clover": 1,
  "Blue Clover": 1,
};

export const FLOWER_CROSS_BREED_AMOUNTS: Record<
  FlowerSeedName,
  Partial<Record<FlowerCrossBreedName, number>>
> = {
  "Sunpetal Seed": SET_1_FLOWER_CROSS_BREED_AMOUNTS,
  "Bloom Seed": SET_1_FLOWER_CROSS_BREED_AMOUNTS,
  "Lily Seed": SET_1_FLOWER_CROSS_BREED_AMOUNTS,
  "Edelweiss Seed": SET_2_FLOWER_CROSS_BREED_AMOUNTS,
  "Gladiolus Seed": SET_2_FLOWER_CROSS_BREED_AMOUNTS,
  "Lavender Seed": SET_2_FLOWER_CROSS_BREED_AMOUNTS,
  "Clover Seed": SET_2_FLOWER_CROSS_BREED_AMOUNTS,
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
    Rhubarb: translate("flower.breed.rhubarb"),
    Artichoke: translate("flower.breed.artichoke"),
    Pepper: translate("flower.breed.pepper"),
    Onion: translate("flower.breed.onion"),
    Barley: translate("flower.breed.barley"),
    "Red Edelweiss": translate("flower.breed.redEdelweiss"),
    "Yellow Edelweiss": translate("flower.breed.yellowEdelweiss"),
    "Purple Edelweiss": translate("flower.breed.purpleEdelweiss"),
    "White Edelweiss": translate("flower.breed.whiteEdelweiss"),
    "Blue Edelweiss": translate("flower.breed.blueEdelweiss"),
    "Red Gladiolus": translate("flower.breed.redGladiolus"),
    "Yellow Gladiolus": translate("flower.breed.yellowGladiolus"),
    "Purple Gladiolus": translate("flower.breed.purpleGladiolus"),
    "White Gladiolus": translate("flower.breed.whiteGladiolus"),
    "Blue Gladiolus": translate("flower.breed.blueGladiolus"),
    "Red Lavender": translate("flower.breed.redLavender"),
    "Yellow Lavender": translate("flower.breed.yellowLavender"),
    "Purple Lavender": translate("flower.breed.purpleLavender"),
    "White Lavender": translate("flower.breed.whiteLavender"),
    "Blue Lavender": translate("flower.breed.blueLavender"),
    "Red Clover": translate("flower.breed.redClover"),
    "Yellow Clover": translate("flower.breed.yellowClover"),
    "Purple Clover": translate("flower.breed.purpleClover"),
    "White Clover": translate("flower.breed.whiteClover"),
    "Blue Clover": translate("flower.breed.blueClover"),
  };

type Flower = {
  seed: FlowerSeedName;
  description: string;
};

const SUNPETAL_FLOWERS: Record<
  SunpetalFlowerName,
  Flower & { seed: "Sunpetal Seed" }
> = {
  "Red Pansy": {
    seed: "Sunpetal Seed",
    description: translate("description.red.pansy"),
  },
  "Yellow Pansy": {
    seed: "Sunpetal Seed",
    description: translate("description.yellow.pansy"),
  },
  "Purple Pansy": {
    seed: "Sunpetal Seed",
    description: translate("description.purple.pansy"),
  },
  "White Pansy": {
    seed: "Sunpetal Seed",
    description: translate("description.white.pansy"),
  },
  "Blue Pansy": {
    seed: "Sunpetal Seed",
    description: translate("description.blue.pansy"),
  },
  "Red Cosmos": {
    seed: "Sunpetal Seed",
    description: translate("description.red.cosmos"),
  },
  "Yellow Cosmos": {
    seed: "Sunpetal Seed",
    description: translate("description.yellow.cosmos"),
  },
  "Purple Cosmos": {
    seed: "Sunpetal Seed",
    description: translate("description.purple.cosmos"),
  },
  "White Cosmos": {
    seed: "Sunpetal Seed",
    description: translate("description.white.cosmos"),
  },
  "Blue Cosmos": {
    seed: "Sunpetal Seed",
    description: translate("description.blue.cosmos"),
  },
  "Prism Petal": {
    seed: "Sunpetal Seed",
    description: translate("description.prism.petal"),
  },
};
const BLOOM_FLOWERS: Record<BloomFlowerName, Flower & { seed: "Bloom Seed" }> =
  {
    "Red Balloon Flower": {
      seed: "Bloom Seed",
      description: translate("description.red.balloon.flower"),
    },
    "Yellow Balloon Flower": {
      seed: "Bloom Seed",
      description: translate("description.yellow.balloon.flower"),
    },
    "Purple Balloon Flower": {
      seed: "Bloom Seed",
      description: translate("description.purple.balloon.flower"),
    },
    "White Balloon Flower": {
      seed: "Bloom Seed",
      description: translate("description.white.balloon.flower"),
    },
    "Blue Balloon Flower": {
      seed: "Bloom Seed",
      description: translate("description.blue.balloon.flower"),
    },
    "Red Daffodil": {
      seed: "Bloom Seed",
      description: translate("description.red.daffodil"),
    },
    "Yellow Daffodil": {
      seed: "Bloom Seed",
      description: translate("description.yellow.daffodil"),
    },
    "Purple Daffodil": {
      seed: "Bloom Seed",
      description: translate("description.purple.daffodil"),
    },
    "White Daffodil": {
      seed: "Bloom Seed",
      description: translate("description.white.daffodil"),
    },
    "Blue Daffodil": {
      seed: "Bloom Seed",
      description: translate("description.blue.daffodil"),
    },
    "Celestial Frostbloom": {
      seed: "Bloom Seed",
      description: translate("description.celestial.frostbloom"),
    },
  };
const LILY_FLOWERS: Record<LilyFlowerName, Flower & { seed: "Lily Seed" }> = {
  "Red Carnation": {
    seed: "Lily Seed",
    description: translate("description.red.carnation"),
  },
  "Yellow Carnation": {
    seed: "Lily Seed",
    description: translate("description.yellow.carnation"),
  },
  "Purple Carnation": {
    seed: "Lily Seed",
    description: translate("description.purple.carnation"),
  },
  "White Carnation": {
    seed: "Lily Seed",
    description: translate("description.white.carnation"),
  },
  "Blue Carnation": {
    seed: "Lily Seed",
    description: translate("description.blue.carnation"),
  },
  "Red Lotus": {
    seed: "Lily Seed",
    description: translate("description.red.lotus"),
  },
  "Yellow Lotus": {
    seed: "Lily Seed",
    description: translate("description.yellow.lotus"),
  },
  "Purple Lotus": {
    seed: "Lily Seed",
    description: translate("description.purple.lotus"),
  },
  "White Lotus": {
    seed: "Lily Seed",
    description: translate("description.white.lotus"),
  },
  "Blue Lotus": {
    seed: "Lily Seed",
    description: translate("description.blue.lotus"),
  },
  "Primula Enigma": {
    seed: "Lily Seed",
    description: translate("description.primula.enigma"),
  },
};

const EDELWEISS_FLOWERS: Record<
  EdelweissFlowerName,
  Flower & { seed: "Edelweiss Seed" }
> = {
  "Red Edelweiss": {
    seed: "Edelweiss Seed",
    description: translate("description.red.edelweiss"),
  },
  "Yellow Edelweiss": {
    seed: "Edelweiss Seed",
    description: translate("description.yellow.edelweiss"),
  },
  "Purple Edelweiss": {
    seed: "Edelweiss Seed",
    description: translate("description.purple.edelweiss"),
  },
  "White Edelweiss": {
    seed: "Edelweiss Seed",
    description: translate("description.white.edelweiss"),
  },
  "Blue Edelweiss": {
    seed: "Edelweiss Seed",
    description: translate("description.blue.edelweiss"),
  },
};

const GLADIOLUS_FLOWERS: Record<
  GladiolusFlowerName,
  Flower & { seed: "Gladiolus Seed" }
> = {
  "Red Gladiolus": {
    seed: "Gladiolus Seed",
    description: translate("description.red.gladiolus"),
  },
  "Yellow Gladiolus": {
    seed: "Gladiolus Seed",
    description: translate("description.yellow.gladiolus"),
  },
  "Purple Gladiolus": {
    seed: "Gladiolus Seed",
    description: translate("description.purple.gladiolus"),
  },
  "White Gladiolus": {
    seed: "Gladiolus Seed",
    description: translate("description.white.gladiolus"),
  },
  "Blue Gladiolus": {
    seed: "Gladiolus Seed",
    description: translate("description.blue.gladiolus"),
  },
};

const LAVENDER_FLOWERS: Record<
  LavenderFlowerName,
  Flower & { seed: "Lavender Seed" }
> = {
  "Red Lavender": {
    seed: "Lavender Seed",
    description: translate("description.red.lavender"),
  },
  "Yellow Lavender": {
    seed: "Lavender Seed",
    description: translate("description.yellow.lavender"),
  },
  "Purple Lavender": {
    seed: "Lavender Seed",
    description: translate("description.purple.lavender"),
  },
  "White Lavender": {
    seed: "Lavender Seed",
    description: translate("description.white.lavender"),
  },
  "Blue Lavender": {
    seed: "Lavender Seed",
    description: translate("description.blue.lavender"),
  },
};

const CLOVER_FLOWERS: Record<
  CloverFlowerName,
  Flower & { seed: "Clover Seed" }
> = {
  "Red Clover": {
    seed: "Clover Seed",
    description: translate("description.red.clover"),
  },
  "Yellow Clover": {
    seed: "Clover Seed",
    description: translate("description.yellow.clover"),
  },
  "Purple Clover": {
    seed: "Clover Seed",
    description: translate("description.purple.clover"),
  },
  "White Clover": {
    seed: "Clover Seed",
    description: translate("description.white.clover"),
  },
  "Blue Clover": {
    seed: "Clover Seed",
    description: translate("description.blue.clover"),
  },
};

export const FLOWERS: Record<FlowerName, Flower> = {
  ...SUNPETAL_FLOWERS,
  ...BLOOM_FLOWERS,
  ...LILY_FLOWERS,
  ...EDELWEISS_FLOWERS,
  ...GLADIOLUS_FLOWERS,
  ...LAVENDER_FLOWERS,
  ...CLOVER_FLOWERS,
};

export type FlowerGrowthStage =
  | "seedling"
  | "sprout"
  | "halfway"
  | "almost"
  | "ready";

export type MutantFlowerName =
  | "Desert Rose"
  | "Chicory"
  | "Chamomile"
  | "Lunalist"
  | "Venus Bumpkin Trap"
  | "Black Hole Flower"
  | "Anemone Flower";
