import { canChop } from "features/game/events/landExpansion/chop";
import { CHICKEN_TIME_TO_EGG } from "features/game/lib/constants";
import { FruitName } from "features/game/types/fruits";
import { GameState, InventoryItemName } from "features/game/types/game";
import { CropName } from "features/game/types/crops";
import { canMine } from "features/game/events/landExpansion/stoneMine";
import { CommodityName } from "features/game/types/resources";
import { areUnsupportedChickensBrewing } from "features/game/events/landExpansion/removeBuilding";
import { Bud, StemTrait, TypeTrait } from "./buds";
import {
  isAdvancedCrop,
  isBasicCrop,
  isMediumCrop,
  isCropGrowing,
} from "features/game/events/landExpansion/harvest";
import { isFruitGrowing } from "features/game/events/landExpansion/fruitHarvested";

type RESTRICTION_REASON =
  | "No restriction"
  | `${CropName} is growing`
  | `${FruitName} is growing`
  | "Crops are growing"
  | "Chickens are fed"
  | "Fruits are growing"
  | "Trees are chopped"
  | `${CommodityName} is mined`
  | "Treasure holes are dug"
  | "Genie Lamp rubbed"
  | "Paw shaken"
  | "Basic crops are growing"
  | "Medium crops are growing"
  | "Advanced crops are growing"
  | "Magic Bean is planted";

export type Restriction = [boolean, RESTRICTION_REASON];
type RemoveCondition = (gameState: GameState) => Restriction;

type CanRemoveArgs = {
  item: CropName;
  game: GameState;
};

function cropIsGrowing({ item, game }: CanRemoveArgs): Restriction {
  const cropGrowing = Object.values(game.crops ?? {}).some(
    (plot) => isCropGrowing(plot) && plot.crop?.name === item
  );
  return [cropGrowing, `${item} is growing`];
}

function beanIsPlanted(game: GameState): Restriction {
  const beanPlanted = game.collectibles["Magic Bean"]?.length ?? 0;

  return [!!beanPlanted, "Magic Bean is planted"];
}

function areFruitsGrowing(game: GameState, fruit: FruitName): Restriction {
  const fruitGrowing = Object.values(game.fruitPatches ?? {}).some(
    (patch) => isFruitGrowing(patch) && patch.fruit?.name === fruit
  );

  return [fruitGrowing, `${fruit} is growing`];
}

function areAnyFruitsGrowing(game: GameState): Restriction {
  const fruitGrowing = Object.values(game.fruitPatches ?? {}).some((patch) =>
    isFruitGrowing(patch)
  );

  return [fruitGrowing, `Fruits are growing`];
}

function areAnyCropsGrowing(game: GameState): Restriction {
  const cropsGrowing = Object.values(game.crops ?? {}).some((plot) =>
    isCropGrowing(plot)
  );

  return [cropsGrowing, "Crops are growing"];
}

function areAnyBasicCropsGrowing(game: GameState): Restriction {
  const cropsGrowing = Object.values(game.crops ?? {}).some(
    (plot) => plot.crop && isBasicCrop(plot.crop?.name) && isCropGrowing(plot)
  );

  return [cropsGrowing, "Basic crops are growing"];
}

function areAnyMediumCropsGrowing(game: GameState): Restriction {
  const cropsGrowing = Object.values(game.crops ?? {}).some(
    (plot) => plot.crop && isMediumCrop(plot.crop?.name) && isCropGrowing(plot)
  );

  return [cropsGrowing, "Medium crops are growing"];
}

function areAnyAdvancedCropsGrowing(game: GameState): Restriction {
  const cropsGrowing = Object.values(game.crops ?? {}).some(
    (plot) =>
      plot.crop && isAdvancedCrop(plot.crop?.name) && isCropGrowing(plot)
  );

  return [cropsGrowing, "Advanced crops are growing"];
}

function areAnyAdvancedOrMediumCropsGrowing(game: GameState): Restriction {
  const mediumCropsGrowing = areAnyMediumCropsGrowing(game)[0];
  if (mediumCropsGrowing) {
    return [mediumCropsGrowing, "Medium crops are growing"];
  }

  const advancedCropsGrowing = areAnyAdvancedCropsGrowing(game)[0];
  if (advancedCropsGrowing) {
    return [advancedCropsGrowing, "Advanced crops are growing"];
  }

  return [advancedCropsGrowing, "Medium crops are growing"];
}

function areAnyTreesChopped(game: GameState): Restriction {
  const treesChopped = Object.values(game.trees ?? {}).some(
    (tree) => !canChop(tree)
  );
  return [treesChopped, "Trees are chopped"];
}

function areAnyStonesMined(game: GameState): Restriction {
  const stoneMined = Object.values(game.stones ?? {}).some(
    (stone) => !canMine(stone)
  );
  return [stoneMined, "Stone is mined"];
}

function areAnyIronsMined(game: GameState): Restriction {
  const ironMined = Object.values(game.iron ?? {}).some(
    (iron) => !canMine(iron)
  );
  return [ironMined, "Iron is mined"];
}

function areAnyGoldsMined(game: GameState): Restriction {
  const goldMined = Object.values(game.gold ?? {}).some(
    (gold) => !canMine(gold)
  );
  return [goldMined, "Gold is mined"];
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

function areAnyChickensFed(game: GameState): Restriction {
  const chickensAreFed = Object.values(game.chickens).some(
    (chicken) =>
      chicken.fedAt && Date.now() - chicken.fedAt < CHICKEN_TIME_TO_EGG
  );

  return [chickensAreFed, "Chickens are fed"];
}

function areAnyTreasureHolesDug(game: GameState): Restriction {
  const holesDug = Object.values(game.treasureIsland?.holes ?? {}).some(
    (hole) => {
      const today = new Date().toISOString().substring(0, 10);

      return new Date(hole.dugAt).toISOString().substring(0, 10) == today;
    }
  );

  return [holesDug, "Treasure holes are dug"];
}

export const canShake = (shakenAt?: number) => {
  if (!shakenAt) return true;

  const today = new Date().toISOString().substring(0, 10);

  return new Date(shakenAt).toISOString().substring(0, 10) !== today;
};

function hasShakenManeki(game: GameState): Restriction {
  const manekiNekos = game.collectibles["Maneki Neko"] ?? [];
  const hasShakenRecently = manekiNekos.some((maneki) => {
    const shakenAt = maneki.shakenAt || 0;

    return !canShake(shakenAt);
  });

  return [hasShakenRecently, "Paw shaken"];
}

export const REMOVAL_RESTRICTIONS: Partial<
  Record<InventoryItemName, RemoveCondition>
> = {
  "Undead Rooster": (game) => areAnyChickensFed(game),
  "Ayam Cemani": (game) => areAnyChickensFed(game),
  "El Pollo Veloz": (game) => areAnyChickensFed(game),
  "Fat Chicken": (game) => areAnyChickensFed(game),
  "Rich Chicken": (game) => areAnyChickensFed(game),
  "Speed Chicken": (game) => areAnyChickensFed(game),
  "Chicken Coop": (game) => areAnyChickensFed(game),
  "Gold Egg": (game) => areAnyChickensFed(game),
  Rooster: (game) => areAnyChickensFed(game),
  Bale: (game) => areAnyChickensFed(game),

  Nancy: (game) => areAnyCropsGrowing(game),
  Scarecrow: (game) => areAnyCropsGrowing(game),
  Kuebiko: (game) => areAnyCropsGrowing(game),
  "Lunar Calendar": (game) => areAnyCropsGrowing(game),
  "Basic Scarecrow": (game) => areAnyBasicCropsGrowing(game),
  "Sir Goldensnout": (game) => areAnyCropsGrowing(game),
  "Scary Mike": (game) => areAnyMediumCropsGrowing(game),
  "Laurie the Chuckle Crow": (game) => areAnyAdvancedCropsGrowing(game),
  Gnome: (game) => areAnyAdvancedOrMediumCropsGrowing(game),
  "Basic Composter": (game) => areAnyCropsGrowing(game),
  "Advanced Composter": (game) => areAnyCropsGrowing(game),
  "Expert Composter": (game) => areAnyCropsGrowing(game),
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

  "Squirrel Monkey": (game) => areFruitsGrowing(game, "Orange"),
  "Black Bearry": (game) => areFruitsGrowing(game, "Blueberry"),
  "Lady Bug": (game) => areFruitsGrowing(game, "Apple"),

  "Woody the Beaver": (game) => areAnyTreesChopped(game),
  "Apprentice Beaver": (game) => areAnyTreesChopped(game),
  "Foreman Beaver": (game) => areAnyTreesChopped(game),
  "Wood Nymph Wendy": (game) => areAnyTreesChopped(game),
  "Tiki Totem": (game) => areAnyTreesChopped(game),

  "Rock Golem": (game) => areAnyStonesMined(game),
  "Tunnel Mole": (game) => areAnyStonesMined(game),
  "Rocky the Mole": (game) => areAnyIronsMined(game),
  "Iron Idol": (game) => areAnyIronsMined(game),
  Nugget: (game) => areAnyGoldsMined(game),
  "Tin Turtle": (game) => areAnyStonesMined(game),
  "Emerald Turtle": (game) => areAnyMineralsMined(game),

  "Heart of Davy Jones": (game) => areAnyTreasureHolesDug(game),

  "Maneki Neko": (game) => hasShakenManeki(game),

  "Carrot Sword": (game) => beanIsPlanted(game),

  "Stellar Sunflower": (game) => cropIsGrowing({ item: "Sunflower", game }),
  "Potent Potato": (game) => cropIsGrowing({ item: "Potato", game }),
  "Radical Radish": (game) => cropIsGrowing({ item: "Radish", game }),
};

export const BUD_REMOVAL_RESTRICTIONS: Record<
  StemTrait | TypeTrait,
  RemoveCondition
> = {
  // HATS
  "3 Leaf Clover": (game) => areAnyCropsGrowing(game),
  // TODO Fish Hat needs to be implemented
  "Fish Hat": (game) => [false, "No restriction"],
  "Diamond Gem": (game) => areAnyMineralsMined(game),
  "Gold Gem": (game) => areAnyGoldsMined(game),
  "Miner Hat": (game) => areAnyIronsMined(game),
  "Carrot Head": (game) => cropIsGrowing({ item: "Carrot", game }),
  "Basic Leaf": (game) => areAnyBasicCropsGrowing(game),
  "Sunflower Hat": (game) => cropIsGrowing({ item: "Sunflower", game }),
  "Ruby Gem": (game) => areAnyStonesMined(game),
  Mushroom: (game) => [false, "No restriction"],
  "Magic Mushroom": (game) => [false, "No restriction"],
  "Acorn Hat": (game) => areAnyTreesChopped(game),
  Banana: (game) => areAnyFruitsGrowing(game),
  "Tree Hat": (game) => areAnyTreesChopped(game),
  "Egg Head": (game) => areAnyChickensFed(game),
  "Apple Head": (game) => areAnyFruitsGrowing(game),

  "Axe Head": (game) => [false, "No restriction"],
  "Rainbow Horn": (game) => [false, "No restriction"],
  "Red Bow": (game) => [false, "No restriction"],
  "Silver Horn": (game) => [false, "No restriction"],
  "Sunflower Headband": (game) => [false, "No restriction"],
  "Sunshield Foliage": (game) => [false, "No restriction"],
  "Tender Coral": (game) => [false, "No restriction"],
  Seashell: (game) => [false, "No restriction"],
  Hibiscus: (game) => [false, "No restriction"],

  // TYPES
  Plaza: (game) => areAnyBasicCropsGrowing(game),
  Woodlands: (game) => areAnyTreesChopped(game),
  Cave: (game) => areAnyMineralsMined(game),
  // TODO Sea needs to be implemented
  Sea: (game) => [false, "No restriction"],
  Castle: (game) => areAnyMediumCropsGrowing(game),
  // TODO Port needs to be implemented
  Port: (game) => [false, "No restriction"],
  Retreat: (game) => areAnyChickensFed(game),
  Saphiro: (game) => areAnyCropsGrowing(game),
  Snow: (game) => areAnyAdvancedCropsGrowing(game),
  Beach: (game) => areAnyFruitsGrowing(game),
};

export const hasBudRemoveRestriction = (
  state: GameState,
  bud: Bud
): Restriction => {
  const stemRemoveRestriction = BUD_REMOVAL_RESTRICTIONS[bud.stem];
  const typeRemoveRestriction = BUD_REMOVAL_RESTRICTIONS[bud.type];

  const [stemRestricted, stemReason] = stemRemoveRestriction(state);
  if (stemRestricted) return [stemRestricted, stemReason];

  const [typeRestricted, typeReason] = typeRemoveRestriction(state);
  if (typeRestricted) return [typeRestricted, typeReason];

  return [false, "No restriction"];
};

export const hasRemoveRestriction = (
  name: InventoryItemName | "Bud",
  id: string,
  state: GameState
): Restriction => {
  if (name === "Bud") {
    const bud = state.buds?.[Number(id)];
    return bud
      ? hasBudRemoveRestriction(state, bud)
      : [false, "No restriction"];
  }

  if (name === "Genie Lamp") {
    const collectibleGroup = state.collectibles[name];
    if (!collectibleGroup) return [true, "Genie Lamp rubbed"];

    const collectibleToRemove = collectibleGroup.find(
      (collectible) => collectible.id === id
    );
    if (!collectibleToRemove) return [true, "Genie Lamp rubbed"];

    const rubbedCount = collectibleToRemove.rubbedCount ?? 0;
    if (rubbedCount > 0) {
      return [true, "Genie Lamp rubbed"];
    }
  }

  if (name === "Chicken Coop") {
    if (areUnsupportedChickensBrewing(state)) return [true, "Chickens are fed"];
  }

  const removeRestriction = REMOVAL_RESTRICTIONS[name];
  if (removeRestriction) return removeRestriction(state);

  return [false, "No restriction"];
};

export const hasMoveRestriction = (
  name: InventoryItemName,
  id: string,
  state: GameState
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
    state
  );

  return [isRestricted && isAoEItem, restrictionReason];
};
