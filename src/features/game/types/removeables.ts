import { canChop } from "features/game/events/landExpansion/chop";
import {
  CHICKEN_TIME_TO_EGG,
  CRIMSTONE_RECOVERY_TIME,
  GOLD_RECOVERY_TIME,
  IRON_RECOVERY_TIME,
  STONE_RECOVERY_TIME,
} from "features/game/lib/constants";
import {
  GreenHouseFruitName,
  PatchFruitName,
} from "features/game/types/fruits";
import {
  BedName,
  GameState,
  InventoryItemName,
} from "features/game/types/game";
import {
  CropName,
  GREENHOUSE_CROPS,
  GreenHouseCropName,
} from "features/game/types/crops";
import { canMine } from "../expansion/lib/utils";
import { areUnsupportedChickensBrewing } from "features/game/events/landExpansion/removeBuilding";
import { Bud, StemTrait, TypeTrait } from "./buds";
import {
  isAdvancedCrop,
  isBasicCrop,
  isMediumCrop,
  isCropGrowing,
} from "features/game/events/landExpansion/harvest";
import { isFruitGrowing } from "features/game/events/landExpansion/fruitHarvested";
import { CompostName, isComposting } from "./composters";
import { getDailyFishingCount } from "./fishing";
import { FLOWERS, FLOWER_SEEDS } from "./flowers";
import { getCurrentHoneyProduced } from "../expansion/components/resources/beehive/beehiveMachine";
import { DEFAULT_HONEY_PRODUCTION_TIME } from "../lib/updateBeehives";
import { translate } from "lib/i18n/translate";
import { canDrillOilReserve } from "../events/landExpansion/drillOilReserve";
import { getKeys } from "./decorations";
import { BED_FARMHAND_COUNT } from "./beds";

export type Restriction = [boolean, string];
type RemoveCondition = (gameState: GameState) => Restriction;

type CanRemoveArgs = {
  item: CropName;
  game: GameState;
};

export function cropIsGrowing({ item, game }: CanRemoveArgs): Restriction {
  const cropGrowing = Object.values(game.crops ?? {}).some(
    (plot) => isCropGrowing(plot) && plot.crop?.name === item,
  );
  return [cropGrowing, translate("restrictionReason.isGrowing", { item })];
}
type CanRemoveGreenhouseCropsArgs = {
  crop: GreenHouseCropName | GreenHouseFruitName;
  game: GameState;
};

export function greenhouseCropIsGrowing({
  crop,
  game,
}: CanRemoveGreenhouseCropsArgs): Restriction {
  const cropPlanted = Object.values(game.greenhouse.pots ?? {}).some(
    (pots) => pots.plant && pots.plant.name === crop,
  );
  return [
    cropPlanted,
    translate("restrictionReason.?cropGrowing", { crop: crop }),
  ];
}

function areAnyGreenhouseCropGrowing(game: GameState): Restriction {
  const cropsPlanted = Object.values(game.greenhouse.pots ?? {}).some(
    (plot) => !!plot.plant,
  );

  return [cropsPlanted, translate("restrictionReason.cropsGrowing")];
}

export function areAnyCropsOrGreenhouseCropsGrowing(
  game: GameState,
): Restriction {
  const cropsToCheck = getKeys(GREENHOUSE_CROPS);
  const greenhouseCropsGrowing = cropsToCheck.some(
    (crop) => greenhouseCropIsGrowing({ crop, game })[0],
  );

  const [cropsGrowing] = areAnyCropsGrowing(game);

  const anyCropsGrowing = greenhouseCropsGrowing || cropsGrowing;

  return [anyCropsGrowing, translate("restrictionReason.cropsGrowing")];
}

function beanIsPlanted(game: GameState): Restriction {
  const beanPlanted = game.collectibles["Magic Bean"]?.length ?? 0;

  return [!!beanPlanted, translate("restrictionReason.beanPlanted")];
}

export function areFruitsGrowing(
  game: GameState,
  fruit: PatchFruitName,
): Restriction {
  const fruitGrowing = Object.values(game.fruitPatches ?? {}).some(
    (patch) => isFruitGrowing(patch) && patch.fruit?.name === fruit,
  );

  return [
    fruitGrowing,
    translate("restrictionReason.isGrowing", { item: fruit }),
  ];
}
// Function for Fruit Picker Apron
export function areAnyOGFruitsGrowing(game: GameState): Restriction {
  const fruits = ["Apple", "Banana", "Orange", "Blueberry"];
  const fruitGrowing = Object.values(game.fruitPatches ?? {}).some(
    (patch) =>
      isFruitGrowing(patch) && fruits.includes(patch.fruit?.name || ""),
  );

  return [fruitGrowing, translate("restrictionReason.fruitsGrowing")];
}

export function areAnyFruitsGrowing(game: GameState): Restriction {
  const fruitGrowing = Object.values(game.fruitPatches ?? {}).some((patch) =>
    isFruitGrowing(patch),
  );

  return [fruitGrowing, translate("restrictionReason.fruitsGrowing")];
}

export function areAnyCropsGrowing(game: GameState): Restriction {
  const cropsGrowing = Object.values(game.crops ?? {}).some((plot) =>
    isCropGrowing(plot),
  );

  return [cropsGrowing, translate("restrictionReason.cropsGrowing")];
}

function areAnyBasicCropsGrowing(game: GameState): Restriction {
  const cropsGrowing = Object.values(game.crops ?? {}).some(
    (plot) => plot.crop && isBasicCrop(plot.crop?.name) && isCropGrowing(plot),
  );

  return [cropsGrowing, translate("restrictionReason.basicCropsGrowing")];
}

function areAnyMediumCropsGrowing(game: GameState): Restriction {
  const cropsGrowing = Object.values(game.crops ?? {}).some(
    (plot) => plot.crop && isMediumCrop(plot.crop?.name) && isCropGrowing(plot),
  );

  return [cropsGrowing, translate("restrictionReason.mediumCropsGrowing")];
}

function areAnyAdvancedCropsGrowing(game: GameState): Restriction {
  const cropsGrowing = Object.values(game.crops ?? {}).some(
    (plot) =>
      plot.crop && isAdvancedCrop(plot.crop?.name) && isCropGrowing(plot),
  );

  return [cropsGrowing, translate("restrictionReason.advancedCropsGrowing")];
}

function areAnyAdvancedOrMediumCropsGrowing(game: GameState): Restriction {
  const mediumCropsGrowing = areAnyMediumCropsGrowing(game);
  const advancedCropsGrowing = areAnyAdvancedCropsGrowing(game);

  if (mediumCropsGrowing[0]) {
    return mediumCropsGrowing;
  }

  return advancedCropsGrowing;
}

function areAnyTreesChopped(game: GameState): Restriction {
  const treesChopped = Object.values(game.trees ?? {}).some(
    (tree) => !canChop(tree),
  );
  return [treesChopped, translate("restrictionReason.treesChopped")];
}

function areAnyStonesMined(game: GameState): Restriction {
  const stoneMined = Object.values(game.stones ?? {}).some(
    (stone) => !canMine(stone, STONE_RECOVERY_TIME),
  );
  return [stoneMined, translate("restrictionReason.stoneMined")];
}

function areAnyIronsMined(game: GameState): Restriction {
  const ironMined = Object.values(game.iron ?? {}).some(
    (iron) => !canMine(iron, IRON_RECOVERY_TIME),
  );
  return [ironMined, translate("restrictionReason.ironMined")];
}

function areAnyGoldsMined(game: GameState): Restriction {
  const goldMined = Object.values(game.gold ?? {}).some(
    (gold) => !canMine(gold, GOLD_RECOVERY_TIME),
  );
  return [goldMined, translate("restrictionReason.goldMined")];
}

export function areAnyCrimstonesMined(game: GameState): Restriction {
  const crimstoneMined = Object.values(game.crimstones ?? {}).some(
    (crimstone) => !canMine(crimstone, CRIMSTONE_RECOVERY_TIME),
  );
  return [crimstoneMined, translate("restrictionReason.crimstoneMined")];
}

export function isCrimstoneHammerActive(game: GameState): Restriction {
  const crimstoneMined = Object.values(game.crimstones ?? {}).some(
    (crimstone) => !canMine(crimstone, 7 * 24 * 60 * 60),
    // 7 day cooldown (5 day cycle + 2 day buffer) to prevent crimstone hammer sharing exploits
  );
  return [crimstoneMined, translate("restrictionReason.crimstoneMined")];
}

function areAnyMineralsMined(game: GameState): Restriction {
  const areStonesMined = areAnyStonesMined(game);
  const areIronsMined = areAnyIronsMined(game);
  const areGoldsMined = areAnyGoldsMined(game);

  if (areStonesMined[0]) {
    return areStonesMined;
  }
  if (areIronsMined[0]) {
    return areIronsMined;
  }

  return areGoldsMined;
}

export function areAnyChickensFed(game: GameState): Restriction {
  const chickensAreFed = Object.values(game.chickens).some(
    (chicken) =>
      chicken.fedAt && Date.now() - chicken.fedAt < CHICKEN_TIME_TO_EGG,
  );

  return [chickensAreFed, translate("restrictionReason.chickensFed")];
}

export function areAnyChickensSleeping(game: GameState): Restriction {
  const chickensAreSleeping = Object.values(game.henHouse.animals).some(
    (animal) =>
      animal.type === "Chicken" &&
      animal.awakeAt &&
      Date.now() < animal.awakeAt,
  );

  return [chickensAreSleeping, translate("restrictionReason.chickensFed")];
}

export function areAnySheepSleeping(game: GameState): Restriction {
  const sheepAreSleeping = Object.values(game.barn.animals).some(
    (animal) =>
      animal.type === "Sheep" && animal.awakeAt && Date.now() < animal.awakeAt,
  );

  return [sheepAreSleeping, translate("restrictionReason.sheepSleeping")];
}

export function areAnyCowsSleeping(game: GameState): Restriction {
  const cowAreFed = Object.values(game.barn.animals).some(
    (animal) =>
      animal.type === "Cow" && animal.awakeAt && Date.now() < animal.awakeAt,
  );

  return [cowAreFed, translate("restrictionReason.cowsSleeping")];
}

const MAX_DIGS = 25;
export function areBonusTreasureHolesDug(game: GameState): Restriction {
  const holes = game.desert.digging.grid.flat().map((hole) => {
    const today = new Date().toISOString().substring(0, 10);

    return +(new Date(hole.dugAt).toISOString().substring(0, 10) === today);
  });
  const holesDug = holes.reduce((sum, value) => sum + value, 0) > MAX_DIGS;

  return [holesDug, translate("restrictionReason.treasuresDug")];
}

function areAnyComposting(game: GameState): Restriction {
  return [
    isComposting(game, "Compost Bin") ||
      isComposting(game, "Turbo Composter") ||
      isComposting(game, "Premium Composter"),
    translate("restrictionReason.inUse"),
  ];
}

export function hasFishedToday(game: GameState): Restriction {
  return [
    getDailyFishingCount(game) !== 0,
    translate("restrictionReason.recentlyFished"),
  ];
}

export function areFlowersGrowing(game: GameState): Restriction {
  const flowerGrowing = Object.values(game.flowers.flowerBeds).some(
    (flowerBed) => {
      const flower = flowerBed.flower;

      if (!flower) return false;

      return (
        flower.plantedAt +
          FLOWER_SEEDS()[FLOWERS[flower.name].seed].plantSeconds * 1000 >=
        Date.now()
      );
    },
  );

  return [flowerGrowing, translate("restrictionReason.flowersGrowing")];
}

export function isBeehivesFull(game: GameState): Restriction {
  // 0.9 Small buffer in case of any rounding errors
  const beehiveProducing = Object.values(game.beehives).every(
    (hive) =>
      getCurrentHoneyProduced(hive) >= DEFAULT_HONEY_PRODUCTION_TIME * 0.9,
  );

  return [beehiveProducing, translate("restrictionReason.beehiveInUse")];
}

export function isProducingHoney(game: GameState): Restriction {
  return [
    areFlowersGrowing(game)[0] && !isBeehivesFull(game)[0],
    translate("restrictionReason.beesBusy"),
  ];
}

function isFertiliserApplied(
  game: GameState,
  fertiliser: CompostName,
): Restriction {
  const fertiliserApplied = Object.values(game.crops ?? {}).some(
    (plot) => plot.fertiliser?.name === fertiliser,
  );
  return [fertiliserApplied, translate("restrictionReason.inUse")];
}

export const canShake = (shakenAt?: number) => {
  if (!shakenAt) return true;

  const today = new Date().toISOString().substring(0, 10);

  return new Date(shakenAt).toISOString().substring(0, 10) !== today;
};

function hasShakenManeki(game: GameState): Restriction {
  const manekiNekos = [
    ...(game.collectibles["Maneki Neko"] ?? []),
    ...(game.home.collectibles["Maneki Neko"] ?? []),
  ];
  const hasShakenRecently = manekiNekos.some((maneki) => {
    const shakenAt = maneki.shakenAt || 0;

    return !canShake(shakenAt);
  });

  return [hasShakenRecently, translate("restrictionReason.pawShaken")];
}

export function hasOpenedPirateChest(game: GameState): Restriction {
  function pirateChestOpened() {
    const piratePotionOpened = game.pumpkinPlaza.pirateChest?.openedAt || 0;
    return !canShake(piratePotionOpened);
  }

  return [pirateChestOpened(), "Pirate Chest Opened"];
}

function hasShakenTree(game: GameState): Restriction {
  const trees = game.collectibles["Festive Tree"] ?? [];
  const hasShakenRecently = trees.some((tree) => {
    return (
      tree.shakenAt &&
      new Date(tree.shakenAt).getFullYear() === new Date().getFullYear()
    );
  });

  return [hasShakenRecently, translate("restrictionReason.festiveSeason")];
}

export function areAnyOilReservesDrilled(game: GameState): Restriction {
  const now = Date.now();

  const oilReservesDrilled = Object.values(game.oilReserves).some(
    (oilReserve) => !canDrillOilReserve(oilReserve, now),
  );

  return [oilReservesDrilled, translate("restrictionReason.oilReserveDrilled")];
}

function hasSeedsCropsInMachine(game: GameState): Restriction {
  const machine = game.buildings["Crop Machine"]?.[0];
  return [
    !!machine?.queue?.length,
    translate("restrictionReason.buildingInUse"),
  ];
}

export function isFarmhandUsingBed(
  bedName: BedName,
  game: GameState,
): Restriction {
  const isLastBed =
    (game.collectibles[bedName]?.length ?? 0) +
      (game.home.collectibles[bedName]?.length ?? 0) <=
    1;

  const farmHandCount = getKeys(game.farmHands.bumpkins).length + 1;
  const farmHandInBed = farmHandCount >= BED_FARMHAND_COUNT[bedName];

  return [isLastBed && farmHandInBed, "Farmhand is using bed"];
}

const newAnimalsStarted =
  Date.now() > new Date("2024-11-04T00:00:00Z").getTime();

export const REMOVAL_RESTRICTIONS: Partial<
  Record<InventoryItemName, RemoveCondition>
> = {
  // Mutant Chickens
  "Undead Rooster": (game) =>
    newAnimalsStarted ? areAnyChickensSleeping(game) : areAnyChickensFed(game),
  "Ayam Cemani": (game) =>
    newAnimalsStarted ? areAnyChickensSleeping(game) : areAnyChickensFed(game),
  "El Pollo Veloz": (game) =>
    newAnimalsStarted ? areAnyChickensSleeping(game) : areAnyChickensFed(game),
  "Rich Chicken": (game) =>
    newAnimalsStarted ? areAnyChickensSleeping(game) : areAnyChickensFed(game),
  "Fat Chicken": (game) =>
    newAnimalsStarted ? areAnyChickensSleeping(game) : areAnyChickensFed(game),
  "Speed Chicken": (game) =>
    newAnimalsStarted ? areAnyChickensSleeping(game) : areAnyChickensFed(game),
  "Chicken Coop": (game) =>
    newAnimalsStarted ? areAnyChickensSleeping(game) : areAnyChickensFed(game),
  "Gold Egg": (game) =>
    newAnimalsStarted ? areAnyChickensSleeping(game) : areAnyChickensFed(game),
  Rooster: (game) =>
    newAnimalsStarted ? areAnyChickensSleeping(game) : areAnyChickensFed(game),
  Bale: (game) =>
    newAnimalsStarted ? areAnyChickensSleeping(game) : areAnyChickensFed(game),
  "Banana Chicken": (game) => areFruitsGrowing(game, "Banana"),
  "Crim Peckster": (game) => areAnyCrimstonesMined(game),

  // Crop Boosts
  Nancy: (game) => areAnyCropsOrGreenhouseCropsGrowing(game),
  Scarecrow: (game) => areAnyCropsOrGreenhouseCropsGrowing(game),
  Kuebiko: (game) => areAnyCropsOrGreenhouseCropsGrowing(game),
  "Lunar Calendar": (game) => areAnyCropsOrGreenhouseCropsGrowing(game),
  "Basic Scarecrow": (game) => areAnyBasicCropsGrowing(game),
  "Sir Goldensnout": (game) => areAnyCropsGrowing(game),
  "Scary Mike": (game) => areAnyMediumCropsGrowing(game),
  "Laurie the Chuckle Crow": (game) => areAnyAdvancedCropsGrowing(game),
  Gnome: (game) => areAnyAdvancedOrMediumCropsGrowing(game),
  "Cabbage Boy": (game) => cropIsGrowing({ item: "Cabbage", game }),
  "Cabbage Girl": (game) => cropIsGrowing({ item: "Cabbage", game }),
  Karkinos: (game) => cropIsGrowing({ item: "Cabbage", game }),
  "Easter Bunny": (game) => cropIsGrowing({ item: "Carrot", game }),
  "Pablo The Bunny": (game) => cropIsGrowing({ item: "Carrot", game }),
  "Golden Cauliflower": (game) => cropIsGrowing({ item: "Cauliflower", game }),
  "Mysterious Parsnip": (game) => cropIsGrowing({ item: "Parsnip", game }),
  "Peeled Potato": (game) => cropIsGrowing({ item: "Potato", game }),
  "Victoria Sisters": (game) => cropIsGrowing({ item: "Pumpkin", game }),
  "Freya Fox": (game) => cropIsGrowing({ item: "Pumpkin", game }),
  Poppy: (game) => cropIsGrowing({ game, item: "Corn" }),
  Kernaldo: (game) => cropIsGrowing({ game, item: "Corn" }),
  "Queen Cornelia": (game) => cropIsGrowing({ game, item: "Corn" }),
  Maximus: (game) => cropIsGrowing({ item: "Eggplant", game }),
  Obie: (game) => cropIsGrowing({ item: "Eggplant", game }),
  "Purple Trail": (game) => cropIsGrowing({ item: "Eggplant", game }),

  // Fruit Boosts
  "Squirrel Monkey": (game) => areFruitsGrowing(game, "Orange"),
  "Black Bearry": (game) => areFruitsGrowing(game, "Blueberry"),
  "Lady Bug": (game) => areFruitsGrowing(game, "Apple"),
  Nana: (game) => areFruitsGrowing(game, "Banana"),
  "Immortal Pear": (game) => areAnyFruitsGrowing(game),
  "Lemon Tea Bath": (game) => areFruitsGrowing(game, "Lemon"),
  "Tomato Clown": (game) => areFruitsGrowing(game, "Tomato"),
  "Tomato Bombard": (game) => areFruitsGrowing(game, "Tomato"),
  Cannonball: (game) => areFruitsGrowing(game, "Tomato"),

  // Composter boosts
  "Soil Krabby": (game) => areAnyComposting(game),

  // Fertiliser Boosts
  "Knowledge Crab": (game) => isFertiliserApplied(game, "Sprout Mix"),

  // Wood Boosts
  "Woody the Beaver": (game) => areAnyTreesChopped(game),
  "Apprentice Beaver": (game) => areAnyTreesChopped(game),
  "Foreman Beaver": (game) => areAnyTreesChopped(game),
  "Wood Nymph Wendy": (game) => areAnyTreesChopped(game),
  "Tiki Totem": (game) => areAnyTreesChopped(game),

  // Mineral Boosts
  "Rock Golem": (game) => areAnyStonesMined(game),
  "Tunnel Mole": (game) => areAnyStonesMined(game),
  "Rocky the Mole": (game) => areAnyIronsMined(game),
  "Iron Idol": (game) => areAnyIronsMined(game),
  Nugget: (game) => areAnyGoldsMined(game),
  "Tin Turtle": (game) => areAnyStonesMined(game),
  "Emerald Turtle": (game) => areAnyMineralsMined(game),

  // Mutant Crops
  "Carrot Sword": (game) => beanIsPlanted(game),
  "Stellar Sunflower": (game) => cropIsGrowing({ item: "Sunflower", game }),
  "Potent Potato": (game) => cropIsGrowing({ item: "Potato", game }),
  "Radical Radish": (game) => cropIsGrowing({ item: "Radish", game }),

  "Heart of Davy Jones": (game) => areBonusTreasureHolesDug(game),

  "Maneki Neko": (game) => hasShakenManeki(game),
  "Festive Tree": (game) => hasShakenTree(game),

  "Grinx's Hammer": (game: GameState) => {
    const canRemove =
      Date.now() > (game.expandedAt ?? 0) + 7 * 24 * 60 * 60 * 1000;

    return [!canRemove, translate("restrictionReason.recentlyUsed")];
  },

  // Fishing Boosts
  Alba: (game) => hasFishedToday(game),
  Walrus: (game) => hasFishedToday(game),

  // Honey
  "Queen Bee": (game) => isProducingHoney(game),
  "Flower Fox": (game) => areFlowersGrowing(game),

  // Clash of Factions
  Soybliss: (game) => cropIsGrowing({ item: "Soybean", game }),

  "Knight Chicken": (game) => areAnyOilReservesDrilled(game),
  "Battle Fish": (game) => areAnyOilReservesDrilled(game),
  "Turbo Sprout": (game) => areAnyGreenhouseCropGrowing(game),
  Greenhouse: (game) => areAnyGreenhouseCropGrowing(game),
  "Pharaoh Gnome": (game) => areAnyGreenhouseCropGrowing(game),
  Vinny: (game) => greenhouseCropIsGrowing({ crop: "Grape", game }),
  "Grape Granny": (game) => greenhouseCropIsGrowing({ crop: "Grape", game }),
  "Rice Panda": (game) => greenhouseCropIsGrowing({ crop: "Rice", game }),

  // Buildings
  "Crop Machine": (game) => hasSeedsCropsInMachine(game),

  // Hourglass
  "Time Warp Totem": (_: GameState) => [
    true,
    translate("restrictionReason.inUse"),
  ],
  "Gourmet Hourglass": (_: GameState) => [
    true,
    translate("restrictionReason.inUse"),
  ],
  "Harvest Hourglass": (_: GameState) => [
    true,
    translate("restrictionReason.inUse"),
  ],
  "Fisher's Hourglass": (_: GameState) => [
    true,
    translate("restrictionReason.inUse"),
  ],
  "Blossom Hourglass": (_: GameState) => [
    true,
    translate("restrictionReason.inUse"),
  ],
  "Orchard Hourglass": (_: GameState) => [
    true,
    translate("restrictionReason.inUse"),
  ],
  "Ore Hourglass": (_: GameState) => [
    true,
    translate("restrictionReason.inUse"),
  ],
  "Timber Hourglass": (_: GameState) => [
    true,
    translate("restrictionReason.inUse"),
  ],

  // Pharaoh's Treasure
  "Pharaoh Chicken": (game) => areBonusTreasureHolesDug(game),
  "Desert Rose": (game) => areFlowersGrowing(game),
  "Lemon Shark": (game) => areFruitsGrowing(game, "Lemon"),
  "Lemon Frog": (game) => areFruitsGrowing(game, "Lemon"),
  "Reveling Lemon": (game) => areFruitsGrowing(game, "Lemon"),

  "Basic Bed": (game) => isFarmhandUsingBed("Basic Bed", game),
  "Fisher Bed": (game) => isFarmhandUsingBed("Fisher Bed", game),
  "Floral Bed": (game) => isFarmhandUsingBed("Floral Bed", game),
  "Sturdy Bed": (game) => isFarmhandUsingBed("Sturdy Bed", game),
  "Desert Bed": (game) => isFarmhandUsingBed("Desert Bed", game),
  "Cow Bed": (game) => isFarmhandUsingBed("Cow Bed", game),
  "Pirate Bed": (game) => isFarmhandUsingBed("Pirate Bed", game),
  "Royal Bed": (game) => isFarmhandUsingBed("Royal Bed", game),

  // Bull Run
  "Sheaf of Plenty": (game) => cropIsGrowing({ item: "Barley", game }),
  Chicory: (game) => areFlowersGrowing(game),
  "Moo-ver": (game) => areAnyCowsSleeping(game),
  Cluckulator: (game) => areAnyChickensFed(game),
  "Longhorn Cowfish": (game) => areAnyCowsSleeping(game),
  "Toxic Tuft": (game) => areAnySheepSleeping(game),
  Mootant: (game) => areAnyCowsSleeping(game),
  "Alien Chicken": (game) => areAnyChickensSleeping(game),
};

export const BUD_REMOVAL_RESTRICTIONS: Record<
  StemTrait | TypeTrait,
  RemoveCondition
> = {
  // HATS
  "3 Leaf Clover": (game) => areAnyCropsOrGreenhouseCropsGrowing(game),
  "Fish Hat": (game) => hasFishedToday(game),
  "Diamond Gem": (game) => areAnyMineralsMined(game),
  "Gold Gem": (game) => areAnyGoldsMined(game),
  "Miner Hat": (game) => areAnyIronsMined(game),
  "Carrot Head": (game) => cropIsGrowing({ item: "Carrot", game }),
  "Basic Leaf": (game) => areAnyBasicCropsGrowing(game),
  "Sunflower Hat": (game) => cropIsGrowing({ item: "Sunflower", game }),
  "Ruby Gem": (game) => areAnyStonesMined(game),
  Mushroom: () => [false, translate("restrictionReason.noRestriction")],
  "Magic Mushroom": () => [false, translate("restrictionReason.noRestriction")],
  "Acorn Hat": (game) => areAnyTreesChopped(game),
  Banana: (game) => areAnyFruitsGrowing(game),
  "Tree Hat": (game) => areAnyTreesChopped(game),
  "Egg Head": (game) =>
    newAnimalsStarted ? areAnyChickensSleeping(game) : areAnyChickensFed(game),
  "Apple Head": (game) => areAnyFruitsGrowing(game),

  "Axe Head": () => [false, translate("restrictionReason.noRestriction")],
  "Rainbow Horn": () => [false, translate("restrictionReason.noRestriction")],
  "Red Bow": () => [false, translate("restrictionReason.noRestriction")],
  "Silver Horn": () => [false, translate("restrictionReason.noRestriction")],
  "Sunflower Headband": () => [
    false,
    translate("restrictionReason.noRestriction"),
  ],
  "Sunshield Foliage": () => [
    false,
    translate("restrictionReason.noRestriction"),
  ],
  "Tender Coral": () => [false, translate("restrictionReason.noRestriction")],
  Seashell: () => [false, translate("restrictionReason.noRestriction")],
  Hibiscus: () => [false, translate("restrictionReason.noRestriction")],

  // TYPES
  Plaza: (game) => areAnyBasicCropsGrowing(game),
  Woodlands: (game) => areAnyTreesChopped(game),
  Cave: (game) => areAnyMineralsMined(game),
  Sea: (game) => hasFishedToday(game),
  Castle: (game) => areAnyMediumCropsGrowing(game),
  // TODO Port needs to be implemented
  Port: () => [false, translate("restrictionReason.noRestriction")],
  Retreat: (game) =>
    newAnimalsStarted ? areAnyChickensSleeping(game) : areAnyChickensFed(game),
  Saphiro: (game) => areAnyCropsOrGreenhouseCropsGrowing(game),
  Snow: (game) => areAnyAdvancedCropsGrowing(game),
  Beach: (game) => areAnyFruitsGrowing(game),
};

export const hasBudRemoveRestriction = (
  state: GameState,
  bud: Bud,
): Restriction => {
  const stemRemoveRestriction = BUD_REMOVAL_RESTRICTIONS[bud.stem];
  const typeRemoveRestriction = BUD_REMOVAL_RESTRICTIONS[bud.type];

  const [stemRestricted, stemReason] = stemRemoveRestriction(state);
  if (stemRestricted) return [stemRestricted, stemReason];

  const [typeRestricted, typeReason] = typeRemoveRestriction(state);
  if (typeRestricted) return [typeRestricted, typeReason];

  return [false, translate("restrictionReason.noRestriction")];
};

export const hasRemoveRestriction = (
  name: InventoryItemName | "Bud",
  id: string,
  state: GameState,
): Restriction => {
  if (name === "Bud") {
    const bud = state.buds?.[Number(id)];
    return bud
      ? hasBudRemoveRestriction(state, bud)
      : [false, translate("restrictionReason.noRestriction")];
  }

  if (name === "Genie Lamp") {
    const collectibleGroup = state.collectibles[name];
    if (!collectibleGroup)
      return [true, translate("restrictionReason.genieLampRubbed")];

    const collectibleToRemove = collectibleGroup.find(
      (collectible) => collectible.id === id,
    );
    if (!collectibleToRemove)
      return [true, translate("restrictionReason.genieLampRubbed")];

    const rubbedCount = collectibleToRemove.rubbedCount ?? 0;
    if (rubbedCount > 0) {
      return [true, translate("restrictionReason.genieLampRubbed")];
    }
  }

  if (name === "Chicken Coop") {
    if (areUnsupportedChickensBrewing(state))
      return [true, translate("restrictionReason.chickensFed")];
  }

  const removeRestriction = REMOVAL_RESTRICTIONS[name];
  if (removeRestriction) return removeRestriction(state);

  return [false, translate("restrictionReason.noRestriction")];
};

export const hasMoveRestriction = (
  name: InventoryItemName,
  id: string,
  state: GameState,
): Restriction => {
  const isAoEItem =
    name === "Bale" ||
    name === "Basic Scarecrow" ||
    name === "Emerald Turtle" ||
    name === "Tin Turtle" ||
    name === "Sir Goldensnout" ||
    name === "Scary Mike" ||
    name === "Laurie the Chuckle Crow" ||
    name === "Queen Cornelia" ||
    name === "Gnome";

  const [isRestricted, restrictionReason] = hasRemoveRestriction(
    name,
    id,
    state,
  );

  return [isRestricted && isAoEItem, restrictionReason];
};
